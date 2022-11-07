import { BuilderPayload } from './builder.interface';
/**
 * This builder is used to create a payroll object
 */
export declare class PayrollDirector {
    static build(data: BuilderPayload): {
        organization: import("../../interfaces/account/organization.interface").Organization;
        employees: import("../../interfaces/payroll/payroll.interface").IPayrollEmployee[];
        payItem: import("../../interfaces/payroll/payroll.interface").PayItem;
        deselected: string[];
        proRateMonth: string;
        createdBy: string;
        remittances?: Record<string, Record<string, import("../../interfaces/payroll/payroll.interface").IPayrollRemittance>> | undefined;
        hasProrates?: boolean | undefined;
        totalCharge?: import("../../interfaces/payment/money.interface").IMoney | undefined;
        totalBonus?: Record<string, import("../../interfaces/payment/money.interface").IMoney> | undefined;
        totalUntaxedBonus?: Record<string, import("../../interfaces/payment/money.interface").IMoney> | undefined;
        totalExtraMonthBonus?: Record<string, import("../../interfaces/payment/money.interface").IMoney> | undefined;
        totalLeaveAllowance?: Record<string, import("../../interfaces/payment/money.interface").IMoney> | undefined;
        totalBase: Record<string, import("../../interfaces/payment/money.interface").IMoney>;
        totalStatutories: Record<string, Record<string, import("../../interfaces/payment/money.interface").IMoney>>;
        totalPension?: Record<string, import("../../interfaces/payment/money.interface").IMoney> | undefined;
    };
}
