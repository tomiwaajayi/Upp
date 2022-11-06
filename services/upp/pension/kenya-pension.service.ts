import {PENSION} from '../../../constants/pension.constant';
import {IMoney, Money} from '../../../interfaces/payment/money.interface';
import {BaseCountryPensionService} from './base.service';
import {ProcessPensionPayload} from './pension.types';

export class KenyaPensionService extends BaseCountryPensionService {
  constructor() {
    super(PENSION.KENYA.EMPLOYEE_PERCENT, PENSION.KENYA.EMPLOYER_PERCENT);
  }

  static country = 'KE';

  calculatePension(
    _breakdown: Record<string, number>,
    salary: IMoney,
    percent: number
  ) {
    return Money.mul(salary, {value: percent / 100, currency: salary.currency});
  }

  processEmployeePensionDeduction(payload: ProcessPensionPayload) {
    const {base, pensionContributionEnabled, pensionContribution} =
      payload.employee;
    const {currency} = base;
    const pensionDeductType = payload.organizationSettings.pensionDeductType as
      | 'old-rate'
      | 'tier-1';
    let employeeContribution = {value: 0, currency};
    let employerContribution = {value: 0, currency};

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
          value: Math.min(base.value, PENSION.KENYA.UPPER_EARNING_LIMIT),
          currency,
        };

        // tier 1 portion has a max of KES 6000
        const tier1Portion = {
          value: Math.min(
            penableEarning.value,
            PENSION.KENYA.LOWER_EARNING_LIMIT
          ),
          currency,
        };

        // tier 2 portion is the rmainder with a max of KES 12000
        const check = Money.sub(penableEarning, tier1Portion);

        const tier2Portion = {value: Math.max(0, check.value), currency};

        const employeeTier1Contribution = this.calculatePension(
          {},
          tier1Portion,
          this.employeePercent
        );

        const employeeTier2Contribution = this.calculatePension(
          {},
          tier2Portion,
          this.employerPercent
        );

        const employerTier1Contribution = this.calculatePension(
          {},
          tier1Portion,
          this.employerPercent
        );

        const employerTier2Contribution = this.calculatePension(
          {},
          tier2Portion,
          this.employerPercent
        );

        employeeContribution = Money.add(
          employeeTier1Contribution,
          employeeTier2Contribution
        );

        employerContribution = Money.add(
          employerTier1Contribution,
          employerTier2Contribution
        );
        break;
      }
    }

    if (pensionContributionEnabled) {
      employeeContribution = Money.add(employeeContribution, {
        value: pensionContribution || 0,
        currency,
      });
    }

    return {
      ...super.processEmployeePensionDeduction(payload),
      amount: Money.add(employeeContribution, employerContribution),
      employeeContribution,
      employerContribution,
      pensionDeductType,
    };
  }
}
