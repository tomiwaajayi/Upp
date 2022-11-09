import { IMoney } from '../../interfaces/payment/money.interface';
import { IPayrollEmployee } from '../../interfaces/payroll/payroll.interface';
import { BaseClass } from './base.tax';
import { ProcessTaxPayload } from './tax.types';
export declare class GhanaTax extends BaseClass {
    static country: string;
    private taxSettings;
    constructor(context: ProcessTaxPayload);
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
    getTier3Relief(base: IMoney, basicPercent: number, { voluntaryPensionContribution, voluntaryPensionContributionEmployer, }: Record<string, IMoney>): {
        tier3Relief: IMoney;
        excess: IMoney;
    };
    calculateTax(taxableIncome: number, employeeCountry: string): number;
}
