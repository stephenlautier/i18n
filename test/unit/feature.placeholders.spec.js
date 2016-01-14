import {I18N} from '../../src/i18n';
import {BindingSignaler} from 'aurelia-templating-resources';
import {EventAggregator} from 'aurelia-event-aggregator';

describe('feature verification placeholders', () => {

  let sut;

  beforeEach( () => {
    let resources = {
      en: {
        translation: {
          'demo': '__framework__ is the __quality__ framework in the world',
          'curlies': 'using curlies is {difficulty}',
          'es6interpolation': 'you can use ${type} as well'
        }
      }
    };

    sut = new I18N(new EventAggregator(), new BindingSignaler());
    sut.setup({
      resStore: resources,
      lng: 'en',
      getAsync: false,
      sendMissing: false,
      fallbackLng: 'en',
      debug: false
    });
  });

  it('should replace all given variables and return translation', () => {
    expect(sut.tr('demo', { framework: 'Aurelia', quality: 'best' })).toEqual('Aurelia is the best framework in the world');
  });

  it('should use curly variable handles', () => {
    let options = { difficulty: 'easy', interpolationPrefix: '{', interpolationSuffix: '}'};

    expect(sut.tr('curlies', options)).toBe('using curlies is easy');
  });

  it('should use es6 interpolation variable handles', () => {
    let options = { type: 'interpolation', interpolationPrefix: '${', interpolationSuffix: '}'};

    expect(sut.tr('es6interpolation', options)).toBe('you can use interpolation as well');
  });
});
