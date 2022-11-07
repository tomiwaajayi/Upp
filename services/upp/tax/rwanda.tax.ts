import {TAX} from '@sh/constants/tax.constants';
import {IMoney, Money} from '@sh/interfaces/payment/money.interface';
import {IPayrollEmployee} from '@sh/interfaces/payroll/payroll.interface';
import {BaseClass} from '@upp/tax/base.tax';
import {ProcessTaxPayload} from '@upp/tax/tax.types';

export class RwandaTax extends BaseClass {
  static country = 'RW';

  protected taxSettings;
  constructor(context: ProcessTaxPayload) {
    super(context);
    this.taxSettings = TAX.RWANDA;
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

  calculateTaxRelief(employee: IPayrollEmployee) {
    const base = employee.basePayable || employee.base;

    const {totalBonus, totalLeaveAllowance, zeroMoney} = employee;
    const grossSalary = Money.addMany([
      base,
      totalBonus || zeroMoney,
      totalLeaveAllowance || zeroMoney,
    ]);

    return {
      relief: <IMoney>zeroMoney,
      taxableSalary: grossSalary,
    };
  }

  processEmployeeTax(employee: IPayrollEmployee) {
    const {employmentType, currency} = employee;
    const relief = this.calculateTaxRelief(employee);
    const tax = this.calculateTax(
      relief.taxableSalary.value,
      <string>employmentType
    );

    return {
      tax: Money.new(tax, currency),
      relief,
    };
  }

  calculateTax(taxableIncome: number, employmentType: string) {
    let totalTax = 0;

    switch (employmentType) {
      case 'casual':
        if (taxableIncome <= 30000) {
          totalTax = 0;
        } else if (taxableIncome > 30000) {
          totalTax = 0.15 * (taxableIncome - 30000);
        }
        break;
      case 'permanent':
      case 'full-time':
      default:
        if (taxableIncome <= 30000) {
          totalTax = 0;
        } else if (taxableIncome > 30000 && taxableIncome <= 100000) {
          totalTax = 0.2 * (taxableIncome - 30000);
        } else if (taxableIncome > 100000) {
          totalTax = 0.3 * (taxableIncome - 100000) + 0.2 * 70000;
        }
        break;
    }

    return totalTax;
  }
}
