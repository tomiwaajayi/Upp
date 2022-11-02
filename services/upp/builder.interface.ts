import {Organization} from '../../interfaces/account/organization.interface';
import {
  IPayroll,
  IPayrollDTO,
  IPayrollEmployee,
  IPayrollMeta,
  OrganizationSettings,
} from '../../interfaces/payroll/payroll.interface';

export interface IPayrollBuilder {
  get(): IPayroll;
}

export interface BuilderPayload {
  organization: Organization;
  organizationSettings: OrganizationSettings;
  employees: IPayrollEmployee[];
  meta: IPayrollMeta;
  payrollInit: IPayrollDTO;
}
