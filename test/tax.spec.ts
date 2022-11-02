import {PayrollDirector} from '../services/upp/payroll.director';

import fixture = require('./fixtures/tax.json');
import {BuilderPayload} from '../services/upp/builder.interface';
import {cloneDeep} from 'lodash';
import {Group} from '../interfaces/account/employee.interface';
import {NestedRecord} from '../interfaces/base.interface';

describe('Process Tax (e2e)', () => {
  let data: BuilderPayload;

  beforeEach(async () => {
    const {entities} = cloneDeep(fixture);
    data = {
      organization: entities.defaultOrg,
      organizationSettings: entities.orgSettings,
      employees: entities.defaultEmps,
      meta: entities.defaultMeta,
      payrollInit: entities.data,
    };
  });

  it('Should test payroll tax with bonus', async () => {
    const payroll = PayrollDirector.build(data);

    expect(payroll.employees[0].remittances).toBeDefined();

    const tax = (payroll.employees[0].remittances || []).find(
      r => r.name === 'tax'
    );
    expect(tax).toBeDefined();
    expect(tax?.remittanceEnabled).toBe(true);
    expect(tax?.amount.value).toBe(7700);
  });

  it('Should test tax with no Bonuses', async () => {
    data.employees[0].bonuses = [];
    const payroll = PayrollDirector.build(data);

    expect(payroll.employees[0].remittances).toBeDefined();

    const tax = (payroll.employees[0].remittances || []).find(
      r => r.name === 'tax'
    );
    expect(tax).toBeDefined();
    expect(tax?.remittanceEnabled).toBe(true);
    expect(tax?.amount.value).toBe(6500);
  });

  it('Should not have tax remittance if disabled', async () => {
    (<NestedRecord>data.organizationSettings.remittances).tax.remit = false;
    (<NestedRecord>(<Group>data.employees[0].group).remittances).tax.remit =
      false;
    const payroll = PayrollDirector.build(data);

    expect(payroll.employees[0].remittances).toBeDefined();

    const tax = (payroll.employees[0].remittances || []).find(
      r => r.name === 'tax'
    );
    expect(tax).toBeDefined();
    expect(tax?.remittanceEnabled).toBe(false);
  });

  it('Should have tax disabled', async () => {
    (<NestedRecord>data.organizationSettings.remittances).tax.remit = false;
    (<NestedRecord>(<Group>data.employees[0].group).remittances).tax.enabled =
      false;
    const payroll = PayrollDirector.build(data);

    const tax = (payroll.employees[0].remittances || []).find(
      r => r.name === 'tax'
    );
    expect(tax).toBeUndefined();
  });

  it('Should have withholding tax', async () => {
    (<NestedRecord>(
      (<Group>data.employees[0].group).remittances
    )).tax.enabledWithHoldingTax = true;
    const payroll = PayrollDirector.build(data);

    expect(payroll.employees[0].remittances).toBeDefined();

    const tax = (payroll.employees[0].remittances || []).find(
      r => r.name === 'tax'
    );
    expect(tax).toBeDefined();
    expect(tax?.remittanceEnabled).toBe(true);
    expect(tax?.amount.value).toBe(5125);
  });

  it('Should calculate pension as a relief', async () => {
    (<NestedRecord>(
      (<Group>data.employees[0].group).remittances
    )).pension.enabled = true;
    const payroll = PayrollDirector.build(data);

    expect(payroll.employees[0].remittances).toBeDefined();

    const tax = (payroll.employees[0].remittances || []).find(
      r => r.name === 'tax'
    );
    expect(tax).toBeDefined();
    expect(tax?.remittanceEnabled).toBe(true);
    expect(tax?.amount.value).toBe(5540);
  });
});
