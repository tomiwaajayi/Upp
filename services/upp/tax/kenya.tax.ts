import {BaseClass, CountryTaxPayload} from './base.tax';

export class KenyaTax extends BaseClass {
  constructor(payload: CountryTaxPayload) {
    super(payload);
  }
}
