import {PayrollDirector} from '../services/upp/payroll.director';

import fixture = require('./fixtures/bonus.json');
import {BuilderPayload} from '../services/upp/builder.interface';
import {cloneDeep} from 'lodash';
import {IMoney} from '../interfaces/payment/money.interface';

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
      organizationSettings: entities.orgSettings,
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

  it('Should successfully and properly process pension', async () => {
    const payroll = PayrollDirector.build(data);

    expect(payroll.employees[0].remittances).toBeDefined();
    expect(payroll.employees[1].remittances).toBeDefined();

    const pension1 = payroll.employees[0].remittances?.find(
      r => r.name === 'pension'
    );
    const pension2 = payroll.employees[1].remittances?.find(
      r => r.name === 'pension'
    );

    expect(pension1).toBeDefined();
    expect(pension1?.amount.value).toBe(18000);
    expect((pension1?.employeeContribution as IMoney)?.value).toBe(8000);
    expect((pension1?.employerContribution as IMoney)?.value).toBe(10000);
    expect(pension1?.remittanceEnabled).toBeFalsy();

    expect(pension2).toBeDefined();
    expect(pension2?.amount.value).toBe(12000);
    expect((pension2?.employeeContribution as IMoney)?.value).toBe(0);
    expect((pension2?.employerContribution as IMoney)?.value).toBe(12000);
    expect(pension2?.remittanceEnabled).toBeTruthy();
  });
});
