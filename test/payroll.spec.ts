import {PayrollDirector} from '../services/upp/payroll.director';

import fixture = require('./fixtures/organization.json');
import fixture2 = require('./fixtures/employee.json');
import fixture3 = require('./fixtures/meta.json');
import fixture4 = require('./fixtures/init.json');
import {IPayrollEmployee} from '../interfaces/payroll/payroll.interface';

test('Payroll Builder Test', async () => {
  const data = {
    organization: fixture.entities.defaultOrg,
    employees: fixture2.entities.defaultEmps,
    meta: fixture3.entities.defaultMeta,
    payrollInit: fixture4.entities.data,
  };
  const payroll = PayrollDirector.build(data);
  expect(
    (payroll.employees as IPayrollEmployee[])[0].totalProRate?.amount
  ).toBe(5000);
});
