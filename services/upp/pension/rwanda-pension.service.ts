import {PENSION} from '../../../constants/pension.constant';
import {IMoney, Money} from '../../../interfaces/payment/money.interface';
import {BaseCountryPensionService} from './base.service';
import {ProcessPensionPayload} from './pension.types';

export class RwandaPensionService extends BaseCountryPensionService {
  constructor() {
    super(PENSION.RWANDA.EMPLOYEE_PERCENT, PENSION.RWANDA.EMPLOYER_PERCENT);
  }

  static country = 'RW';

  calculatePension(
    _breakdown: Record<string, number>,
    salary: IMoney,
    percent: number
  ) {
    return Money.mul(salary, {value: percent / 100, currency: salary.currency});
  }

  processEmployeePensionDeduction(payload: ProcessPensionPayload) {
    const {organizationSettings} = payload;
    const {base, currency, pensionContribution, employerPensionContribution} =
      payload.employee;

    const {RWANDA} = PENSION;
    const maternityPercentage =
      RWANDA.EMPLOYEE_MATERNITY_PERCENTAGE +
      RWANDA.EMPLOYER_MATERNITY_PERCENTAGE;
    const medicalPercentage =
      RWANDA.EMPLOYEE_MEDICAL_PERCENTAGE + RWANDA.EMPLOYER_MEDICAL_PERCENTAGE;

    const maternityPension = Money.mul(base, {
      value: maternityPercentage / 100,
      currency,
    });
    const employeeMaternityPension = Money.mul(base, {
      value: RWANDA.EMPLOYEE_MATERNITY_PERCENTAGE / 100,
      currency,
    });
    const employerMaternityPension = Money.mul(base, {
      value: RWANDA.EMPLOYER_MATERNITY_PERCENTAGE / 100,
      currency,
    });

    let medicalPension = {value: 0, currency};
    let employeeMedicalPension = {value: 0, currency};
    let employerMedicalPension = {value: 0, currency};
    if (organizationSettings.medicalEnabled) {
      medicalPension = Money.mul(base, {
        value: medicalPercentage / 100,
        currency,
      });
      employeeMedicalPension = Money.mul(base, {
        value: RWANDA.EMPLOYEE_MEDICAL_PERCENTAGE / 100,
        currency,
      });
      employerMedicalPension = Money.mul(base, {
        value: RWANDA.EMPLOYER_MEDICAL_PERCENTAGE / 100,
        currency,
      });
    }

    const employeePensionDeduction = super.processEmployeePensionDeduction(
      payload
    );
    let {employeeContribution, employerContribution} = employeePensionDeduction;

    employeeContribution = Money.addMany([
      employeeContribution,
      employeeMaternityPension,
      employeeMedicalPension,
    ]);
    employerContribution = Money.addMany([
      employerContribution,
      employerMaternityPension,
      employerMedicalPension,
    ]);

    return {
      ...employeePensionDeduction,
      amount: Money.add(employeeContribution, employerContribution),
      employeeContribution,
      employerContribution,
      employeeContributionWithoutMaternityAndMedical:
        employeePensionDeduction.employeeContribution,
      employerContributionWithoutMaternityAndMedical:
        employeePensionDeduction.employerContribution,
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
