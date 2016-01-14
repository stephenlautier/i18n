import {I18N} from '../../src/i18n';
import {BindingSignaler} from 'aurelia-templating-resources';
import {DfValueConverter} from '../../src/df';
import {EventAggregator} from 'aurelia-event-aggregator';

describe('dfvalueconverter tests', () => {

  let sut, dfvc;

  beforeEach(() => {
    sut = new I18N(new EventAggregator(), new BindingSignaler());
    dfvc = new DfValueConverter(sut);
  });

  it('should display only the date in the setup locale format by default', () => {
    let testDate = new Date(2000, 0, 1, 0, 0, 1);

    expect(dfvc.toView(testDate)).toEqual('1/1/2000');
  });

  it('should display date in the previously modified locale', (done) => {
    sut.setLocale('de').then( () => {
      let testDate = new Date(2000, 0, 1, 0, 0, 1);
      expect(dfvc.toView(testDate)).toEqual('1.1.2000');
      done();
    });
  });

  it('should display datetime', () => {
    let options = {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false
    };
    let testDate = new Date(2000, 0, 1, 0, 0, 1);
    expect(dfvc.toView(testDate, options, 'de')).toEqual('01.01.2000, 00:00:01');
  });

});
