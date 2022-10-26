import { Employee } from '../account/employee.interface';
import { Organization } from '../account/organization.interface';
import { Country } from '../base.interface';
import { IMoney } from '../payment/money.interface';
export interface IPayrollDTO {
    payItem: PayItem;
    deselected: string[];
    proRateMonth: string;
    createdBy: string;
}
export interface IPayrollMeta {
    proRateMonth: string;
}
export interface IPayroll {
    payItem: PayItem;
    deselected: string[];
    proRateMonth: string;
    createdBy: string;
    organization?: Organization | string;
    employees?: IPayrollEmployee[];
    remittances?: IPayrollRemittance[];
    hasProrates?: boolean;
    totalCharge?: IMoney;
}
export interface IPayrollEmployee extends Omit<Employee, 'bonuses' | 'deductions'> {
    remitanceEnabled?: true;
    base: IMoney;
    bonuses?: PayrollSalaryAddon[];
    totalBonuses?: IMoney;
    deductions?: PayrollSalaryAddon[];
    totalDeductions?: IMoney;
    totalProRate?: IMoney;
    remittances?: [
        {
            name: string;
            remitanceEnabled: boolean;
            amount: IMoney;
        },
        {
            name: string;
            remitanceEnabled: boolean;
            amount: IMoney;
        }
    ];
}
export interface IPayrollRemittance {
    name: string;
    amount: IMoney;
    remittanceEnabled: boolean;
    payroll: IPayroll | string;
    organization: Organization | string;
    country: Country | string;
    type: string;
}
export declare enum PayItemStatus {
    Unpaid = "unpaid",
    Paid = "paid",
    Processing = "processing",
    Pending = "pending"
}
export interface PayItem {
    tax: PayItemStatus | string;
    pension: PayItemStatus | string;
    health: PayItemStatus | string;
    nhf: PayItemStatus | string;
    nhif: PayItemStatus | string;
    itf: PayItemStatus | string;
    nsitf: PayItemStatus | string;
}
export interface PayrollSalaryAddon {
    id: string;
    name: string;
    amount: IMoney;
}
