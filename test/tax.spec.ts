import {PayrollDirector} from '@upp/payroll.director';
import fixture = require('@test/fixtures/tax.json');
import {BuilderPayload} from '@upp/builder.interface';
import {cloneDeep} from 'lodash';
import {IGroup} from '@sh/interfaces/account/employee.interface';
import {NestedIRemittance} from '@sh/interfaces/base.interface';

describe('Process Tax (e2e)', () => {
  describe('Nigeria Tax', () => {
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
      (<NestedIRemittance>data.organizationSettings.remittances).tax.remit =
        false;
      (<NestedIRemittance>(
        (<IGroup>data.employees[0].group).remittances
      )).tax.remit = false;
      const payroll = PayrollDirector.build(data);

      expect(payroll.employees[0].remittances).toBeDefined();

      const tax = (payroll.employees[0].remittances || []).find(
        r => r.name === 'tax'
      );
      expect(tax).toBeDefined();
      expect(tax?.remittanceEnabled).toBe(false);
    });

    it('Should have tax disabled', async () => {
      (<NestedIRemittance>data.organizationSettings.remittances).tax.remit =
        false;
      (<NestedIRemittance>(
        (<IGroup>data.employees[0].group).remittances
      )).tax.enabled = false;
      const payroll = PayrollDirector.build(data);

      const tax = (payroll.employees[0].remittances || []).find(
        r => r.name === 'tax'
      );
      expect(tax).toBeUndefined();
    });

    it('Should have withholding tax', async () => {
      (<NestedIRemittance>(
        (<IGroup>data.employees[0].group).remittances
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
      (<NestedIRemittance>(
        (<IGroup>data.employees[0].group).remittances
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

  describe('Ghana Tax', () => {
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

      data.organization.country = fixture.entities.ghana;
      data.employees[0].base = {value: 1000, currency: 'NGN'};
      data.employees[0].currency = 'GHS';
      data.employees[0].country = fixture.entities.ghana.iso2;
      (<IGroup>data.employees[0].group).salaryBreakdown =
        fixture.entities.salaryBreakdown;
      delete data.employees[0].bonuses;
      delete data.employees[0].untaxedBonuses;
      delete data.employees[0].leaveAllowance;
    });

    it('Should test payroll tax for ghana', async () => {
      (<NestedIRemittance>(
        (<IGroup>data.employees[0].group).remittances
      )).pension.enabled = true;

      const payroll = PayrollDirector.build(data);

      expect(payroll.employees[0].remittances).toBeDefined();

      const tax = (payroll.employees[0].remittances || []).find(
        r => r.name === 'tax'
      );
      expect(tax).toBeDefined();
      expect(tax?.remittanceEnabled).toBe(true);
      expect(tax?.amount.value).toBe(85.875);
    });
  });

  describe('Kenya Tax', () => {
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

      data.organization.country = fixture.entities.kenya;
      data.employees[0].base = {value: 100000, currency: 'KES'};
      data.employees[0].currency = 'KES';
      data.employees[0].country = fixture.entities.kenya.iso2;
      delete data.employees[0].bonuses;
      delete data.employees[0].untaxedBonuses;
      delete data.employees[0].leaveAllowance;
    });

    it('Should test payroll tax for kenya', async () => {
      (<NestedIRemittance>(
        (<IGroup>data.employees[0].group).remittances
      )).pension.enabled = true;

      const payroll = PayrollDirector.build(data);

      expect(payroll.employees[0].remittances).toBeDefined();

      const tax = (payroll.employees[0].remittances || []).find(
        r => r.name === 'tax'
      );
      expect(tax).toBeDefined();
      expect(tax?.remittanceEnabled).toBe(true);
      expect(tax?.amount.value).toBe(21735.35);
    });
  });

  describe('Rwanda Tax', () => {
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

      data.organization.country = fixture.entities.rwanda;
      data.employees[0].base = {value: 100000, currency: 'RWF'};
      data.employees[0].currency = 'RWF';
      data.employees[0].country = fixture.entities.rwanda.iso2;
      delete data.employees[0].bonuses;
      delete data.employees[0].untaxedBonuses;
      delete data.employees[0].leaveAllowance;
    });

    it('Should test payroll tax for rwanda', async () => {
      (<NestedIRemittance>(
        (<IGroup>data.employees[0].group).remittances
      )).pension.enabled = true;

      const payroll = PayrollDirector.build(data);

      expect(payroll.employees[0].remittances).toBeDefined();

      const tax = (payroll.employees[0].remittances || []).find(
        r => r.name === 'tax'
      );
      expect(tax).toBeDefined();
      expect(tax?.remittanceEnabled).toBe(true);
      expect(tax?.amount.value).toBe(14000);
    });
  });
});
