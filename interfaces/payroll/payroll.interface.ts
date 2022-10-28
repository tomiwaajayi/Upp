import {Employee, EmployeeSalaryAddon} from '../account/employee.interface';
import {Organization} from '../account/organization.interface';
import {Country} from '../base.interface';
import {IMoney} from '../payment/money.interface';

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

export interface IPayrollEmployee extends Employee {
  remitanceEnabled?: true;
  base: IMoney;
  bonuses?: EmployeeSalaryAddon[];
  totalBonus?: IMoney;
  untaxedBonuses?: EmployeeSalaryAddon[];
  totalUntaxedBonus?: IMoney;
  extraMonthBonus?: EmployeeSalaryAddon;
  totalExtraMonthBonus?: IMoney;
  leaveAllowance?: EmployeeSalaryAddon;
  totalLeaveAllowance?: IMoney;
  deductions?: EmployeeSalaryAddon[];
  totalDeductions?: IMoney;
  totalProRate?: IMoney;
  remittances?: (Record<string, unknown> & {
    // value is null if tax is disabled
    name: string;
    remittanceEnabled: boolean;
    amount: IMoney;
  })[];
}

export interface IPayrollRemittance {
  name: string; // official name given to remittance by country e.g ssnit
  amount: IMoney;
  remittanceEnabled: boolean;
  payroll: IPayroll | string;
  organization: Organization | string;
  country: Country | string;
  type: string;
}

export enum PayItemStatus {
  Unpaid = 'unpaid',
  Paid = 'paid',
  Processing = 'processing',
  Pending = 'pending',
}

export enum CountryStatutories {
  ITF = 'itf',
  NHF = 'nhf',
  NHIF = 'nhif',
  NSITF = 'nsitf',
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
