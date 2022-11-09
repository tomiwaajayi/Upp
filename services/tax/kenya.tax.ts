import {TAX} from '../../constants/tax.constants';
import {IMoney, Money} from '../../interfaces/payment/money.interface';
import {IPayrollEmployee} from '../../interfaces/payroll/payroll.interface';
import {BaseClass} from './base.tax';
import {ProcessTaxPayload} from './tax.types';

export class KenyaTax extends BaseClass {
  static country = 'KE';

  private taxSettings;
  constructor(context: ProcessTaxPayload) {
    super(context);
    this.taxSettings = TAX.KENYA;
  }

  getTaxableSalary(employee: IPayrollEmployee, grossSalary: IMoney) {
    // Pensions also acts as a relief
    const pensionObj = (employee.remittances || []).find(
      b => b.name === 'pension'
    );
    const zeroMoney = <IMoney>employee.zeroMoney;

    // Total relief and taxable salary
    let totalRelief = <IMoney>pensionObj?.amount || zeroMoney;
    if (Money.greaterThan(totalRelief, 20000)) {
      totalRelief = Money.new(20000, employee.currency);
    }

    let taxableSalary = Money.sub(grossSalary, totalRelief);

    // if relief is greater than gross set taxable to 0
    taxableSalary = Money.greaterThan(taxableSalary, 0)
      ? taxableSalary
      : zeroMoney;

    return {
      totalRelief,
      taxableSalary,
    };
  }

  calculateTaxRelief(employee: IPayrollEmployee) {
    const {payItem} = this.meta;
    const {zeroMoney} = employee;
    const isBonusOnly =
      payItem && payItem.base === 'unpaid' && payItem.bonus !== 'unpaid';

    const {totalBonus, totalLeaveAllowance} = employee;
    const base = employee.basePayable || employee.base;

    let grossSalary = Money.addMany([
      base,
      totalBonus || zeroMoney,
      totalLeaveAllowance || zeroMoney,
    ]);

    if (isBonusOnly && !this.settings.payFullTax) {
      grossSalary = Money.sub(grossSalary, <IMoney>base);
    }

    const gross = this.getTaxableSalary(employee, grossSalary);

    return {
      relief: gross.totalRelief,
      taxableSalary: gross.taxableSalary,
    };
  }

  processEmployeeTax(employee: IPayrollEmployee) {
    const relief = this.calculateTaxRelief(employee);

    const taxCalc = this.calculateTax(relief.taxableSalary.value);
    let tax = Money.new(taxCalc || 0, employee.currency);
    // if health relief activated check for health access first then default to custom amount
    const nhif = (employee.remittances || []).find(b => b.name === 'nhif');

    const {hasHealthReliefEnabled, healthReliefAmount} = employee;

    const lifeCover = hasHealthReliefEnabled ? healthReliefAmount : 0;
    let premiumRelief = Money.mul(
      Money.add(<IMoney>nhif?.amount || employee.zeroMoney, <number>lifeCover),
      0.15
    );

    if (Money.greaterThan(premiumRelief, 5000))
      premiumRelief = Money.new(5000, employee.currency);

    // health relief is 15% of total value
    const otherReliefs = Money.add(
      premiumRelief,
      this.taxSettings.PERSONAL_RELIEF
    );

    relief.relief = Money.add(relief.relief, otherReliefs);
    tax = Money.sub(tax, otherReliefs);

    return {
      tax,
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

  calculateTax(taxableIncome: number) {
    let totalTax = 0;
    let remainingSalary = taxableIncome;

    // First 24000
    if (remainingSalary >= 24000) {
      remainingSalary -= 24000;
      totalTax += 0.1 * 24000;
    } else {
      return totalTax;
    }

    // Next 8333
    if (remainingSalary > 8333) {
      remainingSalary -= 8333;
      totalTax += 0.25 * 8333;
    } else {
      totalTax += 0.25 * remainingSalary;
      return totalTax;
    }

    // Over 32333
    totalTax += 0.3 * remainingSalary;
    return totalTax;
  }
}
