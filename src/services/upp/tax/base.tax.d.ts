import { Organization } from '../../../interfaces/account/organization.interface';
import { IMoney } from '../../../interfaces/payment/money.interface';
import { IPayrollEmployee, IPayrollMeta, OrganizationSettings } from '../../../interfaces/payroll/payroll.interface';
import { CountryTaxService, ProcessTaxPayload } from './tax.types';
export declare class BaseClass implements CountryTaxService {
    protected organization: Organization;
    protected settings: OrganizationSettings;
    protected meta: IPayrollMeta;
    constructor(context: ProcessTaxPayload);
    process(employee: IPayrollEmployee): void;
    calculateWithHoldingTax(taxableIncome: IMoney, whtaxRate: number): IMoney;
    calculateWithHoldingTaxRelief(employee: IPayrollEmployee): {
        relief: {
            value: number;
            currency: string;
        };
        taxableSalary: IMoney;
    };
    processEmployeeWHT(employee: IPayrollEmployee): {
        relief: {
            relief: {
                value: number;
                currency: string;
            };
            taxableSalary: IMoney;
        };
        tax: IMoney;
    };
    exempt(employee: IPayrollEmployee): boolean;
    processEmployeeTax(employee: IPayrollEmployee): {
        relief: {
            relief: IMoney;
            taxableSalary: IMoney;
        };
        tax: {
            value: number;
            currency: string;
        };
    };
    protected getBreakdown(employee: IPayrollEmployee): Record<string, number>;
}
