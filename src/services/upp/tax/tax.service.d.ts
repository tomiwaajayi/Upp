import { IPayrollEmployee } from 'interfaces/payroll/payroll.interface';
import { CountryTaxService, ProcessTaxPayload } from './tax.types';
export declare class TaxService {
    private static countryTaxServices;
    private static registered;
    private static registerServices;
    static get(name: string, context: ProcessTaxPayload): CountryTaxService;
    static process(country: string, context: ProcessTaxPayload, employee: IPayrollEmployee): void;
}
