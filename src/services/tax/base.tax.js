"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseClass = void 0;
const money_interface_1 = require("../../interfaces/payment/money.interface");
class BaseClass {
    constructor(context) {
        const { organization, settings, meta } = context;
        this.organization = organization;
        this.settings = settings;
        this.meta = meta;
    }
    process(employee) {
        var _a, _b, _c, _d;
        const { group } = employee;
        const entity = ((group || this.settings).remittances);
        const enabledTaxes = (_a = entity === null || entity === void 0 ? void 0 : entity.tax) === null || _a === void 0 ? void 0 : _a.enabled;
        const enabledWHT = (_c = (_b = group === null || group === void 0 ? void 0 : group.remittances) === null || _b === void 0 ? void 0 : _b.tax) === null || _c === void 0 ? void 0 : _c.enabledWithHoldingTax;
        if (!enabledTaxes || this.exempt(employee)) {
            return;
        }
        const { relief, tax } = enabledWHT
            ? this.processEmployeeWHT(employee)
            : this.processEmployeeTax(employee);
        const remittances = employee.remittances || [];
        employee.remittances = [
            ...remittances,
            {
                ...relief,
                name: 'tax',
                amount: tax,
                remittanceEnabled: (_d = entity.tax) === null || _d === void 0 ? void 0 : _d.remit,
            },
        ];
    }
    calculateWithHoldingTax(taxableIncome, whtaxRate) {
        // WHT
        return money_interface_1.Money.mul(taxableIncome, whtaxRate);
    }
    calculateWithHoldingTaxRelief(employee) {
        const base = employee.basePayable || employee.base;
        const grossSalary = money_interface_1.Money.add(base, employee.totalBonus);
        // WHT is applicable to contractors & interns
        // Do not get pensions, nhf & pther benefits
        // So no relief! None, Nada, Zilch!
        return {
            relief: { value: 0, currency: employee.currency },
            taxableSalary: grossSalary,
        };
    }
    processEmployeeWHT(employee) {
        var _a;
        employee.whtaxApplied = true;
        const groupTaxSettings = (_a = employee.group.remittances) === null || _a === void 0 ? void 0 : _a.tax;
        const relief = this.calculateWithHoldingTaxRelief(employee);
        const tax = this.calculateWithHoldingTax(relief.taxableSalary, groupTaxSettings === null || groupTaxSettings === void 0 ? void 0 : groupTaxSettings.WHTaxRate);
        return { relief, tax };
    }
    // always return false except the function is present in the child class
    exempt(employee) {
        return !employee;
    }
    processEmployeeTax(employee) {
        const { zeroMoney } = employee;
        return {
            relief: { relief: zeroMoney, taxableSalary: zeroMoney },
            tax: { value: 0, currency: employee.currency },
        };
    }
    getBreakdown(employee) {
        const { group } = employee;
        return (employee.salaryBreakdown ||
            (group === null || group === void 0 ? void 0 : group.salaryBreakdown) ||
            this.settings.salaryBreakdown ||
            {});
    }
}
exports.BaseClass = BaseClass;
//# sourceMappingURL=base.tax.js.map