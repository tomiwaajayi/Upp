"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RwandaPensionService = void 0;
const pension_constant_1 = require("../../constants/pension.constant");
const money_interface_1 = require("../../interfaces/payment/money.interface");
const base_service_1 = require("./base.service");
class RwandaPensionService extends base_service_1.BaseCountryPensionService {
    constructor() {
        super(pension_constant_1.PENSION.RWANDA.EMPLOYEE_PERCENT, pension_constant_1.PENSION.RWANDA.EMPLOYER_PERCENT);
    }
    calculatePension(_breakdown, salary, percent) {
        return money_interface_1.Money.mul(salary, { value: percent / 100, currency: salary.currency });
    }
    processEmployeePensionDeduction(payload) {
        const { organizationSettings } = payload;
        const { base, currency, pensionContribution, employerPensionContribution } = payload.employee;
        const { RWANDA } = pension_constant_1.PENSION;
        const maternityPercentage = RWANDA.EMPLOYEE_MATERNITY_PERCENTAGE +
            RWANDA.EMPLOYER_MATERNITY_PERCENTAGE;
        const medicalPercentage = RWANDA.EMPLOYEE_MEDICAL_PERCENTAGE + RWANDA.EMPLOYER_MEDICAL_PERCENTAGE;
        const maternityPension = money_interface_1.Money.mul(base, {
            value: maternityPercentage / 100,
            currency,
        });
        const employeeMaternityPension = money_interface_1.Money.mul(base, {
            value: RWANDA.EMPLOYEE_MATERNITY_PERCENTAGE / 100,
            currency,
        });
        const employerMaternityPension = money_interface_1.Money.mul(base, {
            value: RWANDA.EMPLOYER_MATERNITY_PERCENTAGE / 100,
            currency,
        });
        let medicalPension = { value: 0, currency };
        let employeeMedicalPension = { value: 0, currency };
        let employerMedicalPension = { value: 0, currency };
        if (organizationSettings.medicalEnabled) {
            medicalPension = money_interface_1.Money.mul(base, {
                value: medicalPercentage / 100,
                currency,
            });
            employeeMedicalPension = money_interface_1.Money.mul(base, {
                value: RWANDA.EMPLOYEE_MEDICAL_PERCENTAGE / 100,
                currency,
            });
            employerMedicalPension = money_interface_1.Money.mul(base, {
                value: RWANDA.EMPLOYER_MEDICAL_PERCENTAGE / 100,
                currency,
            });
        }
        const employeePensionDeduction = super.processEmployeePensionDeduction(payload);
        let { employeeContribution, employerContribution } = employeePensionDeduction;
        employeeContribution = money_interface_1.Money.addMany([
            employeeContribution,
            employeeMaternityPension,
            employeeMedicalPension,
        ]);
        employerContribution = money_interface_1.Money.addMany([
            employerContribution,
            employerMaternityPension,
            employerMedicalPension,
        ]);
        return {
            ...employeePensionDeduction,
            amount: money_interface_1.Money.add(employeeContribution, employerContribution),
            employeeContribution,
            employerContribution,
            employeeContributionWithoutMaternityAndMedical: employeePensionDeduction.employeeContribution,
            employerContributionWithoutMaternityAndMedical: employeePensionDeduction.employerContribution,
            medicalPension,
            employeeMedicalPension,
            employerMedicalPension,
            maternityPension,
            employeeMaternityPension,
            employerMaternityPension,
            employeeVoluntaryPensionContribution: {
                value: pensionContribution || 0,
                currency,
            },
            employerVoluntaryPensionContribution: {
                value: employerPensionContribution || 0,
                currency,
            },
        };
    }
}
exports.RwandaPensionService = RwandaPensionService;
RwandaPensionService.country = 'RW';
//# sourceMappingURL=rwanda-pension.service.js.map