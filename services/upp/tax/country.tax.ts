import {COUNTRY} from '../../../constants/services.constant';
import {
  Organization,
  OrganizationSettings,
} from '../../../interfaces/account/organization.interface';
import {Country} from '../../../interfaces/base.interface';
import {IPayrollMeta} from '../../../interfaces/payroll/payroll.interface';
import {BaseClass} from './base.tax';
import {GhanaTax} from './ghana.tax';
import {KenyaTax} from './kenya.tax';
import {NigeriaTax} from './nigeria.tax';
import {RwandaTax} from './rwanda.tax';

export class CountryTax {
  public static get(
    organization: Organization,
    country: Country,
    settings: OrganizationSettings,
    meta: IPayrollMeta
  ) {
    switch (country.code) {
      case COUNTRY.NGN: {
        return new NigeriaTax({organization, country, settings, meta});
      }
      case COUNTRY.GHS: {
        return new GhanaTax({organization, country, settings, meta});
      }
      case COUNTRY.KES: {
        return new KenyaTax({organization, country, settings, meta});
      }
      case COUNTRY.RWF: {
        return new RwandaTax({organization, country, settings, meta});
      }
      default:
        return new BaseClass({organization, country, settings, meta});
    }
  }
}
