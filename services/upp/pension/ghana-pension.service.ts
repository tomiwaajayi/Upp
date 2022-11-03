import {PENSION} from '../../../constants/pension.constant';
import {IMoney, Money} from '../../../interfaces/payment/money.interface';
import {BaseCountryPensionService} from './base.service';
import {ProcessPensionPayload} from './pension.types';

export class GahanaPensionService extends BaseCountryPensionService {
  constructor() {
    super(PENSION.GHANA.EMPLOYEE_PERCENT, PENSION.GHANA.EMPLOYER_PERCENT);
  }

  static country = 'Ghana';

  calculatePension(
    breakdown: Record<string, number>,
    salary: IMoney,
    percent: number,
    calculateExcess?: boolean
  ) {
    const {currency} = salary;
    const pensionCap = {value: 35000, currency};
    const basicPercent = breakdown.basic || 0;
    const basic = Money.mul(salary, {value: basicPercent / 100, currency});
    let gross = salary;

    if (basicPercent !== 0) {
      gross = basic;
    }

    if (calculateExcess) {
      const excess = Money.sub(gross, pensionCap);
      if (excess.value < 0) {
        return {value: 0, currency};
      }

      return Money.mul(Money.sub(gross, pensionCap), {value: 0.185, currency});
    }

    // cap maximum contribution to 35,000
    if (gross.value > pensionCap.value) {
      gross = pensionCap;
    }

    return Money.mul(gross, {value: percent / 100, currency});
  }

  processEmployeePensionDeduction(payload: ProcessPensionPayload) {
    const {employee, organizationSettings} = payload;
    const {excessPensionToTierThree} = organizationSettings;
    const employeePensionDeduction = super.processEmployeePensionDeduction(
      payload
    );
    const {amount} = employeePensionDeduction;
    const {currency} = amount;
    const breakdown = this.getBreakdown(payload);
    let excessPension = {value: 0, currency};
    if (excessPensionToTierThree) {
      excessPension = this.calculatePension(
        breakdown,
        employee.base,
        this.employeePercent,
        true
      );
    }
    if (excessPension.value > 0) {
      employee.pensionContributionEnabled = true;
    }

    const employeeExcess = Money.mul(excessPension, {
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
      pensionTierOne: Money.mul(amount, {
        value: PENSION.GHANA.SSNIT_PERCENT,
        currency,
      }),
      pensionTierTwo: Money.mul(amount, {
        value: PENSION.GHANA.TIER2_PERCENT,
        currency,
      }),
      pensionTierThree: Money.add(
        {value: employee.pensionContribution || 0, currency},
        {value: employee.employerPensionContribution || 0, currency}
      ),
      excessPension,
      tierThree,
      employerTierThree,
      actualVoluntaryPension: {tierThree, employerTierThree},
      voluntaryPensionContribution: Money.add(tierThree, employeeExcess),
      voluntaryPensionContributionEmployer: Money.sub(
        Money.add(employerTierThree, excessPension),
        employeeExcess
      ),
    };
  }
}
