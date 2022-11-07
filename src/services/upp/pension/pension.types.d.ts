import { IGroup } from '../../../interfaces/account/employee.interface';
import { IPayroll, IPayrollEmployee, OrganizationSettings } from '../../../interfaces/payroll/payroll.interface';
export interface ProcessPensionPayload {
    group?: IGroup;
    organizationSettings: OrganizationSettings;
    employee: IPayrollEmployee;
    payroll: IPayroll;
}
export interface CountryPensionService {
    process(context: ProcessPensionPayload): void;
}
