import { Organization } from '../interfaces/account/organization.interface';
import { IMoney } from '../interfaces/payment/money.interface';
import { IPayrollEmployee } from '../interfaces/payroll/payroll.interface';
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
    private organizationCountry;
    /**
     * This holds query data or data from backend that needs to be input in each processes
     */
    private meta;
    private data;
    private processedPayrollTotals;
    constructor(data: BuilderPayload);
    /**
     * This part consists of prorate  only
     * @returns
     */
    private buildPartA;
    /**
     * This part consists of prorate, bonuses/allowances of all types including BIK, and deductions of all types
     * @ bonus, untaxed bonus, extra month, leave allowance, bik, deductions and cdb loans
     * @returns
     */
    private buildPartB;
    /**
     * This part consists of Health access calculation and all statutory remittance calculations EXCEPT Tax
     * @ health access, nhif, nsitf, pension, itf, nhf
     * @returns
     */
    private buildPartC;
    /**
     * This part holds tax calculation and payroll build final steps
     * Commitments should go here
     * @ tax, org deductions, pay frequency, commitments, employee addons, worksheet reset
     * @returns
     */
    private buildPartD;
    /**
     * This part calculates totals for payroll
     * @returns
     */
    private buildPartE;
    private getResponse;
    /**
     * You must call this method to return the payroll object
     * @returns payroll
     */
    get(): {
        organization: Organization;
        employees: IPayrollEmployee[];
        payItem: Record<string, string>;
        deselected: string[];
        proRateMonth: string;
        createdBy: string;
        remittances?: Record<string, Record<string, import("../interfaces/payroll/payroll.interface").IPayrollRemittance>> | undefined;
        hasProrates?: boolean | undefined;
        totalCharge?: Record<string, IMoney> | undefined;
        totalBonus?: Record<string, IMoney> | undefined;
        totalUntaxedBonus?: Record<string, IMoney> | undefined;
        totalExtraMonthBonus?: Record<string, IMoney> | undefined;
        totalLeaveAllowance?: Record<string, IMoney> | undefined;
        totalBase: Record<string, IMoney>;
        totalStatutories: Record<string, Record<string, IMoney>>;
        totalPension?: Record<string, IMoney> | undefined;
    };
    getData(): BuilderPayload;
    getProcessedEmployees(): IPayrollEmployee[];
    getTotals(): {
        organization: Organization;
        employees: IPayrollEmployee[];
        payItem: Record<string, string>;
        deselected: string[];
        proRateMonth: string;
        createdBy: string;
        remittances?: Record<string, Record<string, import("../interfaces/payroll/payroll.interface").IPayrollRemittance>> | undefined;
        hasProrates?: boolean | undefined;
        totalCharge?: Record<string, IMoney> | undefined;
        totalBonus?: Record<string, IMoney> | undefined;
        totalUntaxedBonus?: Record<string, IMoney> | undefined;
        totalExtraMonthBonus?: Record<string, IMoney> | undefined;
        totalLeaveAllowance?: Record<string, IMoney> | undefined;
        totalBase: Record<string, IMoney>;
        totalStatutories: Record<string, Record<string, IMoney>>;
        totalPension?: Record<string, IMoney> | undefined;
    };
    /**
     * Process single employee prorate
     * note that there can only be a single prorate entry for an employee
     */
    processProRates(employee: IPayrollEmployee): void;
    /**
     * In a single loop processes single employee bonus, untaxed bonus, extra month, leave allowance, and deductions
     */
    private processBonuses;
    /**
     * In a single loop processes single employee bonus, untaxed bonus, extra month, leave allowance, and deductions
     */
    private processDeductions;
    /**
     * Nigeria - NHF, ITF, NSITF
     * Kenya - NHIF
     * Rwanda -
     * * Should implement a factory design pattern check Pay v2 tax or pension setup and link
     * https://sbcode.net/typescript/factory/
     */
    private processCountryStatutory;
    private updatePayrollStatutoryTotal;
    private calculateNHF;
    private calculateNHIF;
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
    private processPension;
    /**
     * Process net salary for all countries
     * Should implement a factory design pattenr
     * https://sbcode.net/typescript/factory/
     */
    private processNetSalary;
    /**
     * Process all totals on payroll
     * Should implement a factory design pattenr
     * https://sbcode.net/typescript/factory/
     */
    private processPayrollTotals;
}
