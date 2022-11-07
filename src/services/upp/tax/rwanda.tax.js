"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RwandaTax = void 0;
const tax_constants_1 = require("@sh/constants/tax.constants");
const money_interface_1 = require("@sh/interfaces/payment/money.interface");
const base_tax_1 = require("@upp/tax/base.tax");
class RwandaTax extends base_tax_1.BaseClass {
    constructor(context) {
        super(context);
        this.taxSettings = tax_constants_1.TAX.RWANDA;
    }
    isMinimumWage(employee) {
        const { totalBonus, zeroMoney } = employee;
        const base = employee.basePayable || employee.base;
        const gross = money_interface_1.Money.add(base, totalBonus || zeroMoney);
        return money_interface_1.Money.lessThanEq(gross, this.taxSettings.MINIMUM_WAGE);
    }
    exempt(employee) {
        return this.isMinimumWage(employee);
    }
    calculateTaxRelief(employee) {
        const base = employee.basePayable || employee.base;
        const { totalBonus, totalLeaveAllowance, zeroMoney } = employee;
        const grossSalary = money_interface_1.Money.addMany([
            base,
            totalBonus || zeroMoney,
            totalLeaveAllowance || zeroMoney,
        ]);
        return {
            relief: zeroMoney,
            taxableSalary: grossSalary,
        };
    }
    processEmployeeTax(employee) {
        const { employmentType, currency } = employee;
        const relief = this.calculateTaxRelief(employee);
        const tax = this.calculateTax(relief.taxableSalary.value, employmentType);
        return {
            tax: money_interface_1.Money.new(tax, currency),
            relief,
        };
    }
    calculateTax(taxableIncome, employmentType) {
        let totalTax = 0;
        switch (employmentType) {
            case 'casual':
                if (taxableIncome <= 30000) {
                    totalTax = 0;
                }
                else if (taxableIncome > 30000) {
                    totalTax = 0.15 * (taxableIncome - 30000);
                }
                break;
            case 'permanent':
            case 'full-time':
            default:
                if (taxableIncome <= 30000) {
                    totalTax = 0;
                }
                else if (taxableIncome > 30000 && taxableIncome <= 100000) {
                    totalTax = 0.2 * (taxableIncome - 30000);
                }
                else if (taxableIncome > 100000) {
                    totalTax = 0.3 * (taxableIncome - 100000) + 0.2 * 70000;
                }
                break;
        }
        return totalTax;
    }
}
exports.RwandaTax = RwandaTax;
RwandaTax.country = 'Rwanda';
//# sourceMappingURL=rwanda.tax.js.map