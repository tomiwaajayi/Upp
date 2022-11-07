import { IGroup } from '../../../interfaces/account/employee.interface';
import { IPayrollEmployee, OrganizationSettings } from '../../../interfaces/payroll/payroll.interface';
export interface ProcessPensionPayload {
    group?: IGroup;
    organizationSettings: OrganizationSettings;
    employee: IPayrollEmployee;
}
export interface CountryPensionService {
    process(context: ProcessPensionPayload): void;
}
