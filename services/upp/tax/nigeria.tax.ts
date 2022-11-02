import {NestedRecord} from '../../../interfaces/base.interface';
import {IMoney, Money} from '../../../interfaces/payment/money.interface';
import {IPayrollEmployee} from '../../../interfaces/payroll/payroll.interface';
import {NIGERIA_TAX_SETTINGS} from '../constants';
import {BaseClass} from './base.tax';
import {ProcessTaxPayload} from './tax.types';

export class NigeriaTax extends BaseClass {
  static country = 'Nigeria';

  private ngTaxSettings;
  constructor(context: ProcessTaxPayload) {
    super(context);
    this.ngTaxSettings = NIGERIA_TAX_SETTINGS;
  }

  getConsolidatedRelief(gross: IMoney, grossCRA: IMoney, useCRAGross: boolean) {
    // First Consolidated relief is 1% of Gross Income or N200000 whichever is higher
    let consolidatedRelief1 = Money.mul(useCRAGross ? grossCRA : gross, 0.01);

    if (Money.lessThan(consolidatedRelief1, 200000 / 12)) {
      consolidatedRelief1 = Money.new(200000 / 12, gross.currency);
    }

    // Second Consolidated Relief is 20% of Gross Income after deducting relief
    const consolidatedRelief2 = Money.mul(grossCRA, 0.2);
    return Money.add(consolidatedRelief2, consolidatedRelief1);
  }

  isMinimumWage(employee: IPayrollEmployee) {
    const base = <IMoney>employee.basePayable || <IMoney>employee.salary;

    let gross = Money.add(
      base,
      <IMoney>employee.totalBonus || employee.zeroMoney
    );
    const taxSettings = (<NestedRecord>this.settings.remittances)?.tax;

    if (taxSettings?.useGrossOnlyForMinimumWage) {
      gross = <IMoney>employee.salary;
    }
    return gross.value <= this.ngTaxSettings.MINIMUM_WAGE;
  }

  exempt(employee: IPayrollEmployee) {
    return this.isMinimumWage(employee);
  }

  getTaxableSalary(employee: IPayrollEmployee, grossSalary: IMoney) {
    // Pensions also acts as a relief
    // const {pension: pensionObj, nhf: nhfObj} = (employee.remittances ||
    //   {}) as TRecord<unknown>;
    const pensionObj = (employee.remittances || []).find(
      b => b.name === 'pension'
    );
    const nhfObj = (employee.remittances || []).find(b => b.name === 'nhf');

    // reliefs
    const pension = pensionObj?.amount || employee.zeroMoney;
    const nhf = nhfObj?.amount || employee.zeroMoney;

    const taxGrossSalary = Money.subMany(grossSalary, [
      <IMoney>pension,
      <IMoney>nhf,
    ]);

    const cra = this.getConsolidatedRelief(
      grossSalary,
      taxGrossSalary,
      this.settings.useCRAGross
    );

    let healthRelief = 0;

    const {
      hasHealthReliefEnabled,
      hasHealthAccessEnabled,
      healthReliefAmount,
      healthAccessAmount,
      currency,
      zeroMoney,
    } = employee;

    // if health relief activated check for health access first then default to custom amount
    if (hasHealthReliefEnabled) {
      healthRelief = hasHealthAccessEnabled
        ? healthAccessAmount || 0
        : healthReliefAmount || 0;
    }

    // Total relief and taxable salary
    const totalRelief = Money.addMany([
      cra,
      nhf,
      pension,
      Money.new(healthRelief, currency),
    ]);

    let taxableSalary = Money.sub(grossSalary, totalRelief);
    // if relief is greater than gross set taxable to 0
    taxableSalary = Money.greaterThan(taxableSalary, 0)
      ? taxableSalary
      : <IMoney>zeroMoney;

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
    const base = employee.basePayable || employee.salary;

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

  calculateTax(taxableIncome: number) {
    let totalTax = 0;
    let remainingSalary = taxableIncome;

    // First N25000
    if (remainingSalary > 25000) {
      remainingSalary -= 25000;
      totalTax = 0.07 * 25000;
    } else {
      totalTax = 0.07 * remainingSalary;
      return totalTax;
    }

    // Next N25000
    if (remainingSalary > 25000) {
      remainingSalary -= 25000;
      totalTax += 0.11 * 25000;
    } else {
      totalTax += 0.11 * remainingSalary;
      return totalTax;
    }

    // Next N41667
    if (remainingSalary > 41667) {
      remainingSalary -= 41667;
      totalTax += 0.15 * 41667;
    } else {
      totalTax += 0.15 * remainingSalary;
      return totalTax;
    }

    // Next N41667
    if (remainingSalary > 41667) {
      remainingSalary -= 41667;
      totalTax += 0.19 * 41667;
    } else {
      totalTax += 0.19 * remainingSalary;
      return totalTax;
    }

    // Next N133333
    if (remainingSalary > 133333) {
      remainingSalary -= 133333;
      totalTax += 0.21 * 133333;
    } else {
      totalTax += 0.21 * remainingSalary;
      return totalTax;
    }

    // Over N266666
    totalTax += 0.24 * remainingSalary;
    return totalTax;
  }

  processEmployeeTax(employee: IPayrollEmployee) {
    const relief = this.calculateTaxRelief(employee);
    const tax = this.calculateTax(relief.taxableSalary.value);

    return {
      tax: Money.new(tax, employee.currency),
      relief,
    };
  }
}
