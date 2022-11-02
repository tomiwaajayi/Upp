import {BaseClass, CountryTaxPayload, ITax} from './base.tax';

export class GhanaTax extends BaseClass implements ITax {
  constructor(payload: CountryTaxPayload) {
    super(payload);
  }
}
