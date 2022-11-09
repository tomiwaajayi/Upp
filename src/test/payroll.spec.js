"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payroll_director_1 = require("../services/payroll.director");
const fixture = require("./fixtures/bonus.json");
const lodash_1 = require("lodash");
const payroll_interface_1 = require("../interfaces/payroll/payroll.interface");
describe('Process Payroll (e2e)', () => {
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
    it('should be able to handle employee updates', () => {
        let builderInstance = payroll_director_1.PayrollDirector.getInstance(data);
        let payroll = builderInstance.get();
        expect(payroll.totalCharge).toEqual({
            NGN: {
                value: 220500,
                currency: 'NGN',
            },
            KES: {
                value: 25000,
                currency: 'KES',
            },
        });
        expect(payroll.employees[0].base).toEqual({
            value: 100000,
            currency: 'NGN',
        });
        const updatedEmployee = {
            ...(0, lodash_1.cloneDeep)(data.employees[0]),
            base: { value: 150000, currency: data.employees[0].base.currency },
        };
        builderInstance = payroll_director_1.PayrollDirector.updateEmployees(builderInstance, updatedEmployee);
        payroll = builderInstance.getTotals();
        expect(payroll.totalCharge).toEqual({
            NGN: {
                value: 341000,
                currency: 'NGN',
            },
            KES: {
                value: 25000,
                currency: 'KES',
            },
        });
        expect(payroll.employees[0].base).toEqual({
            value: 150000,
            currency: 'NGN',
        });
    });
    it('should calculate payroll totals', () => {
        const payroll = payroll_director_1.PayrollDirector.build(data);
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
                    value: 50000,
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
                value: 220500,
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
                        value: 50000,
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
    it('Should successfully calculate prorates ', async () => {
        var _a, _b, _c, _d;
        const payroll = payroll_director_1.PayrollDirector.build(data);
        expect((_a = payroll.employees[0].proRateDeduction) === null || _a === void 0 ? void 0 : _a.value).toBe(53125);
        expect((_b = payroll.employees[1].proRateDeduction) === null || _b === void 0 ? void 0 : _b.value).toBe(53125);
        expect((_c = payroll.employees[0].basePayable) === null || _c === void 0 ? void 0 : _c.value).toBe(46875);
        expect((_d = payroll.employees[1].basePayable) === null || _d === void 0 ? void 0 : _d.value).toBe(46875);
    });
    it('Should test payroll bonuses', async () => {
        var _a, _b, _c;
        const { entities } = fixture;
        const payroll = payroll_director_1.PayrollDirector.build(data);
        expect((_a = payroll.employees[0].totalBonus) === null || _a === void 0 ? void 0 : _a.value).toBe(entities.defaultEmps[0].bonuses[0].amount.value);
        expect((_b = payroll.employees[0].totalUntaxedBonus) === null || _b === void 0 ? void 0 : _b.value).toBe(entities.defaultEmps[0].bonuses[1].amount.value);
        expect((_c = payroll.employees[0].totalExtraMonthBonus) === null || _c === void 0 ? void 0 : _c.value).toBe(entities.defaultEmps[0].bonuses[3].amount.value);
    });
    it('Should test empty Payroll Bonuses', async () => {
        data.employees[0].bonuses = [];
        const payroll = payroll_director_1.PayrollDirector.build(data);
        expect(payroll.employees[0].totalBonus).toBe(undefined);
        expect(payroll.employees[0].extraMonthBonus).toBe(undefined);
    });
    it('Should ensure employee with itf is defined and successfully added to remittances', async () => {
        var _a, _b, _c;
        const payroll = payroll_director_1.PayrollDirector.build(data);
        expect((_a = payroll.employees[0]) === null || _a === void 0 ? void 0 : _a.group).toBeUndefined();
        expect(payroll.employees[1].group.remittances).toBeDefined();
        const empOneITFRecord = (_b = payroll.employees[0].remittances) === null || _b === void 0 ? void 0 : _b.find(record => record.name === payroll_interface_1.CountryStatutories.ITF);
        expect(empOneITFRecord).toBeUndefined();
        const empTwoITFRecord = (_c = payroll.employees[1].remittances) === null || _c === void 0 ? void 0 : _c.find(record => record.name === payroll_interface_1.CountryStatutories.ITF);
        expect(empTwoITFRecord === null || empTwoITFRecord === void 0 ? void 0 : empTwoITFRecord.remittanceEnabled).toBe(true);
        expect(empTwoITFRecord === null || empTwoITFRecord === void 0 ? void 0 : empTwoITFRecord.amount.value).toBe(1000);
    });
    it('Should ensure employee with nhf is defined and successfully added to remittances', async () => {
        var _a, _b, _c;
        const payroll = payroll_director_1.PayrollDirector.build(data);
        expect((_a = payroll.employees[0]) === null || _a === void 0 ? void 0 : _a.group).toBeUndefined();
        expect(payroll.employees[1].group.remittances).toBeDefined();
        const empOneNHFRecord = (_b = payroll.employees[0].remittances) === null || _b === void 0 ? void 0 : _b.find(record => record.name === payroll_interface_1.CountryStatutories.NHF);
        expect(empOneNHFRecord).toBeUndefined();
        const empTwoNHFRecord = (_c = payroll.employees[1].remittances) === null || _c === void 0 ? void 0 : _c.find(record => record.name === payroll_interface_1.CountryStatutories.NHF);
        expect(empTwoNHFRecord === null || empTwoNHFRecord === void 0 ? void 0 : empTwoNHFRecord.remittanceEnabled).toBe(true);
        expect(empTwoNHFRecord === null || empTwoNHFRecord === void 0 ? void 0 : empTwoNHFRecord.amount.value).toBe(50000);
    });
    it('Should ensure employee with nhif is defined and successfully added to remittances', async () => {
        var _a, _b, _c;
        const payroll = payroll_director_1.PayrollDirector.build(data);
        expect((_a = payroll.employees[0]) === null || _a === void 0 ? void 0 : _a.group).toBeUndefined();
        expect(payroll.employees[2].group.remittances).toBeDefined();
        const empOneNHIFRecord = (_b = payroll.employees[0].remittances) === null || _b === void 0 ? void 0 : _b.find(record => record.name === payroll_interface_1.CountryStatutories.NHIF);
        expect(empOneNHIFRecord).toBeUndefined();
        const empTwoNHIFRecord = (_c = payroll.employees[2].remittances) === null || _c === void 0 ? void 0 : _c.find(record => record.name === payroll_interface_1.CountryStatutories.NHIF);
        expect(empTwoNHIFRecord === null || empTwoNHIFRecord === void 0 ? void 0 : empTwoNHIFRecord.remittanceEnabled).toBe(true);
        expect(empTwoNHIFRecord === null || empTwoNHIFRecord === void 0 ? void 0 : empTwoNHIFRecord.amount.value).toBe(850);
    });
    it('Should ensure employee with nsitf is defined and successfully added to remittances', async () => {
        var _a, _b, _c;
        const payroll = payroll_director_1.PayrollDirector.build(data);
        expect((_a = payroll.employees[0]) === null || _a === void 0 ? void 0 : _a.group).toBeUndefined();
        expect(payroll.employees[1].group.remittances).toBeDefined();
        const empOneNSITFRecord = (_b = payroll.employees[0].remittances) === null || _b === void 0 ? void 0 : _b.find(record => record.name === payroll_interface_1.CountryStatutories.NSITF);
        expect(empOneNSITFRecord).toBeUndefined();
        const empTwoNSITFRecord = (_c = payroll.employees[1].remittances) === null || _c === void 0 ? void 0 : _c.find(record => record.name === payroll_interface_1.CountryStatutories.NSITF);
        expect(empTwoNSITFRecord === null || empTwoNSITFRecord === void 0 ? void 0 : empTwoNSITFRecord.remittanceEnabled).toBe(true);
        expect(empTwoNSITFRecord === null || empTwoNSITFRecord === void 0 ? void 0 : empTwoNSITFRecord.amount.value).toBe(1000);
    });
    it('Should successfully and properly process pension', async () => {
        var _a, _b, _c, _d, _e, _f;
        const payroll = payroll_director_1.PayrollDirector.build(data);
        expect(payroll.employees[0].remittances).toBeDefined();
        expect(payroll.employees[1].remittances).toBeDefined();
        const pension1 = (_a = payroll.employees[0].remittances) === null || _a === void 0 ? void 0 : _a.find(r => r.name === 'pension');
        const pension2 = (_b = payroll.employees[1].remittances) === null || _b === void 0 ? void 0 : _b.find(r => r.name === 'pension');
        expect(pension1).toBeDefined();
        expect(pension1 === null || pension1 === void 0 ? void 0 : pension1.amount.value).toBe(18000);
        expect((_c = pension1 === null || pension1 === void 0 ? void 0 : pension1.employeeContribution) === null || _c === void 0 ? void 0 : _c.value).toBe(8000);
        expect((_d = pension1 === null || pension1 === void 0 ? void 0 : pension1.employerContribution) === null || _d === void 0 ? void 0 : _d.value).toBe(10000);
        expect(pension1 === null || pension1 === void 0 ? void 0 : pension1.remittanceEnabled).toBeFalsy();
        expect(pension2).toBeDefined();
        expect(pension2 === null || pension2 === void 0 ? void 0 : pension2.amount.value).toBe(12000);
        expect((_e = pension2 === null || pension2 === void 0 ? void 0 : pension2.employeeContribution) === null || _e === void 0 ? void 0 : _e.value).toBe(0);
        expect((_f = pension2 === null || pension2 === void 0 ? void 0 : pension2.employerContribution) === null || _f === void 0 ? void 0 : _f.value).toBe(12000);
        expect(pension2 === null || pension2 === void 0 ? void 0 : pension2.remittanceEnabled).toBeTruthy();
    });
});
//# sourceMappingURL=payroll.spec.js.map