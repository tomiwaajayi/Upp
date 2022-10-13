"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const director_1 = require("../services/upp/director");
const fixture = require("./fixtures/organization.json");
const fixture2 = require("./fixtures/employee.json");
const fixture3 = require("./fixtures/meta.json");
test('Payroll Builder Test', async () => {
    var _a;
    const payroll = await new director_1.PayrollBuilder(fixture2.entities.defaultEmps, fixture.entities.defaultOrg, { proRateMonth: 'October' }, fixture3.entities.defaultMeta).build();
    expect((_a = payroll.employees[0].totalProRate) === null || _a === void 0 ? void 0 : _a.amount).toBe(5000);
});
//# sourceMappingURL=payroll.spec.js.map