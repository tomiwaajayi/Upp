"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollBuilder = void 0;
/**
 * This builder is used to create a payroll object
 */
class PayrollBuilder {
    constructor(employees, organization, meta, payrollData) {
        this._employees = employees;
        this._organization = organization;
        this._meta = meta;
        this._payroll = {
            ...payrollData,
        };
    }
    /**
     * Process single employee prorate
     * note that there can only be a single prorate entry for an employee
     */
    processProRates(employee) {
        employee.totalProRate = { amount: 5000, currency: 'NGN' };
    }
    /**
     * Call this method to return a promise of the resulting operation
     */
    async build() {
        await Promise.all(this._employees.map((employee) => {
            // employee processes goes here
            this.processProRates(employee);
        }));
        console.log(this._employees);
        return {
            ...this._payroll,
            organization: this._organization,
            employees: this._employees,
        };
    }
}
exports.PayrollBuilder = PayrollBuilder;
//# sourceMappingURL=director.js.map