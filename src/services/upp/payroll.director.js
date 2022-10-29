"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollDirector = void 0;
const payroll_builder_1 = require("./payroll.builder");
/**
 * This builder is used to create a payroll object
 */
class PayrollDirector {
    static build(data) {
        return new payroll_builder_1.PayrollBuilder(data).get();
    }
}
exports.PayrollDirector = PayrollDirector;
//# sourceMappingURL=payroll.director.js.map