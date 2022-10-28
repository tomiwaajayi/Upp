import {PayrollDirector} from '../services/upp/payroll.director';

import fixture = require('./fixtures/bonus.json');
import {BuilderPayload} from '../services/upp/builder.interface';
import {cloneDeep} from 'lodash';
import {IEmployeeWithGroup} from '../interfaces/account/employee.interface';
import {CountryStatutories} from '../interfaces/payroll/payroll.interface';

describe('Process Bonus (e2e)', () => {
  let data: BuilderPayload;

  beforeEach(async () => {
    const {entities} = cloneDeep(fixture);
    data = {
      organization: entities.defaultOrg,
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

  it('Should ensure employee with itf is defined and successfully added to remittances', async () => {
    const payroll = PayrollDirector.build(data);

    expect(payroll.employees[0]?.group).toBeUndefined();
    expect(
      (payroll.employees[1] as IEmployeeWithGroup).group.remittances
    ).toBeDefined();

    const empOneITFRecord = payroll.employees[0].remittances?.find(
      record => record.name === CountryStatutories.ITF
    );
    expect(empOneITFRecord).toBeUndefined();

    const empTwoITFRecord = payroll.employees[1].remittances?.find(
      record => record.name === CountryStatutories.ITF
    );

    expect(empTwoITFRecord?.remittanceEnabled).toBe(true);
    expect(empTwoITFRecord?.amount.value).toBe(1000);
  });

  it('Should ensure employee with nhf is defined and successfully added to remittances', async () => {
    const payroll = PayrollDirector.build(data);

    expect(payroll.employees[0]?.group).toBeUndefined();
    expect(
      (payroll.employees[1] as IEmployeeWithGroup).group.remittances
    ).toBeDefined();

    const empOneNHFRecord = payroll.employees[0].remittances?.find(
      record => record.name === CountryStatutories.NHF
    );
    expect(empOneNHFRecord).toBeUndefined();

    const empTwoNHFRecord = payroll.employees[1].remittances?.find(
      record => record.name === CountryStatutories.NHF
    );

    expect(empTwoNHFRecord?.remittanceEnabled).toBe(true);
    expect(empTwoNHFRecord?.amount.value).toBe(60000);
  });

  it('Should ensure employee with nhif is defined and successfully added to remittances', async () => {
    const payroll = PayrollDirector.build(data);

    expect(payroll.employees[0]?.group).toBeUndefined();
    expect(
      (payroll.employees[1] as IEmployeeWithGroup).group.remittances
    ).toBeDefined();

    const empOneNHIFRecord = payroll.employees[0].remittances?.find(
      record => record.name === CountryStatutories.NHIF
    );
    expect(empOneNHIFRecord).toBeUndefined();

    const empTwoNHIFRecord = payroll.employees[1].remittances?.find(
      record => record.name === CountryStatutories.NHIF
    );

    expect(empTwoNHIFRecord?.remittanceEnabled).toBe(true);
    expect(empTwoNHIFRecord?.amount.value).toBe(1700);
  });

  it('Should ensure employee with nsitf is defined and successfully added to remittances', async () => {
    const payroll = PayrollDirector.build(data);

    expect(payroll.employees[0]?.group).toBeUndefined();
    expect(
      (payroll.employees[1] as IEmployeeWithGroup).group.remittances
    ).toBeDefined();

    const empOneNSITFRecord = payroll.employees[0].remittances?.find(
      record => record.name === CountryStatutories.NSITF
    );
    expect(empOneNSITFRecord).toBeUndefined();

    const empTwoNSITFRecord = payroll.employees[1].remittances?.find(
      record => record.name === CountryStatutories.NSITF
    );

    expect(empTwoNSITFRecord?.remittanceEnabled).toBe(true);
    expect(empTwoNSITFRecord?.amount.value).toBe(1000);
  });
});
