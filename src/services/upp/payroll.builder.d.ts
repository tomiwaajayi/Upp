import { Organization } from '../../interfaces/account/organization.interface';
import { IMoney } from '../../interfaces/payment/money.interface';
import { IPayrollEmployee } from '../../interfaces/payroll/payroll.interface';
import { BuilderPayload, IPayrollBuilder } from './builder.interface';
/**
 * To improve the speed, this builder implements the Builder Design Pattern.
 * There are 4 ordinal build parts that must be called in order from the get method,
 * which returns the processed payroll object
 */
export declare class PayrollBuilder implements IPayrollBuilder {
    /** The payroll object in creation */
    private payroll;
    /** List of employees in payroll */
    private employees;
    private organization;
    private organizationSettings;
    /**
     * This holds query data or data from backend that needs to be input in each processes
     */
    private meta;
    constructor(data: BuilderPayload);
    /**
     * This part consists of prorate  only
     * @returns
     */
    protected buildPartA(employee: IPayrollEmployee): this;
    /**
     * This part consists of prorate, bonuses/allowances of all types including BIK, and deductions of all types
     * @ bonus, untaxed bonus, extra month, leave allowance, bik, deductions and cdb loans
     * @returns
     */
    protected buildPartB(employee: IPayrollEmployee): this;
    /**
     * This part consists of Health access calculation and all statutory remittance calculations EXCEPT Tax
     * @ health access, nhif, nsitf, pension, itf, nhf
     * @returns
     */
    protected buildPartC(employee: IPayrollEmployee): this;
    /**
     * This part holds tax calculation and payroll build final steps
     * Commitments should go here
     * @ tax, org deductions, pay frequency, commitments, employee addons, worksheet reset
     * @returns
     */
    protected buildPartD(employee: IPayrollEmployee): this;
    /**
     * You must call this method to return the payroll object
     * @returns payroll
     */
    get(): {
        organization: Organization;
        employees: IPayrollEmployee[];
        payItem: import("../../interfaces/payroll/payroll.interface").PayItem;
        deselected: string[];
        proRateMonth: string;
        createdBy: string;
        remittances?: import("../../interfaces/payroll/payroll.interface").IPayrollRemittance[] | undefined;
        hasProrates?: boolean | undefined;
        totalCharge?: IMoney | undefined;
    };
    /**
     * Process single employee prorate
     * note that there can only be a single prorate entry for an employee
     */
    processProRates(employee: IPayrollEmployee): void;
    /**
     * In a single loop processes single employee bonus, untaxed bonus, extra month, leave allowance, and deductions
     */
    processBonuses(employee: IPayrollEmployee): void;
    /**
     * Nigeria - NHF, ITF, NSITF
     * Kenya - NHIF
     * Rwanda -
     * * Should implement a factory design pattern check Pay v2 tax or pension setup and link
     * https://sbcode.net/typescript/factory/
     */
    processCountryStatutory(employee: IPayrollEmployee): void;
    calculateNHF(salaryBreakdown: Record<string, number>, grossMonthly: IMoney, percentage: IMoney, enableConsolidatedGross?: boolean): IMoney;
    calculateNHIF(grossSalary: IMoney): IMoney;
    /**
     * Process Tax for all countries
     * Should implement a factory design pattern check Pay v2 tax or pension setup and link
     * https://sbcode.net/typescript/factory/
     */
    processTax(employee: IPayrollEmployee): void;
    /**
     * Process Pension for all countries
     * Should implement a factory design pattern check Pay v2 tax or pension setup and link
     * https://sbcode.net/typescript/factory/
     */
    processPension(employee: IPayrollEmployee): void;
}
