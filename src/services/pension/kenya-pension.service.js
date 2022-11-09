"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KenyaPensionService = void 0;
const pension_constant_1 = require("../../constants/pension.constant");
const money_interface_1 = require("../../interfaces/payment/money.interface");
const base_service_1 = require("./base.service");
class KenyaPensionService extends base_service_1.BaseCountryPensionService {
    constructor() {
        super(pension_constant_1.PENSION.KENYA.EMPLOYEE_PERCENT, pension_constant_1.PENSION.KENYA.EMPLOYER_PERCENT);
    }
    calculatePension(_breakdown, salary, percent) {
        return money_interface_1.Money.mul(salary, { value: percent / 100, currency: salary.currency });
    }
    processEmployeePensionDeduction(payload) {
        const { base, pensionContributionEnabled, pensionContribution } = payload.employee;
        const { currency } = base;
        const pensionDeductType = payload.organizationSettings.pensionDeductType;
        let employeeContribution = { value: 0, currency };
        let employerContribution = { value: 0, currency };
        switch (pensionDeductType) {
            case 'old-rate': {
                // some organizations still use old NSSF rates
                employeeContribution.value = 200;
                employerContribution.value = 200;
                break;
            }
            case 'tier-1': {
                // some organizations use Tier 1 NSSF rates
                employeeContribution.value = 360;
                employerContribution.value = 360;
                break;
            }
            default: {
                const penableEarning = {
                    value: Math.min(base.value, pension_constant_1.PENSION.KENYA.UPPER_EARNING_LIMIT),
                    currency,
                };
                // tier 1 portion has a max of KES 6000
                const tier1Portion = {
                    value: Math.min(penableEarning.value, pension_constant_1.PENSION.KENYA.LOWER_EARNING_LIMIT),
                    currency,
                };
                // tier 2 portion is the rmainder with a max of KES 12000
                const check = money_interface_1.Money.sub(penableEarning, tier1Portion);
                const tier2Portion = { value: Math.max(0, check.value), currency };
                const employeeTier1Contribution = this.calculatePension({}, tier1Portion, this.employeePercent);
                const employeeTier2Contribution = this.calculatePension({}, tier2Portion, this.employerPercent);
                const employerTier1Contribution = this.calculatePension({}, tier1Portion, this.employerPercent);
                const employerTier2Contribution = this.calculatePension({}, tier2Portion, this.employerPercent);
                employeeContribution = money_interface_1.Money.add(employeeTier1Contribution, employeeTier2Contribution);
                employerContribution = money_interface_1.Money.add(employerTier1Contribution, employerTier2Contribution);
                break;
            }
        }
        if (pensionContributionEnabled) {
            employeeContribution = money_interface_1.Money.add(employeeContribution, {
                value: pensionContribution || 0,
                currency,
            });
        }
        return {
            ...super.processEmployeePensionDeduction(payload),
            amount: money_interface_1.Money.add(employeeContribution, employerContribution),
            employeeContribution,
            employerContribution,
            pensionDeductType,
        };
    }
}
exports.KenyaPensionService = KenyaPensionService;
KenyaPensionService.country = 'KE';
//# sourceMappingURL=kenya-pension.service.js.map