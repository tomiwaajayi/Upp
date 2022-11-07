"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NigeriaTax = void 0;
const base_tax_1 = require("@upp/tax/base.tax");
const tax_constants_1 = require("@sh/constants/tax.constants");
const money_interface_1 = require("@sh/interfaces/payment/money.interface");
class NigeriaTax extends base_tax_1.BaseClass {
    constructor(context) {
        super(context);
        this.taxSettings = tax_constants_1.TAX.NIGERIA;
    }
    getConsolidatedRelief(gross, grossCRA, useCRAGross) {
        // First Consolidated relief is 1% of Gross Income or N200000 whichever is higher
        let consolidatedRelief1 = money_interface_1.Money.mul(useCRAGross ? grossCRA : gross, 0.01);
        if (money_interface_1.Money.lessThan(consolidatedRelief1, 200000 / 12)) {
            consolidatedRelief1 = money_interface_1.Money.new(200000 / 12, gross.currency);
        }
        // Second Consolidated Relief is 20% of Gross Income after deducting relief
        const consolidatedRelief2 = money_interface_1.Money.mul(grossCRA, 0.2);
        return money_interface_1.Money.add(consolidatedRelief2, consolidatedRelief1);
    }
    isMinimumWage(employee) {
        var _a;
        const { totalBonus, zeroMoney } = employee;
        const base = employee.basePayable || employee.base;
        let gross = money_interface_1.Money.add(base, totalBonus || zeroMoney);
        const taxSettings = (_a = this.settings.remittances) === null || _a === void 0 ? void 0 : _a.tax;
        if (taxSettings === null || taxSettings === void 0 ? void 0 : taxSettings.useGrossOnlyForMinimumWage) {
            gross = employee.base;
        }
        return money_interface_1.Money.lessThanEq(gross, this.taxSettings.MINIMUM_WAGE);
    }
    exempt(employee) {
        return this.isMinimumWage(employee);
    }
    getTaxableSalary(employee, grossSalary) {
        const pensionObj = (employee.remittances || []).find(b => b.name === 'pension');
        const nhfObj = (employee.remittances || []).find(b => b.name === 'nhf');
        // reliefs
        const pension = (pensionObj === null || pensionObj === void 0 ? void 0 : pensionObj.amount) || employee.zeroMoney;
        const nhf = (nhfObj === null || nhfObj === void 0 ? void 0 : nhfObj.amount) || employee.zeroMoney;
        const taxGrossSalary = money_interface_1.Money.subMany(grossSalary, [
            pension,
            nhf,
        ]);
        const cra = this.getConsolidatedRelief(grossSalary, taxGrossSalary, this.settings.useCRAGross);
        let healthRelief = 0;
        const { hasHealthReliefEnabled, hasHealthAccessEnabled, healthReliefAmount, healthAccessAmount, currency, zeroMoney, } = employee;
        // if health relief activated check for health access first then default to custom amount
        if (hasHealthReliefEnabled) {
            healthRelief = hasHealthAccessEnabled
                ? healthAccessAmount || 0
                : healthReliefAmount || 0;
        }
        // Total relief and taxable salary
        const totalRelief = money_interface_1.Money.addMany([
            cra,
            nhf,
            pension,
            money_interface_1.Money.new(healthRelief, currency),
        ]);
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
    calculateTax(taxableIncome) {
        let totalTax = 0;
        let remainingSalary = taxableIncome;
        // First N25000
        if (remainingSalary > 25000) {
            remainingSalary -= 25000;
            totalTax = 0.07 * 25000;
        }
        else {
            totalTax = 0.07 * remainingSalary;
            return totalTax;
        }
        // Next N25000
        if (remainingSalary > 25000) {
            remainingSalary -= 25000;
            totalTax += 0.11 * 25000;
        }
        else {
            totalTax += 0.11 * remainingSalary;
            return totalTax;
        }
        // Next N41667
        if (remainingSalary > 41667) {
            remainingSalary -= 41667;
            totalTax += 0.15 * 41667;
        }
        else {
            totalTax += 0.15 * remainingSalary;
            return totalTax;
        }
        // Next N41667
        if (remainingSalary > 41667) {
            remainingSalary -= 41667;
            totalTax += 0.19 * 41667;
        }
        else {
            totalTax += 0.19 * remainingSalary;
            return totalTax;
        }
        // Next N133333
        if (remainingSalary > 133333) {
            remainingSalary -= 133333;
            totalTax += 0.21 * 133333;
        }
        else {
            totalTax += 0.21 * remainingSalary;
            return totalTax;
        }
        // Over N266666
        totalTax += 0.24 * remainingSalary;
        return totalTax;
    }
    processEmployeeTax(employee) {
        const relief = this.calculateTaxRelief(employee);
        const tax = this.calculateTax(relief.taxableSalary.value);
        return {
            tax: money_interface_1.Money.new(tax, employee.currency),
            relief,
        };
    }
}
exports.NigeriaTax = NigeriaTax;
NigeriaTax.country = 'Nigeria';
//# sourceMappingURL=nigeria.tax.js.map