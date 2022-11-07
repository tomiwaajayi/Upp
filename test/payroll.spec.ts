import {PayrollDirector} from '../services/upp/payroll.director';

import fixture = require('./fixtures/bonus.json');
import {BuilderPayload} from '../services/upp/builder.interface';
import {cloneDeep} from 'lodash';
import {IEmployeeWithGroup} from '../interfaces/account/employee.interface';
import {CountryStatutories} from '../interfaces/payroll/payroll.interface';
import {IMoney} from '../interfaces/payment/money.interface';

describe('Process Payroll (e2e)', () => {
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

  it('should calculate payroll totals', () => {
    const payroll = PayrollDirector.build(data);

    expect(payroll.totalBase).toEqual({
      NGN: {
        value: 200000,
        currency: 'NGN',
      },
      KES: {
        value: 25000,
        currency: 'KES',
      },
    });
    expect(payroll.totalStatutories).toEqual({
      NGN: {
        itf: {
          value: 1000,
          currency: 'NGN',
        },
        nhf: {
          value: 60000,
          currency: 'NGN',
        },
        nsitf: {
          value: 1000,
          currency: 'NGN',
        },
      },
      KES: {
        nhif: {
          value: 850,
          currency: 'KES',
        },
      },
    });
    expect(payroll.totalBonus).toEqual({
      NGN: {
        value: 2500,
        currency: 'NGN',
      },
    });
    expect(payroll.totalUntaxedBonus).toEqual({
      NGN: {
        value: 5500,
        currency: 'NGN',
      },
    });
    expect(payroll.totalExtraMonthBonus).toEqual({
      NGN: {
        value: 10000,
        currency: 'NGN',
      },
    });
    expect(payroll.totalLeaveAllowance).toEqual({
      NGN: {
        value: 7500,
        currency: 'NGN',
      },
    });
    expect(payroll.totalPension).toEqual({
      NGN: {
        value: 30000,
        currency: 'NGN',
      },
    });
    expect(payroll.totalCharge).toEqual({
      NGN: {
        value: 225500,
        currency: 'NGN',
      },
      KES: {
        value: 25000,
        currency: 'KES',
      },
    });
    expect(payroll.remittances).toEqual({
      NGN: {
        itf: {
          name: 'itf',
          remittanceEnabled: true,
          amount: {
            value: 1000,
            currency: 'NGN',
          },
        },
        nhf: {
          name: 'nhf',
          remittanceEnabled: true,
          amount: {
            value: 60000,
            currency: 'NGN',
          },
        },
        nsitf: {
          name: 'nsitf',
          remittanceEnabled: true,
          amount: {
            value: 1000,
            currency: 'NGN',
          },
        },
        pension: {
          name: 'pension',
          remittanceEnabled: true,
          amount: {
            value: 12000,
            currency: 'NGN',
          },
        },
      },
      KES: {
        nhif: {
          name: 'nhif',
          remittanceEnabled: true,
          amount: {
            value: 850,
            currency: 'KES',
          },
        },
      },
    });
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
      (payroll.employees[2] as IEmployeeWithGroup).group.remittances
    ).toBeDefined();

    const empOneNHIFRecord = payroll.employees[0].remittances?.find(
      record => record.name === CountryStatutories.NHIF
    );
    expect(empOneNHIFRecord).toBeUndefined();

    const empTwoNHIFRecord = payroll.employees[2].remittances?.find(
      record => record.name === CountryStatutories.NHIF
    );

    expect(empTwoNHIFRecord?.remittanceEnabled).toBe(true);
    expect(empTwoNHIFRecord?.amount.value).toBe(850);
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
