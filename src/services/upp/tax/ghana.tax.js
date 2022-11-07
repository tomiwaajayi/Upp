"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GhanaTax = void 0;
const money_interface_1 = require("../../../interfaces/payment/money.interface");
const tax_constants_1 = require("../../../constants/tax.constants");
const base_tax_1 = require("./base.tax");
class GhanaTax extends base_tax_1.BaseClass {
    constructor(context) {
        super(context);
        this.taxSettings = tax_constants_1.TAX.GHANA;
    }
    calculateTaxRelief(employee) {
        const entity = this.getBreakdown(employee);
        const basicPercent = entity.basic || 0;
        const { totalBonus, totalLeaveAllowance, zeroMoney } = employee;
        const base = employee.basePayable || employee.base;
        const grossSalary = money_interface_1.Money.addMany([
            base,
            totalBonus || zeroMoney,
            totalLeaveAllowance || zeroMoney,
        ]);
        let ssnit = zeroMoney;
        const pensionObj = (employee.remittances || []).find(b => b.name === 'pension');
        let excess = zeroMoney;
        let tier3Relief = zeroMoney;
        if (pensionObj) {
            const basicPortion = money_interface_1.Money.mul(base, basicPercent / 100);
            ssnit = money_interface_1.Money.mul(basicPortion, this.taxSettings.SSNIT_PERCENTAGE);
            if (money_interface_1.Money.greaterThan(ssnit, this.taxSettings.PENSION_CAP))
                ssnit = money_interface_1.Money.new(this.taxSettings.PENSION_CAP, ssnit.currency); // cap maximum contribution to 35,000 * 0.055
            ({ tier3Relief, excess } = this.getTier3Relief(base, basicPercent, pensionObj));
        }
        const relief = money_interface_1.Money.add(ssnit, tier3Relief);
        return {
            relief,
            taxableSalary: money_interface_1.Money.sub(money_interface_1.Money.add(grossSalary, excess), relief),
        };
    }
    processEmployeeTax(employee) {
        const relief = this.calculateTaxRelief(employee);
        const tax = this.calculateTax(relief.taxableSalary.value, employee.currency);
        return {
            tax: money_interface_1.Money.new(tax, employee.currency),
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
    getTier3Relief(base, basicPercent, { voluntaryPensionContribution, voluntaryPensionContributionEmployer, }) {
        const totalTier3 = money_interface_1.Money.add(voluntaryPensionContribution, voluntaryPensionContributionEmployer);
        let tier3Relief = totalTier3;
        const maxTier3Relief = money_interface_1.Money.mul(money_interface_1.Money.mul(base, basicPercent / 100), 0.165);
        if (money_interface_1.Money.greaterThan(tier3Relief, maxTier3Relief)) {
            tier3Relief = maxTier3Relief;
        }
        const excess = money_interface_1.Money.sub(totalTier3, tier3Relief);
        return { tier3Relief, excess };
    }
    calculateTax(taxableIncome, employeeCountry) {
        let totalTax = 0;
        let remainingSalary = taxableIncome;
        const employeeIsNonIndigene = employeeCountry !== 'GHS';
        if (employeeIsNonIndigene) {
            return (25 * remainingSalary) / 100;
        }
        // First GHC365
        if (remainingSalary > 365) {
            remainingSalary -= 365;
        }
        else {
            return totalTax;
        }
        // Next GHC110
        if (remainingSalary > 110) {
            remainingSalary -= 110;
            totalTax += 0.05 * 110;
        }
        else {
            totalTax += 0.05 * remainingSalary;
            return totalTax;
        }
        // Next GHC130
        if (remainingSalary > 130) {
            remainingSalary -= 130;
            totalTax += 0.1 * 130;
        }
        else {
            totalTax += 0.1 * remainingSalary;
            return totalTax;
        }
        // Next GHC3,000
        if (remainingSalary > 3000) {
            remainingSalary -= 3000;
            totalTax += 0.175 * 3000;
        }
        else {
            totalTax += 0.175 * remainingSalary;
            return totalTax;
        }
        // Next GHC16,395
        if (remainingSalary > 16395) {
            remainingSalary -= 16395;
            totalTax += 0.25 * 16395;
        }
        else {
            totalTax += 0.25 * remainingSalary;
            return totalTax;
        }
        // Over GHC20,000
        totalTax += 0.3 * remainingSalary;
        return totalTax;
    }
}
exports.GhanaTax = GhanaTax;
GhanaTax.country = 'Ghana';
//# sourceMappingURL=ghana.tax.js.map