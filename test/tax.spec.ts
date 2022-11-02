import {PayrollDirector} from '../services/upp/payroll.director';

import fixture = require('./fixtures/tax.json');
import {BuilderPayload} from '../services/upp/builder.interface';
import {cloneDeep} from 'lodash';
import {TRecord} from '../interfaces/base.interface';
import {EmployeeRemittancesItem} from '../interfaces/payroll/payroll.interface';
import {Group} from '../interfaces/account/employee.interface';
import {RemittanceItem} from '../interfaces/account/organization.interface';

describe('Process Tax (e2e)', () => {
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

  it('Should test payroll tax with bonus', async () => {
    const payroll = PayrollDirector.build(data);

    expect(payroll.employees[0].remittances).toBeDefined();

    const tax = (<TRecord<EmployeeRemittancesItem>>(
      payroll.employees[0].remittances
    )).tax;
    expect(tax).toBeDefined();
    expect(tax.remittanceEnabled).toBe(true);
    expect(tax.amount.value).toBe(7700);
  });

  it('Should test tax with no Bonuses', async () => {
    data.employees[0].bonuses = [];
    const payroll = PayrollDirector.build(data);

    expect(payroll.employees[0].remittances).toBeDefined();

    const tax = (<TRecord<EmployeeRemittancesItem>>(
      payroll.employees[0].remittances
    )).tax;
    expect(tax).toBeDefined();
    expect(tax.remittanceEnabled).toBe(true);
    expect(tax.amount.value).toBe(6500);
  });

  it('Should not have tax remittance if disabled', async () => {
    data.organizationSettings.remittances.tax.remit = false;
    (<TRecord<RemittanceItem>>(
      (<Group>data.employees[0].group).remittances
    )).tax.remit = false;
    const payroll = PayrollDirector.build(data);

    expect(payroll.employees[0].remittances).toBeDefined();

    const tax = (<TRecord<EmployeeRemittancesItem>>(
      payroll.employees[0].remittances
    )).tax;
    expect(tax).toBeDefined();
    expect(tax.remittanceEnabled).toBe(false);
  });

  it('Should have tax disabled', async () => {
    data.organizationSettings.remittances.tax.enabled = false;
    (<TRecord<RemittanceItem>>(
      (<Group>data.employees[0].group).remittances
    )).tax.enabled = false;
    const payroll = PayrollDirector.build(data);

    const remittances = <TRecord<EmployeeRemittancesItem>>(
      payroll.employees[0].remittances
    );
    expect(remittances?.tax).toBeUndefined();
  });

  it('Should have withholding tax', async () => {
    (<TRecord<RemittanceItem>>(
      (<Group>data.employees[0].group).remittances
    )).tax.enabledWithHoldingTax = true;
    const payroll = PayrollDirector.build(data);

    expect(payroll.employees[0].remittances).toBeDefined();

    const tax = (<TRecord<EmployeeRemittancesItem>>(
      payroll.employees[0].remittances
    )).tax;
    expect(tax).toBeDefined();
    expect(tax.remittanceEnabled).toBe(true);
    expect(tax.amount.value).toBe(5125);
  });
});
