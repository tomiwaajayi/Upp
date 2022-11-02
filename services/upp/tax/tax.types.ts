import {Employee} from '../../../interfaces/account/employee.interface';
import {Organization} from '../../../interfaces/account/organization.interface';
import {Country} from '../../../interfaces/base.interface';
import {IMoney} from '../../../interfaces/payment/money.interface';
import {
  IPayrollEmployee,
  IPayrollMeta,
  OrganizationSettings,
} from '../../../interfaces/payroll/payroll.interface';

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
