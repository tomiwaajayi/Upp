"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GahanaPensionService = void 0;
const pension_constant_1 = require("../../constants/pension.constant");
const money_interface_1 = require("../../interfaces/payment/money.interface");
const base_service_1 = require("./base.service");
class GahanaPensionService extends base_service_1.BaseCountryPensionService {
    constructor() {
        super(pension_constant_1.PENSION.GHANA.EMPLOYEE_PERCENT, pension_constant_1.PENSION.GHANA.EMPLOYER_PERCENT);
    }
    calculatePension(breakdown, salary, percent, calculateExcess) {
        const { currency } = salary;
        const pensionCap = { value: 35000, currency };
        const basicPercent = breakdown.basic || 0;
        const basic = money_interface_1.Money.mul(salary, { value: basicPercent / 100, currency });
        let gross = salary;
        if (basicPercent !== 0) {
            gross = basic;
        }
        if (calculateExcess) {
            const excess = money_interface_1.Money.sub(gross, pensionCap);
            if (excess.value < 0) {
                return { value: 0, currency };
            }
            return money_interface_1.Money.mul(money_interface_1.Money.sub(gross, pensionCap), { value: 0.185, currency });
        }
        // cap maximum contribution to 35,000
        if (gross.value > pensionCap.value) {
            gross = pensionCap;
        }
        return money_interface_1.Money.mul(gross, { value: percent / 100, currency });
    }
    processEmployeePensionDeduction(payload) {
        const { employee, organizationSettings } = payload;
        const { excessPensionToTierThree } = organizationSettings;
        const employeePensionDeduction = super.processEmployeePensionDeduction(payload);
        const { amount } = employeePensionDeduction;
        const { currency } = amount;
        const breakdown = this.getBreakdown(payload);
        let excessPension = { value: 0, currency };
        if (excessPensionToTierThree) {
            excessPension = this.calculatePension(breakdown, employee.base, this.employeePercent, true);
        }
        if (excessPension.value > 0) {
            employee.pensionContributionEnabled = true;
        }
        const employeeExcess = money_interface_1.Money.mul(excessPension, {
            value: 5.5 / 18.5,
            currency,
        });
        const tierThree = {
            value: employee.voluntaryPensionContribution || 0,
            currency,
        };
        const employerTierThree = {
            value: employee.voluntaryPensionContributionEmployer || 0,
            currency,
        };
        return {
            ...employeePensionDeduction,
            pensionTierOne: money_interface_1.Money.mul(amount, {
                value: pension_constant_1.PENSION.GHANA.SSNIT_PERCENT,
                currency,
            }),
            pensionTierTwo: money_interface_1.Money.mul(amount, {
                value: pension_constant_1.PENSION.GHANA.TIER2_PERCENT,
                currency,
            }),
            pensionTierThree: money_interface_1.Money.add({ value: employee.pensionContribution || 0, currency }, { value: employee.employerPensionContribution || 0, currency }),
            excessPension,
            tierThree,
            employerTierThree,
            actualVoluntaryPension: { tierThree, employerTierThree },
            voluntaryPensionContribution: money_interface_1.Money.add(tierThree, employeeExcess),
            voluntaryPensionContributionEmployer: money_interface_1.Money.sub(money_interface_1.Money.add(employerTierThree, excessPension), employeeExcess),
        };
    }
}
exports.GahanaPensionService = GahanaPensionService;
GahanaPensionService.country = 'GH';
//# sourceMappingURL=ghana-pension.service.js.map