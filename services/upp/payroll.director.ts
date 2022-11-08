import {cloneDeep, keyBy} from 'lodash';
import {PayrollBuilder} from './payroll.builder';
import {BuilderPayload} from './builder.interface';
import {IPayrollEmployee} from '../../interfaces/payroll/payroll.interface';

/**
 * This builder is used to create a payroll object
 */
export class PayrollDirector {
  static build(data: BuilderPayload) {
    return new PayrollBuilder(data).get();
  }

  static getInstance(data: BuilderPayload) {
    return new PayrollBuilder(cloneDeep(data));
  }

  static updateEmployees(
    instance: PayrollBuilder,
    employees: IPayrollEmployee | IPayrollEmployee[]
  ) {
    // get a clone of the data used to initialise instance
    const data = cloneDeep(instance.getData());

    // update employees in data to just employee(s) to update
    data.employees = Array.isArray(employees) ? employees : [employees];

    // initialise new instance with modified data
    const {employees: reprocessedEmployees} = new PayrollBuilder(data).get();
    const employeesKeyedById = keyBy(reprocessedEmployees, 'id');

    // merge current and previous processed employees
    data.employees = instance.getProcessedEmployees().map(employee => {
      return employeesKeyedById[employee.id] || employee;
    });

    // calling getTotals on this instance returns updated totals
    return new PayrollBuilder(data);
  }
}
