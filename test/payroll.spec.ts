import {PayrollBuilder} from '../services/upp/director';

import fixture = require('./fixtures/organization.json');
import fixture2 = require('./fixtures/employee.json');
import fixture3 = require('./fixtures/meta.json');
import {IPayrollEmployee} from '../interfaces/payroll/payroll.interface';

test('Payroll Builder Test', async () => {
  const payroll = await new PayrollBuilder(
    fixture2.entities.defaultEmps,
    fixture.entities.defaultOrg,
    {proRateMonth: 'October'},
    fixture3.entities.defaultMeta
  ).build();
  expect(
    (payroll.employees as IPayrollEmployee[])[0].totalProRate?.amount
  ).toBe(5000);
});
