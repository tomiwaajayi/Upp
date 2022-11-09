import {Dictionary} from 'lodash';
import {
  Employee,
  EmployeeSalaryAddon,
  IRemitance,
} from '../account/employee.interface';
import {Organization} from '../account/organization.interface';
import {Country} from '../base.interface';
import {IMoney} from '../payment/money.interface';

export interface IPayrollDTO {
  payItem: Record<PayItems, PayItemsStatus>;
  deselected: string[];
  proRateMonth: string;
  createdBy: string;
}

export interface IPayrollMeta {
  proRateMonth: string;
  payItem: Record<PayItems, PayItemsStatus>;
}

export interface IPayroll {
  payItem: Record<PayItems, PayItemsStatus>;
  deselected: string[];
  proRateMonth: string;
  createdBy: string;
  organization?: Organization | string;
  employees?: IPayrollEmployee[];
  remittances?: Record<string, Record<string, IPayrollRemittance>>;
  hasProrates?: boolean;
  totalCharge?: Record<string, IMoney>;
  totalBonus?: Record<string, IMoney>;
  totalUntaxedBonus?: Record<string, IMoney>;
  totalExtraMonthBonus?: Record<string, IMoney>;
  totalLeaveAllowance?: Record<string, IMoney>;
  totalBase: Record<string, IMoney>;
  totalStatutories: Record<string, Record<string, IMoney>>;
  totalPension?: Record<string, IMoney>;
}

export interface IPayrollEmployee extends Employee {
  remitanceEnabled?: boolean;
  base: IMoney;
  basePayable?: IMoney;
  bonuses?: EmployeeSalaryAddon[];
  netSalary?: IMoney;
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
  variableAmount?: IMoney;
  // value is null if tax is disabled
  whtaxApplied?: boolean;
  whtaxRate?: number;
  netIncome?: IMoney;
  zeroMoney?: IMoney;
  remittances?: (Record<string, unknown> & {
    // value is null if tax is disabled
    name: string;
    remittanceEnabled: boolean;
    amount: IMoney;
  })[];
  remittancesKeyedByName?: Dictionary<
    Record<string, unknown> & {
      name: string;
      remittanceEnabled: boolean;
      amount: IMoney;
    }
  >;
  proRateDeduction?: IMoney;
  proRates?: EmployeeSalaryAddon[];
  sumOfBonus?: IMoney;
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

export type PayItems =
  | string
  | 'tax'
  | 'pension'
  | 'health'
  | 'base'
  | 'bonus'
  | 'nhf'
  | 'nhif'
  | 'nsitf'
  | 'itf';

export type PayItemsStatus =
  | string
  | 'unpaid'
  | 'processing'
  | 'paid'
  | 'pending';

export interface PayrollSalaryAddon {
  id: string;
  name: string;
  amount: IMoney;
}
export enum ProrateTypeEnum {
  Once = 'once',
  Recurring = 'recurring',
}

export enum ProrateStatusEnum {
  Pending = 'pending',
  Processing = 'processing',
  Canceled = 'cancelled',
  Completed = 'completed',
}

export interface OrganizationSettings {
  hasSalaryBreakdown: boolean;
  salaryBreakdown?: Record<string, number>;
  remittances: Record<string, IRemitance>;
  isTotalNsitfEnumeration?: boolean;
  isTotalItfEnumeration?: boolean;
  enableConsolidatedGross?: boolean;
  excessPensionToTierThree?: boolean;
  medicalEnabled?: boolean;
  pensionDeductType?: string;
  useGrossOnlyForMinimumWage?: boolean; // formally proratedTax
  payFullTax: boolean;
  useCRAGross: boolean;
}

export enum CountryISO {
  Nigeria = 'ng',
  Kenya = 'ke',
}
