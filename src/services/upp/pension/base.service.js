"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCountryPensionService = void 0;
const money_interface_1 = require("../../../interfaces/payment/money.interface");
class BaseCountryPensionService {
    constructor(employeePercent, employerPercent) {
        this.employeePercent = employeePercent;
        this.employerPercent = employerPercent;
    }
    process(context) {
        var _a;
        const { group, organizationSettings, employee } = context;
        const pension = ((_a = (group ? group : organizationSettings).remittances) === null || _a === void 0 ? void 0 : _a.pension) || {};
        const pensionType = pension.type;
        const remittances = employee.remittances || [];
        if (pensionType === 'deduct') {
            employee.remittances = [
                ...remittances,
                {
                    ...this.processEmployeePensionDeduction(context),
                    remittanceEnabled: this.remitEnabled(context),
                },
            ];
        }
        if (pensionType === 'quote') {
            employee.remittances = [
                ...remittances,
                {
                    ...this.processEmployeePensionQuote(context),
                    remittanceEnabled: this.remitEnabled(context),
                },
            ];
        }
    }
    calculatePension(breakdown, salary, percent) {
        const basicPercent = breakdown.basic || 0;
        const housingPercent = breakdown.housing || 0;
        const transportPercent = breakdown.transport || 0;
        // use gross if no breakdown
        if (basicPercent === 0 && housingPercent === 0 && transportPercent === 0) {
            return { value: salary.value * (percent / 100), currency: salary.currency };
        }
        const basic = salary.value * (basicPercent / 100);
        const housing = salary.value * (housingPercent / 100);
        const transport = salary.value * (transportPercent / 100);
        const itemsTotal = basic + housing + transport;
        return { value: itemsTotal * (percent / 100), currency: salary.currency };
    }
    getBreakdown(payload) {
        const { group, organizationSettings } = payload;
        return (group === null || group === void 0 ? void 0 : group.salaryBreakdown) || organizationSettings.salaryBreakdown || {};
    }
    processEmployeePensionDeduction(payload) {
        const { employee } = payload;
        const { base: salary } = employee;
        const breakdown = this.getBreakdown(payload);
        const employerContribution = this.calculatePension(breakdown, salary, this.employerPercent);
        let employeeContribution = this.calculatePension(breakdown, salary, this.employeePercent);
        if (employee.pensionContributionEnabled) {
            employeeContribution = money_interface_1.Money.add(employeeContribution, {
                value: employee.pensionContribution || 0,
                currency: employeeContribution.currency,
            });
        }
        return {
            amount: money_interface_1.Money.add(employeeContribution, employerContribution),
            name: 'pension',
            employeeContribution,
            employerContribution,
        };
    }
    processEmployeePensionQuote(payload) {
        const { employee } = payload;
        const { base: salary } = employee;
        const breakdown = this.getBreakdown(payload);
        let employeeContribution = { value: 0, currency: salary.currency };
        const employerContribution = this.calculatePension(breakdown, salary, this.employerPercent * 2 // Quote is 20% of employee base salary
        );
        if (employee.pensionContributionEnabled) {
            employeeContribution = money_interface_1.Money.add(employeeContribution, {
                value: employee.pensionContribution || 0,
                currency: employeeContribution.currency,
            });
        }
        return {
            amount: money_interface_1.Money.add(employeeContribution, employerContribution),
            name: 'pension',
            employeeContribution,
            employerContribution,
        };
    }
    remitEnabled(payload) {
        var _a, _b;
        const { group, organizationSettings } = payload;
        return !!((_b = (_a = (group ? group : organizationSettings).remittances) === null || _a === void 0 ? void 0 : _a.pension) === null || _b === void 0 ? void 0 : _b.remit);
    }
}
exports.BaseCountryPensionService = BaseCountryPensionService;
//# sourceMappingURL=base.service.js.map