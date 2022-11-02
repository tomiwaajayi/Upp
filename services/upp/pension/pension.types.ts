import {Group} from '../../../interfaces/account/employee.interface';
import {
  IPayrollEmployee,
  OrganizationSettings,
} from '../../../interfaces/payroll/payroll.interface';

export interface ProcessPensionPayload {
  group?: Group;
  organizationSettings: OrganizationSettings;
  employee: IPayrollEmployee;
}

export interface CountryPensionService {
  process(context: ProcessPensionPayload): void;
}
