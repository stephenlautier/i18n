import {I18N} from './i18n';
import {EventAggregator} from 'aurelia-event-aggregator';
import {customAttribute} from 'aurelia-templating';
import {SignalBindingBehavior} from 'aurelia-templating-resources';
import {ValueConverter} from 'aurelia-binding';
import {LazyOptional} from './utils';


export class TValueConverter {
  static inject() { return [I18N]; }
  constructor(i18n) {
    this.service = i18n;
  }

  toView(value, options) {
    return this.service.tr(value, options);
  }
}

@customAttribute('t-params')
export class TParamsCustomAttribute {
  static inject = [Element];
  service;

  constructor(element) {
    this.element = element;
  }

  valueChanged() {

  }
}

@customAttribute('t')
export class TCustomAttribute {

  static inject = [Element, I18N, EventAggregator, LazyOptional.of(TParamsCustomAttribute)];

  constructor(element, i18n, ea, tparams) {
    this.element = element;
    this.service = i18n;
    this.ea = ea;
    this.lazyParams = tparams;
  }

  bind() {
    this.params = this.lazyParams();
    this.timers = [];

    this.timers.push(setTimeout( () => {
      if (this.params) {
        this.params.valueChanged = (newParams, oldParams) => {
          this.paramsChanged(this.value, newParams, oldParams);
        };
      }

      let p = this.params !== null ? this.params.value : undefined;
      this.subscription = this.ea.subscribe('i18n:locale:changed', () => {
        this.service.updateValue(this.element, this.value, p);
      });

      this.timers.push(setTimeout( () => {
        this.service.updateValue(this.element, this.value, p);
      }));
    }));
  }

  paramsChanged(newValue, newParams) {
    this.service.updateValue(this.element, newValue, newParams);
  }

  valueChanged(newValue) {
    let p = this.params !== null ? this.params.value : undefined;
    this.service.updateValue(this.element, newValue, p);
  }

  unbind() {
    // Clear timers so that we do not run unecessary code after unbinding
    this.timers.forEach(t => clearTimeout(t));
    // If unbind is called before timeout for subscription is triggered, subscription will be undefined
    if (this.subscription) {
      this.subscription.dispose();
    }
  }
}

export class TBindingBehavior {
  static inject = [SignalBindingBehavior];

  constructor(signalBindingBehavior) {
    this.signalBindingBehavior = signalBindingBehavior;
  }

  bind(binding, source) {
    // bind the signal behavior
    this.signalBindingBehavior.bind(binding, source, 'aurelia-translation-signal');

    // rewrite the expression to use the TValueConverter.
    // pass through any args to the binding behavior to the TValueConverter
    let sourceExpression = binding.sourceExpression;
    let expression = sourceExpression.expression;
    sourceExpression.expression = new ValueConverter(
      expression,
      't',
      sourceExpression.args,
      [expression, ...sourceExpression.args]);
  }

  unbind(binding, source) {
    // undo the expression rewrite
    binding.sourceExpression.expression = binding.sourceExpression.expression.expression;

    // unbind the signal behavior
    this.signalBindingBehavior.unbind(binding, source);
  }
}
