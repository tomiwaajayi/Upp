"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payroll_director_1 = require("../services/upp/payroll.director");
const fixture = require("./fixtures/organization.json");
const fixture2 = require("./fixtures/employee.json");
const fixture3 = require("./fixtures/meta.json");
const fixture4 = require("./fixtures/init.json");
test('Payroll Builder Test', async () => {
    var _a, _b;
    const data = {
        organization: fixture.entities.defaultOrg,
        employees: fixture2.entities.defaultEmps,
        meta: fixture3.entities.defaultMeta,
        payrollInit: fixture4.entities.data,
    };
    const payroll = payroll_director_1.PayrollDirector.build(data);
    expect((_a = payroll.employees[0].totalProRate) === null || _a === void 0 ? void 0 : _a.amount).toBe(5000);
    expect((_b = payroll.employees[0].totalBonuses) === null || _b === void 0 ? void 0 : _b.amount).toBe(data.employees[0].bonuses[0].amount.amount);
});
//# sourceMappingURL=payroll.spec.js.map