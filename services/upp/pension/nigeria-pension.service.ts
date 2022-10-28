import {BaseCountryPensionService} from './base.service';
import {ProcessPensionPayload} from './pension.types';

export class NigeriaPensionService extends BaseCountryPensionService {
  constructor() {
    super(8, 10);
  }

  static country = 'Nigeria';

  remitEnabled(payload: ProcessPensionPayload): boolean {
    const enabled = super.remitEnabled(payload);
    const {employee} = payload;

    return (
      enabled &&
      !!employee.pensionId &&
      !!employee.pensionFundAdmin &&
      /^[a-zA-Z0-9]{15}$/.test(employee.pensionId)
    );
  }
}
