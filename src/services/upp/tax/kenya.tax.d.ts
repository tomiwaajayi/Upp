import { IMoney } from '@sh/interfaces/payment/money.interface';
import { IPayrollEmployee } from '@sh/interfaces/payroll/payroll.interface';
import { BaseClass } from '@upp/tax/base.tax';
import { ProcessTaxPayload } from '@upp/tax/tax.types';
export declare class KenyaTax extends BaseClass {
    static country: string;
    private taxSettings;
    constructor(context: ProcessTaxPayload);
    getTaxableSalary(employee: IPayrollEmployee, grossSalary: IMoney): {
        totalRelief: IMoney;
        taxableSalary: IMoney;
    };
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
    isMinimumWage(employee: IPayrollEmployee): boolean;
    exempt(employee: IPayrollEmployee): boolean;
    calculateTax(taxableIncome: number): number;
}
