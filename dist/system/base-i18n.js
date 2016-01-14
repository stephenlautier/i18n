System.register(['./i18n', 'aurelia-event-aggregator'], function (_export) {
  'use strict';

  var I18N, EventAggregator, BaseI18N;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_i18n) {
      I18N = _i18n.I18N;
    }, function (_aureliaEventAggregator) {
      EventAggregator = _aureliaEventAggregator.EventAggregator;
    }],
    execute: function () {
      BaseI18N = (function () {
        _createClass(BaseI18N, null, [{
          key: 'inject',
          value: [I18N, Element, EventAggregator],
          enumerable: true
        }]);

        function BaseI18N(i18n, element, ea) {
          var _this = this;

          _classCallCheck(this, BaseI18N);

          this.i18n = i18n;
          this.element = element;

          this.__i18nDisposer = ea.subscribe('i18n:locale:changed', function () {
            _this.i18n.updateTranslations(_this.element);
          });
        }

        BaseI18N.prototype.attached = function attached() {
          this.i18n.updateTranslations(this.element);
        };

        BaseI18N.prototype.detached = function detached() {
          this.__i18nDisposer.dispose();
        };

        return BaseI18N;
      })();

      _export('BaseI18N', BaseI18N);
    }
  };
});