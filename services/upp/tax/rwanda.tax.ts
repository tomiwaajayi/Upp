import {BaseClass} from './base.tax';
import {ProcessTaxPayload} from './tax.types';

export class RwandaTax extends BaseClass {
  static country = 'Rwanda';

  constructor(context: ProcessTaxPayload) {
    super(context);
  }
}
