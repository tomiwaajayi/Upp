import {PayrollDirector} from '../services/upp/payroll.director';

import fixture = require('./fixtures/bonus.json');
import {BuilderPayload} from '../services/upp/builder.interface';
import {cloneDeep} from 'lodash';

describe('Process Bonus (e2e)', () => {
  let data: BuilderPayload;

  beforeEach(async () => {
    const {entities} = cloneDeep(fixture);
    data = {
      organization: entities.defaultOrg,
      organizationSettings: entities.defaultOrgSettings,
      employees: entities.defaultEmps,
      meta: entities.defaultMeta,
      payrollInit: entities.data,
    };
  });

  it('Should test payroll bonuses', async () => {
    const {entities} = fixture;
    const payroll = PayrollDirector.build(data);

    expect(payroll.employees[0].totalBonus?.value).toBe(
      entities.defaultEmps[0].bonuses[0].amount.value
    );
    expect(payroll.employees[0].totalUntaxedBonus?.value).toBe(
      entities.defaultEmps[0].bonuses[1].amount.value
    );
    expect(payroll.employees[0].totalExtraMonthBonus?.value).toBe(
      entities.defaultEmps[0].bonuses[3].amount.value
    );
  });

  it('Should test empty Payroll Bonuses', async () => {
    data.employees[0].bonuses = [];
    const payroll = PayrollDirector.build(data);
    expect(payroll.employees[0].totalBonus).toBe(undefined);
    expect(payroll.employees[0].extraMonthBonus).toBe(undefined);
  });
});
