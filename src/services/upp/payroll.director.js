"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollDirector = void 0;
const lodash_1 = require("lodash");
const payroll_builder_1 = require("./payroll.builder");
/**
 * This builder is used to create a payroll object
 */
class PayrollDirector {
    static build(data) {
        return new payroll_builder_1.PayrollBuilder(data).get();
    }
    static getInstance(data) {
        return new payroll_builder_1.PayrollBuilder((0, lodash_1.cloneDeep)(data));
    }
    static updateEmployees(instance, employees) {
        // get a clone of the data used to initialise instance
        const data = (0, lodash_1.cloneDeep)(instance.getData());
        // update employees in data to just employee(s) to update
        data.employees = Array.isArray(employees) ? employees : [employees];
        // initialise new instance with modified data
        const { employees: reprocessedEmployees } = new payroll_builder_1.PayrollBuilder(data).get();
        const employeesKeyedById = (0, lodash_1.keyBy)(reprocessedEmployees, 'id');
        // merge current and previous processed employees
        data.employees = instance.getProcessedEmployees().map(employee => {
            return employeesKeyedById[employee.id] || employee;
        });
        // calling getTotals on this instance returns updated totals
        return new payroll_builder_1.PayrollBuilder(data);
    }
}
exports.PayrollDirector = PayrollDirector;
//# sourceMappingURL=payroll.director.js.map