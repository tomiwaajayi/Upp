import { IMoney } from '../payment/money.interface';
import { Organization } from './organization.interface';
export declare class CheckEmployeeDTO {
    emailOrPhonenumber?: string;
    employeeId?: string;
}
export interface ICheckEmployeeResponse {
    companyName: string;
    companyLogo: string;
    employeeId: string;
    firstName: string;
    workEmail: string;
    country: string;
    phoneNumber: string;
    organization: string;
    lastName: string;
    user?: string;
    employeeExist: boolean;
}
export interface Employee {
    id: string;
    country: string;
    workEmail: string;
    firstName: string;
    middleName?: string;
    lastName: string;
    phoneNumber: string;
    gender?: GenderEnum | string;
    bankName?: string;
    bankId?: string;
    accountNumber?: string;
    salaryType?: SalaryTypeEnum | string;
    ibanAccountNumber?: string;
    swiftBIC?: string;
    bankAddress?: string;
    cryptoWalletAddress?: string;
    cryptoNetwork?: string;
    dob?: Date;
    employedAt?: Date;
    createdBy: string;
    isDeleted?: boolean;
    deletedAt?: Date;
    department?: string;
    currency: SupportedCurrencyEnum | string;
    swiftCode?: string;
    walletAddress?: string;
    organization: Organization | string;
    invitationSent?: boolean;
    salary?: number;
    group?: string;
    taxState?: string;
    taxId?: string;
    pensionFundAdmin?: string;
    pensionId?: string;
    nhfId?: string;
    itfId?: string;
    nsitfId?: string;
    nhifId?: string;
    hasHealthAccessEnabled?: boolean;
    hasHealthAccessRemit?: boolean;
    healthReliefAmount?: number;
    hasHealthReliefEnabled?: boolean;
    hasSalaryBreakdown?: boolean;
    salaryBreakdown?: Map<string, number>;
    completionStatus?: EmployeeCompletionStatus | string;
    /** Virtuals */
    bonuses?: EmployeeSalaryAddon[];
    deductions?: EmployeeSalaryAddon[];
    biks?: string[];
    proratedSalaries?: string[];
}
export interface EmployeeSalaryAddon {
    id: string;
    name: string;
    employee: Employee | string;
    organization: Organization | string;
    amount: IMoney;
    frequency: SalaryAddonFrequencyEnum | string;
    type: SalaryAddonTypeEnum | string;
    mode?: BonusSalaryModeEnum | string;
    startDate?: Date;
    endDate?: Date;
    status?: SalaryAddonStatusEnum | string;
    createdBy: string;
    isDeleted?: boolean;
    deletedAt?: Date;
}
export declare enum SalaryAddonFrequencyEnum {
    Once = "once",
    Recurring = "recurring"
}
export declare enum SalaryAddonTypeEnum {
    Bonus = "bonus",
    Deduction = "deduction",
    Protate = "prorate"
}
export declare enum BonusSalaryModeEnum {
    Quick = "quick",
    UnTaxed = "untaxed",
    LeaveAllowance = "leave-allowance",
    ExtraMonth = "extra-month"
}
export declare enum SalaryAddonStatusEnum {
    Pending = "pending",
    Processing = "processing",
    Completed = "completed"
}
export declare enum EmployeeCompletionStatus {
    Complete = "All info complete",
    PendingPayment = "Payment info pending",
    PendingStatutory = "Statutory info pending"
}
export declare enum GenderEnum {
    Male = "male",
    Female = "female",
    Other = "other"
}
export declare enum SalaryTypeEnum {
    Net = "net",
    Gross = "gross"
}
export declare enum SupportedCurrencyEnum {
    USD = "usd",
    GBP = "gbp",
    EUR = "eur",
    USDT = "usdt",
    NGN = "ngn",
    GHS = "ghs",
    KES = "kes",
    RWF = "rwf"
}
