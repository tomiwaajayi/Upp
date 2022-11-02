import {BaseClass} from './base.tax';
import {ProcessTaxPayload} from './tax.types';

export class GhanaTax extends BaseClass {
  static country = 'Ghana';
  constructor(context: ProcessTaxPayload) {
    super(context);
  }
}
