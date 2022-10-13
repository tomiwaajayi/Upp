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
}

export interface IPayrollEmployee
  extends Omit<Employee, 'bonuses' | 'deductions'> {
  remitanceEnabled?: true;
  base: IMoney;
  bonuses?: EmployeeSalaryAddon[] | PayrollSalaryAddon[];
  totalBonuses?: IMoney;
  deductions?: EmployeeSalaryAddon[] | PayrollSalaryAddon[];
  totalDeductions?: IMoney;
  totalProRate?: IMoney;
  remittances?: [
    {
      // value is null if tax is disabled
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
