import { BuilderPayload } from './builder.interface';
/**
 * This builder is used to create a payroll object
 */
export declare class PayrollDirector {
    static construct(data: BuilderPayload): {
        organization: import("../../interfaces/account/organization.interface").Organization;
        employees: import("../../interfaces/payroll/payroll.interface").IPayrollEmployee[];
        payItem: import("../../interfaces/payroll/payroll.interface").PayItem;
        deselected: string[];
        proRateMonth: string;
        createdBy: string;
        remittances?: import("../../interfaces/payroll/payroll.interface").IPayrollRemittance[] | undefined;
        hasProrates?: boolean | undefined;
    };
}
