import {IGroup} from '../../interfaces/account/employee.interface';
import {Organization} from '../../interfaces/account/organization.interface';
import {NestedIRemittance} from '../../interfaces/base.interface';
import {IMoney, Money} from '../../interfaces/payment/money.interface';
import {
  IPayrollEmployee,
  IPayrollMeta,
  OrganizationSettings,
} from '../../interfaces/payroll/payroll.interface';
import {CountryTaxService, ProcessTaxPayload} from './tax.types';

export class BaseClass implements CountryTaxService {
  protected organization: Organization;
  protected settings: OrganizationSettings;
  protected meta: IPayrollMeta;

  constructor(context: ProcessTaxPayload) {
    const {organization, settings, meta} = context;
    this.organization = organization;
    this.settings = settings;
    this.meta = meta;
  }

  process(employee: IPayrollEmployee): void {
    const {group} = employee;

    const entity = <NestedIRemittance>(
      (<IGroup>group || this.settings).remittances
    );

    const enabledTaxes = entity?.tax?.enabled;

    const enabledWHT = (<IGroup>group)?.remittances?.tax?.enabledWithHoldingTax;

    if (!enabledTaxes || this.exempt(employee)) {
      return;
    }

    const {relief, tax} = enabledWHT
      ? this.processEmployeeWHT(employee)
      : this.processEmployeeTax(employee);

    const remittances = employee.remittances || [];

    employee.remittances = [
      ...remittances,
      {
        ...relief,
        name: 'tax',
        amount: tax,
        remittanceEnabled: <boolean>entity.tax?.remit,
      },
    ];
  }
  calculateWithHoldingTax(taxableIncome: IMoney, whtaxRate: number) {
    // WHT
    return Money.mul(taxableIncome, whtaxRate);
  }

  calculateWithHoldingTaxRelief(employee: IPayrollEmployee) {
    const base = (employee.basePayable as IMoney) || employee.base;

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
    const groupTaxSettings = (employee.group as IGroup).remittances?.tax;
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

  processEmployeeTax(employee: IPayrollEmployee) {
    const {zeroMoney} = employee;
    return {
      relief: {relief: <IMoney>zeroMoney, taxableSalary: <IMoney>zeroMoney},
      tax: {value: 0, currency: employee.currency},
    };
  }

  protected getBreakdown(employee: IPayrollEmployee) {
    const {group} = employee;

    return (
      employee.salaryBreakdown ||
      group?.salaryBreakdown ||
      this.settings.salaryBreakdown ||
      {}
    );
  }
}
