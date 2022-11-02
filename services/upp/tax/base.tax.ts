import {Employee, Group} from '../../../interfaces/account/employee.interface';
import {
  Organization,
  OrganizationSettings,
} from '../../../interfaces/account/organization.interface';
import {Country} from '../../../interfaces/base.interface';
import {IMoney, Money} from '../../../interfaces/payment/money.interface';
import {
  IPayrollEmployee,
  IPayrollMeta,
} from '../../../interfaces/payroll/payroll.interface';

export type CountryTaxPayload = {
  organization: Organization;
  country: Country;
  settings: OrganizationSettings;
  meta: IPayrollMeta;
};

export interface ITax {
  calculateWithHoldingTax(taxableIncome: IMoney, whtaxRate: number): unknown;
  calculateWithHoldingTaxRelief(employee: IPayrollEmployee): unknown;
  processEmployeeWHT(employee: IPayrollEmployee): unknown;
  processEmployeeTax?(employee: Employee): ProcessEmployeeTax;
  exempt?(employee?: Employee): boolean;
}

export class BaseClass implements ITax {
  protected organization;
  protected country;
  protected settings;
  protected meta;

  constructor({organization, country, settings, meta}: CountryTaxPayload) {
    this.organization = organization;
    this.country = country;
    this.settings = settings;
    this.meta = meta;
  }
  calculateWithHoldingTax(taxableIncome: IMoney, whtaxRate: number) {
    // WHT
    return Money.mul(taxableIncome, whtaxRate);
  }

  calculateWithHoldingTaxRelief(employee: IPayrollEmployee) {
    const base = (employee.basePayable as IMoney) || employee.salary;

    const grossSalary = Money.add(base, employee.totalBonus as IMoney);

    // WHT is applicable to contractors & interns
    // Do not get pensions, nhf & pther benefits
    // So no relief! None, Nada, Zilch!

    return {
      relief: {value: 0, currency: employee.currency},
      taxableSalary: grossSalary,
    };
  }

  processEmployeeWHT(employee: IPayrollEmployee) {
    employee.whtaxApplied = true;
    const groupTaxSettings = (employee.group as Group).remittances?.tax;
    employee.whtaxRate = groupTaxSettings?.WHTaxRate || 0.05;
    const relief = this.calculateWithHoldingTaxRelief(employee);
    const tax = this.calculateWithHoldingTax(
      relief.taxableSalary,
      <number>groupTaxSettings?.WHTaxRate
    );

    return {relief, tax};
  }

  // always return false except the function is present in the child class
  exempt(employee: IPayrollEmployee): boolean {
    return !employee;
  }

  processEmployeeTax(employee: IPayrollEmployee): ProcessEmployeeTax {
    const {zeroMoney} = employee;
    return {
      relief: {relief: <IMoney>zeroMoney, taxableSalary: <IMoney>zeroMoney},
      tax: {value: 0, currency: employee.currency},
    };
  }
}

export interface ProcessEmployeeTax {
  relief: Record<string, IMoney>;
  tax: IMoney;
}
