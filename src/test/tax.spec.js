"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payroll_director_1 = require("@upp/payroll.director");
const fixture = require("@test/fixtures/tax.json");
const lodash_1 = require("lodash");
describe('Process Tax (e2e)', () => {
    describe('Nigeria Tax', () => {
        let data;
        beforeEach(async () => {
            const { entities } = (0, lodash_1.cloneDeep)(fixture);
            data = {
                organization: entities.defaultOrg,
                organizationSettings: entities.orgSettings,
                employees: entities.defaultEmps,
                meta: entities.defaultMeta,
                payrollInit: entities.data,
            };
        });
        it('Should test payroll tax with bonus', async () => {
            const payroll = payroll_director_1.PayrollDirector.build(data);
            expect(payroll.employees[0].remittances).toBeDefined();
            const tax = (payroll.employees[0].remittances || []).find(r => r.name === 'tax');
            expect(tax).toBeDefined();
            expect(tax === null || tax === void 0 ? void 0 : tax.remittanceEnabled).toBe(true);
            expect(tax === null || tax === void 0 ? void 0 : tax.amount.value).toBe(7700);
        });
        it('Should test tax with no Bonuses', async () => {
            data.employees[0].bonuses = [];
            const payroll = payroll_director_1.PayrollDirector.build(data);
            expect(payroll.employees[0].remittances).toBeDefined();
            const tax = (payroll.employees[0].remittances || []).find(r => r.name === 'tax');
            expect(tax).toBeDefined();
            expect(tax === null || tax === void 0 ? void 0 : tax.remittanceEnabled).toBe(true);
            expect(tax === null || tax === void 0 ? void 0 : tax.amount.value).toBe(6500);
        });
        it('Should not have tax remittance if disabled', async () => {
            data.organizationSettings.remittances.tax.remit =
                false;
            (data.employees[0].group.remittances).tax.remit = false;
            const payroll = payroll_director_1.PayrollDirector.build(data);
            expect(payroll.employees[0].remittances).toBeDefined();
            const tax = (payroll.employees[0].remittances || []).find(r => r.name === 'tax');
            expect(tax).toBeDefined();
            expect(tax === null || tax === void 0 ? void 0 : tax.remittanceEnabled).toBe(false);
        });
        it('Should have tax disabled', async () => {
            data.organizationSettings.remittances.tax.remit =
                false;
            (data.employees[0].group.remittances).tax.enabled = false;
            const payroll = payroll_director_1.PayrollDirector.build(data);
            const tax = (payroll.employees[0].remittances || []).find(r => r.name === 'tax');
            expect(tax).toBeUndefined();
        });
        it('Should have withholding tax', async () => {
            (data.employees[0].group.remittances).tax.enabledWithHoldingTax = true;
            const payroll = payroll_director_1.PayrollDirector.build(data);
            expect(payroll.employees[0].remittances).toBeDefined();
            const tax = (payroll.employees[0].remittances || []).find(r => r.name === 'tax');
            expect(tax).toBeDefined();
            expect(tax === null || tax === void 0 ? void 0 : tax.remittanceEnabled).toBe(true);
            expect(tax === null || tax === void 0 ? void 0 : tax.amount.value).toBe(5125);
        });
        it('Should calculate pension as a relief', async () => {
            (data.employees[0].group.remittances).pension.enabled = true;
            const payroll = payroll_director_1.PayrollDirector.build(data);
            expect(payroll.employees[0].remittances).toBeDefined();
            const tax = (payroll.employees[0].remittances || []).find(r => r.name === 'tax');
            expect(tax).toBeDefined();
            expect(tax === null || tax === void 0 ? void 0 : tax.remittanceEnabled).toBe(true);
            expect(tax === null || tax === void 0 ? void 0 : tax.amount.value).toBe(5540);
        });
    });
    describe('Ghana Tax', () => {
        let data;
        beforeEach(async () => {
            const { entities } = (0, lodash_1.cloneDeep)(fixture);
            data = {
                organization: entities.defaultOrg,
                organizationSettings: entities.orgSettings,
                employees: entities.defaultEmps,
                meta: entities.defaultMeta,
                payrollInit: entities.data,
            };
            data.organization.country = fixture.entities.ghana;
            data.employees[0].base = { value: 1000, currency: 'NGN' };
            data.employees[0].currency = 'GHS';
            data.employees[0].country = fixture.entities.ghana.id;
            data.employees[0].group.salaryBreakdown =
                fixture.entities.salaryBreakdown;
            delete data.employees[0].bonuses;
            delete data.employees[0].untaxedBonuses;
            delete data.employees[0].leaveAllowance;
        });
        it('Should test payroll tax for ghana', async () => {
            (data.employees[0].group.remittances).pension.enabled = true;
            const payroll = payroll_director_1.PayrollDirector.build(data);
            expect(payroll.employees[0].remittances).toBeDefined();
            const tax = (payroll.employees[0].remittances || []).find(r => r.name === 'tax');
            expect(tax).toBeDefined();
            expect(tax === null || tax === void 0 ? void 0 : tax.remittanceEnabled).toBe(true);
            expect(tax === null || tax === void 0 ? void 0 : tax.amount.value).toBe(85.875);
        });
    });
    describe('Kenya Tax', () => {
        let data;
        beforeEach(async () => {
            const { entities } = (0, lodash_1.cloneDeep)(fixture);
            data = {
                organization: entities.defaultOrg,
                organizationSettings: entities.orgSettings,
                employees: entities.defaultEmps,
                meta: entities.defaultMeta,
                payrollInit: entities.data,
            };
            data.organization.country = fixture.entities.kenya;
            data.employees[0].base = { value: 100000, currency: 'KES' };
            data.employees[0].currency = 'KES';
            data.employees[0].country = fixture.entities.kenya.id;
            delete data.employees[0].bonuses;
            delete data.employees[0].untaxedBonuses;
            delete data.employees[0].leaveAllowance;
        });
        it('Should test payroll tax for kenya', async () => {
            (data.employees[0].group.remittances).pension.enabled = true;
            const payroll = payroll_director_1.PayrollDirector.build(data);
            expect(payroll.employees[0].remittances).toBeDefined();
            const tax = (payroll.employees[0].remittances || []).find(r => r.name === 'tax');
            expect(tax).toBeDefined();
            expect(tax === null || tax === void 0 ? void 0 : tax.remittanceEnabled).toBe(true);
            expect(tax === null || tax === void 0 ? void 0 : tax.amount.value).toBe(21735.35);
        });
    });
    describe('Rwanda Tax', () => {
        let data;
        beforeEach(async () => {
            const { entities } = (0, lodash_1.cloneDeep)(fixture);
            data = {
                organization: entities.defaultOrg,
                organizationSettings: entities.orgSettings,
                employees: entities.defaultEmps,
                meta: entities.defaultMeta,
                payrollInit: entities.data,
            };
            data.organization.country = fixture.entities.rwanda;
            data.employees[0].base = { value: 100000, currency: 'RWF' };
            data.employees[0].currency = 'RWF';
            data.employees[0].country = fixture.entities.rwanda.id;
            delete data.employees[0].bonuses;
            delete data.employees[0].untaxedBonuses;
            delete data.employees[0].leaveAllowance;
        });
        it('Should test payroll tax for rwanda', async () => {
            (data.employees[0].group.remittances).pension.enabled = true;
            const payroll = payroll_director_1.PayrollDirector.build(data);
            expect(payroll.employees[0].remittances).toBeDefined();
            const tax = (payroll.employees[0].remittances || []).find(r => r.name === 'tax');
            expect(tax).toBeDefined();
            expect(tax === null || tax === void 0 ? void 0 : tax.remittanceEnabled).toBe(true);
            expect(tax === null || tax === void 0 ? void 0 : tax.amount.value).toBe(14000);
        });
    });
});
//# sourceMappingURL=tax.spec.js.map