import {Organization} from '../../interfaces/account/organization.interface';
import {
  IPayroll,
  IPayrollDTO,
  IPayrollEmployee,
  IPayrollMeta,
} from '../../interfaces/payroll/payroll.interface';

export interface IPayrollBuilder {
  get(): IPayroll;
}

export interface BuilderPayload {
  organization: Organization;
  employees: IPayrollEmployee[];
  meta: IPayrollMeta;
  payrollInit: IPayrollDTO;
}
