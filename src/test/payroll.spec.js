"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payroll_director_1 = require("../services/upp/payroll.director");
const fixture = require("./fixtures/bonus.json");
const lodash_1 = require("lodash");
describe('Process Bonus (e2e)', () => {
    let data;
    beforeEach(async () => {
        const { entities } = (0, lodash_1.cloneDeep)(fixture);
        data = {
            organization: entities.defaultOrg,
            employees: entities.defaultEmps,
            meta: entities.defaultMeta,
            payrollInit: entities.data,
        };
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
});
//# sourceMappingURL=payroll.spec.js.map