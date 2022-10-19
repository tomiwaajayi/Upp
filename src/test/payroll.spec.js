"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const payroll_director_1 = require("../services/upp/payroll.director");
const fixture = require("./fixtures/organization.json");
const fixture2 = require("./fixtures/employee.json");
const fixture3 = require("./fixtures/meta.json");
test('Payroll Builder Test', async () => {
    var _a;
    const data = {
        organization: fixture.entities.defaultOrg,
        employees: fixture2.entities.defaultEmps,
        meta: fixture3.entities.defaultMeta,
        payrollInit: {
            proRateMonth: 'October',
            payItem: {
                tax: 'unpaid',
                pension: 'unpaid',
                health: 'unpaid',
                nhf: 'unpaid',
                nhif: 'unpaid',
                itf: 'unpaid',
                nsitf: 'unpaid',
            },
            deselected: [],
            createdBy: '633f4f707c6aa9362ca61f2a',
        },
    };
    const payroll = payroll_director_1.PayrollDirector.construct(data);
    expect((_a = payroll.employees[0].totalProRate) === null || _a === void 0 ? void 0 : _a.amount).toBe(5000);
});
//# sourceMappingURL=payroll.spec.js.map