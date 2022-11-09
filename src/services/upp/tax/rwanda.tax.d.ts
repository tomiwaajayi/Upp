import { IMoney } from '../../../interfaces/payment/money.interface';
import { IPayrollEmployee } from '../../../interfaces/payroll/payroll.interface';
import { BaseClass } from './base.tax';
import { ProcessTaxPayload } from './tax.types';
export declare class RwandaTax extends BaseClass {
    static country: string;
    protected taxSettings: {
        MINIMUM_WAGE: number;
    };
    constructor(context: ProcessTaxPayload);
    isMinimumWage(employee: IPayrollEmployee): boolean;
    exempt(employee: IPayrollEmployee): boolean;
    calculateTaxRelief(employee: IPayrollEmployee): {
        relief: IMoney;
        taxableSalary: IMoney;
    };
    processEmployeeTax(employee: IPayrollEmployee): {
        tax: IMoney;
        relief: {
            relief: IMoney;
            taxableSalary: IMoney;
        };
    };
    calculateTax(taxableIncome: number, employmentType: string): number;
}
