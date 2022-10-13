import {Organization} from '../../interfaces/account/organization.interface';
import {
  IPayroll,
  IPayrollDTO,
  IPayrollEmployee,
  IPayrollMeta,
} from '../../interfaces/payroll/payroll.interface';

/**
 * This builder is used to create a payroll object
 */
export class PayrollBuilder {
  /** The payroll object in creation */
  private _payroll: IPayroll;
  /** List of employees in payroll */
  private _employees: IPayrollEmployee[];
  private _organization: Organization;
  /**
   * This holds query data or data from backend that needs to be input in each processes
   */
  private _meta: IPayrollMeta;

  constructor(
    employees: IPayrollEmployee[],
    organization: Organization,
    meta: IPayrollMeta,
    payrollData: IPayrollDTO
  ) {
    this._employees = employees;
    this._organization = organization;
    this._meta = meta;
    this._payroll = {
      ...payrollData,
    };
  }

  /**
   * Process single employee prorate
   * note that there can only be a single prorate entry for an employee
   */
  processProRates(employee: IPayrollEmployee): void {
    employee.totalProRate = {amount: 5000, currency: 'NGN'};
  }

  /**
   * Call this method to return a promise of the resulting operation
   */
  async build(): Promise<IPayroll> {
    await Promise.all(
      this._employees.map((employee: IPayrollEmployee) => {
        // employee processes goes here
        this.processProRates(employee);
      })
    );

    return {
      ...this._payroll,
      organization: this._organization,
      employees: this._employees,
    };
  }
}
