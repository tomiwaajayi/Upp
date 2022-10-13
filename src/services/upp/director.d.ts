import { Organization } from '../../interfaces/account/organization.interface';
import { IPayroll, IPayrollDTO, IPayrollEmployee, IPayrollMeta } from '../../interfaces/payroll/payroll.interface';
/**
 * This builder is used to create a payroll object
 */
export declare class PayrollBuilder {
    private _payroll;
    private _employees;
    private _organization;
    private _meta;
    constructor(employees: IPayrollEmployee[], organization: Organization, meta: IPayrollMeta, payrollData: IPayrollDTO);
    /**
     * Process single employee prorate
     * note that there can only be a single prorate entry for an employee
     */
    processProRates(employee: IPayrollEmployee): void;
    /**
     * Call this method to return a promise of the resulting operation
     */
    build(): Promise<IPayroll>;
}
