"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollBuilder = void 0;
class PayrollBuilder {
    constructor(data) {
        this.employees = data.employees;
        this.organization = data.organization;
        this.meta = data.meta;
        this.payroll = {
            ...data.payrollInit,
        };
    }
    /**
     * Process single employee prorate
     * note that there can only be a single prorate entry for an employee
     */
    processProRates(employee) {
        employee.totalProRate = { amount: 5000, currency: 'NGN' };
    }
    buildPartA() {
        Promise.all(this.employees.map((employee) => {
            // employee processes goes here
            this.processProRates(employee);
        })).then();
        return this;
    }
    buildPartB() {
        Promise.all(this.employees.map((employee) => {
            // employee processes goes here
            return this.processProRates(employee);
        })).then();
        return this;
    }
    async buildPartC() {
        await Promise.all(this.employees.map((employee) => {
            // employee processes goes here
            this.processProRates(employee);
        }));
        return this;
    }
    get() {
        return {
            ...this.payroll,
            organization: this.organization,
            employees: this.employees,
        };
    }
}
exports.PayrollBuilder = PayrollBuilder;
//# sourceMappingURL=payroll.builder.js.map