import { IPayrollEmployee } from '@sh/interfaces/payroll/payroll.interface';
import { CountryTaxService, ProcessTaxPayload } from '@upp/tax/tax.types';
export declare class TaxService {
    private static countryTaxServices;
    private static registered;
    private static registerServices;
    static get(name: string, context: ProcessTaxPayload): CountryTaxService;
    static process(country: string, context: ProcessTaxPayload, employee: IPayrollEmployee): void;
}
