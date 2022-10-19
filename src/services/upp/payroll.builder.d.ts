import { Organization } from '../../interfaces/account/organization.interface';
import { IPayrollEmployee } from '../../interfaces/payroll/payroll.interface';
import { BuilderPayload, IPayrollBuilder } from './builder.interface';
export declare class PayrollBuilder implements IPayrollBuilder {
    /** The payroll object in creation */
    private payroll;
    /** List of employees in payroll */
    private employees;
    private organization;
    /**
     * This holds query data or data from backend that needs to be input in each processes
     */
    private meta;
    constructor(data: BuilderPayload);
    /**
     * Process single employee prorate
     * note that there can only be a single prorate entry for an employee
     */
    processProRates(employee: IPayrollEmployee): void;
    buildPartA(): this;
    buildPartB(): this;
    buildPartC(): Promise<this>;
    get(): {
        organization: Organization;
        employees: IPayrollEmployee[];
        payItem: import("../../interfaces/payroll/payroll.interface").PayItem;
        deselected: string[];
        proRateMonth: string;
        createdBy: string;
        remittances?: import("../../interfaces/payroll/payroll.interface").IPayrollRemittance[] | undefined;
        hasProrates?: boolean | undefined;
    };
}
