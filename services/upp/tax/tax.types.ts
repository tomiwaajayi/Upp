import {Employee} from '@sh/interfaces/account/employee.interface';
import {Organization} from '@sh/interfaces/account/organization.interface';
import {IMoney} from '@sh/interfaces/payment/money.interface';
import {
  IPayrollEmployee,
  IPayrollMeta,
  OrganizationSettings,
} from '@sh/interfaces/payroll/payroll.interface';

export type ProcessTaxPayload = {
  organization: Organization;
  settings: OrganizationSettings;
  meta: IPayrollMeta;
};

export interface ITax {
  calculateWithHoldingTax(taxableIncome: IMoney, whtaxRate: number): unknown;
  calculateWithHoldingTaxRelief(employee: IPayrollEmployee): unknown;
  processEmployeeWHT(employee: IPayrollEmployee): unknown;
  processEmployeeTax?(employee: Employee): ProcessEmployeeTax;
  exempt?(employee?: Employee): boolean;
}

export interface CountryTaxService {
  process(employee: IPayrollEmployee): void;
}

export interface ProcessEmployeeTax {
  relief: Record<string, IMoney>;
  tax: IMoney;
}
