import {IPayrollEmployee} from 'interfaces/payroll/payroll.interface';
import {GhanaTax} from './ghana.tax';
import {KenyaTax} from './kenya.tax';
import {NigeriaTax} from './nigeria.tax';
import {RwandaTax} from './rwanda.tax';
import {CountryTaxService, ProcessTaxPayload} from './tax.types';

export class TaxService {
  private static countryTaxServices: Record<string, CountryTaxService> = {};

  private static registered = false;

  private static registerServices(context: ProcessTaxPayload) {
    if (this.registered) {
      return;
    }

    TaxService.countryTaxServices[NigeriaTax.country] = new NigeriaTax(context);
    TaxService.countryTaxServices[GhanaTax.country] = new GhanaTax(context);
    TaxService.countryTaxServices[KenyaTax.country] = new KenyaTax(context);
    TaxService.countryTaxServices[RwandaTax.country] = new RwandaTax(context);

    this.registered = true;
  }

  static get(name: string, context: ProcessTaxPayload) {
    this.registerServices(context);

    const service = TaxService.countryTaxServices[name];
    if (!service) {
      throw new Error(`tax service for '${name}' does not exist`);
    }

    return service;
  }

  static process(
    country: string,
    context: ProcessTaxPayload,
    employee: IPayrollEmployee
  ) {
    return TaxService.get(country, context).process(employee);
  }
}
