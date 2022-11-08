import {IMoney, Money} from '../../../interfaces/payment/money.interface';
import {IPayrollEmployee} from '../../../interfaces/payroll/payroll.interface';
import {TAX} from '../../../constants/tax.constants';
import {BaseClass} from './base.tax';
import {ProcessTaxPayload} from './tax.types';

export class GhanaTax extends BaseClass {
  static country = 'GH';

  private taxSettings;
  constructor(context: ProcessTaxPayload) {
    super(context);
    this.taxSettings = TAX.GHANA;
  }

  calculateTaxRelief(employee: IPayrollEmployee) {
    const entity = this.getBreakdown(employee);

    const basicPercent = entity.basic || 0;
    const {totalBonus, totalLeaveAllowance, zeroMoney} = employee;

    const base = employee.basePayable || employee.base;

    const grossSalary = Money.addMany([
      base,
      totalBonus || zeroMoney,
      totalLeaveAllowance || zeroMoney,
    ]);

    let ssnit = zeroMoney;
    const pensionObj = (employee.remittances || []).find(
      b => b.name === 'pension'
    );

    let excess = zeroMoney;
    let tier3Relief = zeroMoney;

    if (pensionObj) {
      const basicPortion = Money.mul(base, basicPercent / 100);

      ssnit = Money.mul(basicPortion, this.taxSettings.SSNIT_PERCENTAGE);
      if (Money.greaterThan(ssnit, this.taxSettings.PENSION_CAP))
        ssnit = Money.new(this.taxSettings.PENSION_CAP, ssnit.currency); // cap maximum contribution to 35,000 * 0.055

      ({tier3Relief, excess} = this.getTier3Relief(
        base,
        basicPercent,
        <Record<string, IMoney>>pensionObj
      ));
    }

    const relief = Money.add(<IMoney>ssnit, <IMoney>tier3Relief);

    return {
      relief, // the excess on tier 3 relief is added to the gross salary
      taxableSalary: Money.sub(Money.add(grossSalary, <IMoney>excess), relief),
    };
  }

  processEmployeeTax(employee: IPayrollEmployee) {
    const relief = this.calculateTaxRelief(employee);
    const tax = this.calculateTax(
      relief.taxableSalary.value,
      employee.currency
    );

    return {
      tax: Money.new(tax, employee.currency),
      relief,
    };
  }

  isMinimumWage(employee: IPayrollEmployee) {
    const {totalBonus, zeroMoney} = employee;
    const base = employee.basePayable || employee.base;

    const gross = Money.add(base, totalBonus || <IMoney>zeroMoney);
    return Money.lessThanEq(gross, this.taxSettings.MINIMUM_WAGE);
  }

  exempt(employee: IPayrollEmployee) {
    return this.isMinimumWage(employee);
  }

  getTier3Relief(
    base: IMoney,
    basicPercent: number,
    {
      voluntaryPensionContribution,
      voluntaryPensionContributionEmployer,
    }: Record<string, IMoney>
  ) {
    const totalTier3 = Money.add(
      voluntaryPensionContribution,
      voluntaryPensionContributionEmployer
    );

    let tier3Relief = totalTier3;
    const maxTier3Relief = Money.mul(
      Money.mul(base, basicPercent / 100),
      0.165
    );

    if (Money.greaterThan(tier3Relief, maxTier3Relief)) {
      tier3Relief = maxTier3Relief;
    }
    const excess = Money.sub(totalTier3, tier3Relief);

    return {tier3Relief, excess};
  }

  calculateTax(taxableIncome: number, employeeCountry: string) {
    let totalTax = 0;
    let remainingSalary = taxableIncome;
    const employeeIsNonIndigene = employeeCountry !== 'GHS';
    if (employeeIsNonIndigene) {
      return (25 * remainingSalary) / 100;
    }

    // First GHC365
    if (remainingSalary > 365) {
      remainingSalary -= 365;
    } else {
      return totalTax;
    }

    // Next GHC110
    if (remainingSalary > 110) {
      remainingSalary -= 110;
      totalTax += 0.05 * 110;
    } else {
      totalTax += 0.05 * remainingSalary;
      return totalTax;
    }

    // Next GHC130
    if (remainingSalary > 130) {
      remainingSalary -= 130;
      totalTax += 0.1 * 130;
    } else {
      totalTax += 0.1 * remainingSalary;
      return totalTax;
    }

    // Next GHC3,000
    if (remainingSalary > 3000) {
      remainingSalary -= 3000;
      totalTax += 0.175 * 3000;
    } else {
      totalTax += 0.175 * remainingSalary;
      return totalTax;
    }

    // Next GHC16,395
    if (remainingSalary > 16395) {
      remainingSalary -= 16395;
      totalTax += 0.25 * 16395;
    } else {
      totalTax += 0.25 * remainingSalary;
      return totalTax;
    }

    // Over GHC20,000
    totalTax += 0.3 * remainingSalary;
    return totalTax;
  }
}
