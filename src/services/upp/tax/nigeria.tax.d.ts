import { IMoney } from '../../../interfaces/payment/money.interface';
import { IPayrollEmployee } from '../../../interfaces/payroll/payroll.interface';
import { BaseClass } from './base.tax';
import { ProcessTaxPayload } from './tax.types';
export declare class NigeriaTax extends BaseClass {
    static country: string;
    private taxSettings;
    constructor(context: ProcessTaxPayload);
    getConsolidatedRelief(gross: IMoney, grossCRA: IMoney, useCRAGross: boolean): IMoney;
    isMinimumWage(employee: IPayrollEmployee): boolean;
    exempt(employee: IPayrollEmployee): boolean;
    getTaxableSalary(employee: IPayrollEmployee, grossSalary: IMoney): {
        totalRelief: IMoney;
        taxableSalary: IMoney;
    };
    calculateTaxRelief(employee: IPayrollEmployee): {
        relief: IMoney;
        taxableSalary: IMoney;
    };
    calculateTax(taxableIncome: number): number;
    processEmployeeTax(employee: IPayrollEmployee): {
        tax: IMoney;
        relief: {
            relief: IMoney;
            taxableSalary: IMoney;
        };
    };
}
