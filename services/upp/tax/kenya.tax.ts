import {BaseClass} from './base.tax';
import {ProcessTaxPayload} from './tax.types';

export class KenyaTax extends BaseClass {
  static country = 'Kenya';

  constructor(context: ProcessTaxPayload) {
    super(context);
  }
}
