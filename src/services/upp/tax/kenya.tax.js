"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KenyaTax = void 0;
const money_interface_1 = require("@sh/interfaces/payment/money.interface");
const tax_constants_1 = require("@sh/constants/tax.constants");
const base_tax_1 = require("@upp/tax/base.tax");
class KenyaTax extends base_tax_1.BaseClass {
    constructor(context) {
        super(context);
        this.taxSettings = tax_constants_1.TAX.KENYA;
    }
    getTaxableSalary(employee, grossSalary) {
        // Pensions also acts as a relief
        const pensionObj = (employee.remittances || []).find(b => b.name === 'pension');
        const zeroMoney = employee.zeroMoney;
        // Total relief and taxable salary
        let totalRelief = (pensionObj === null || pensionObj === void 0 ? void 0 : pensionObj.amount) || zeroMoney;
        if (money_interface_1.Money.greaterThan(totalRelief, 20000)) {
            totalRelief = money_interface_1.Money.new(20000, employee.currency);
        }
        let taxableSalary = money_interface_1.Money.sub(grossSalary, totalRelief);
        // if relief is greater than gross set taxable to 0
        taxableSalary = money_interface_1.Money.greaterThan(taxableSalary, 0)
            ? taxableSalary
            : zeroMoney;
        return {
            totalRelief,
            taxableSalary,
        };
    }
    calculateTaxRelief(employee) {
        const { payItem } = this.meta;
        const { zeroMoney } = employee;
        const isBonusOnly = payItem && payItem.base === 'unpaid' && payItem.bonus !== 'unpaid';
        const { totalBonus, totalLeaveAllowance } = employee;
        const base = employee.basePayable || employee.base;
        let grossSalary = money_interface_1.Money.addMany([
            base,
            totalBonus || zeroMoney,
            totalLeaveAllowance || zeroMoney,
        ]);
        if (isBonusOnly && !this.settings.payFullTax) {
            grossSalary = money_interface_1.Money.sub(grossSalary, base);
        }
        const gross = this.getTaxableSalary(employee, grossSalary);
        return {
            relief: gross.totalRelief,
            taxableSalary: gross.taxableSalary,
        };
    }
    processEmployeeTax(employee) {
        const relief = this.calculateTaxRelief(employee);
        const taxCalc = this.calculateTax(relief.taxableSalary.value);
        let tax = money_interface_1.Money.new(taxCalc || 0, employee.currency);
        // if health relief activated check for health access first then default to custom amount
        const nhif = (employee.remittances || []).find(b => b.name === 'nhif');
        const { hasHealthReliefEnabled, healthReliefAmount } = employee;
        const lifeCover = hasHealthReliefEnabled ? healthReliefAmount : 0;
        let premiumRelief = money_interface_1.Money.mul(money_interface_1.Money.add((nhif === null || nhif === void 0 ? void 0 : nhif.amount) || employee.zeroMoney, lifeCover), 0.15);
        if (money_interface_1.Money.greaterThan(premiumRelief, 5000))
            premiumRelief = money_interface_1.Money.new(5000, employee.currency);
        // health relief is 15% of total value
        const otherReliefs = money_interface_1.Money.add(premiumRelief, this.taxSettings.PERSONAL_RELIEF);
        relief.relief = money_interface_1.Money.add(relief.relief, otherReliefs);
        tax = money_interface_1.Money.sub(tax, otherReliefs);
        return {
            tax,
            relief,
        };
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
    calculateTax(taxableIncome) {
        let totalTax = 0;
        let remainingSalary = taxableIncome;
        // First 24000
        if (remainingSalary >= 24000) {
            remainingSalary -= 24000;
            totalTax += 0.1 * 24000;
        }
        else {
            return totalTax;
        }
        // Next 8333
        if (remainingSalary > 8333) {
            remainingSalary -= 8333;
            totalTax += 0.25 * 8333;
        }
        else {
            totalTax += 0.25 * remainingSalary;
            return totalTax;
        }
        // Over 32333
        totalTax += 0.3 * remainingSalary;
        return totalTax;
    }
}
exports.KenyaTax = KenyaTax;
KenyaTax.country = 'KE';
//# sourceMappingURL=kenya.tax.js.map