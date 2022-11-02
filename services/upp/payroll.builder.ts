import {groupBy, isEmpty} from 'lodash';
import {
  BonusSalaryModeEnum,
  Group,
} from '../../interfaces/account/employee.interface';
import {
  Organization,
  OrganizationSettings,
} from '../../interfaces/account/organization.interface';
import {Country, TRecord} from '../../interfaces/base.interface';
import {Money} from '../../interfaces/payment/money.interface';
import {
  EmployeeRemittancesItem,
  IPayroll,
  IPayrollEmployee,
  IPayrollMeta,
  PayrollSalaryAddon,
} from '../../interfaces/payroll/payroll.interface';
import {BuilderPayload, IPayrollBuilder} from './builder.interface';
import {CountryTax} from './tax/country.tax';

/**
 * To improve the speed, this builder implements the Builder Design Pattern.
 * There are 4 ordinal build parts that must be called in order from the get method,
 * which returns the processed payroll object
 */
export class PayrollBuilder implements IPayrollBuilder {
  /** The payroll object in creation */
  private payroll: IPayroll;
  /** List of employees in payroll */
  private employees: IPayrollEmployee[];
  private organization: Organization;
  private organizationSettings: OrganizationSettings;
  private organizationCountry: Country;
  /**
   * This holds query data or data from backend that needs to be input in each processes
   */
  private meta: IPayrollMeta;

  constructor(data: BuilderPayload) {
    this.employees = data.employees;
    this.organization = data.organization;
    this.organizationSettings = data.organizationSettings || {};
    this.organizationCountry = <Country>this.organization.country;
    this.meta = data.meta; // TODO: changed to _.pick(data.payrollInit, ['proRateMonth', 'payItem']);
    this.meta.payItem = data.payrollInit.payItem;
    this.payroll = {
      ...data.payrollInit,
    };
  }

  /**
   * This part consists of prorate  only
   * @returns
   */
  protected buildPartA(employee: IPayrollEmployee) {
    this.processProRates(employee);
    return this;
  }

  /**
   * This part consists of prorate, bonuses/allowances of all types including BIK, and deductions of all types
   * @ bonus, untaxed bonus, extra month, leave allowance, bik, deductions and cdb loans
   * @returns
   */
  protected buildPartB(employee: IPayrollEmployee) {
    this.processBonuses(employee);
    return this;
  }

  /**
   * This part consists of Health access calculation and all statutory remittance calculations EXCEPT Tax
   * @ health access, nhif, nsitf, pension, itf, nhf
   * @returns
   */
  protected buildPartC(employee: IPayrollEmployee) {
    this.processCountryStatutory(employee);
    this.processPension(employee);
    return this;
  }

  /**
   * This part holds tax calculation and payroll build final steps
   * Commitments should go here
   * @ tax, org deductions, pay frequency, commitments, employee addons, worksheet reset
   * @returns
   */
  protected buildPartD(employee: IPayrollEmployee) {
    this.processTax(employee);
    return this;
  }

  /**
   * You must call this method to return the payroll object
   * @returns payroll
   */
  get() {
    Promise.all(
      this.employees.map((employee: IPayrollEmployee) => {
        employee.zeroMoney = {value: 0, currency: employee.currency};
        // employee processes goes here
        this.buildPartA(employee)
          .buildPartB(employee)
          .buildPartC(employee)
          .buildPartD(employee);
      })
    );

    return {
      ...this.payroll,
      organization: this.organization,
      employees: this.employees,
    };
  }

  /**
   * Process single employee prorate
   * note that there can only be a single prorate entry for an employee
   */
  processProRates(employee: IPayrollEmployee): void {
    employee.totalProRate = {value: 5000, currency: 'NGN'};
  }

  /**
   * In a single loop processes single employee bonus, untaxed bonus, extra month, leave allowance, and deductions
   */
  processBonuses(employee: IPayrollEmployee): void {
    if (isEmpty(employee.bonuses)) return;

    const groupedBonuses = groupBy(employee.bonuses, 'mode');
    if (!isEmpty(groupedBonuses[BonusSalaryModeEnum.Quick])) {
      employee.bonuses = groupedBonuses[BonusSalaryModeEnum.Quick];

      employee.totalBonus = Money.addMany(
        employee.bonuses as PayrollSalaryAddon[],
        'amount'
      );
    }

    if (!isEmpty(groupedBonuses[BonusSalaryModeEnum.UnTaxed])) {
      employee.untaxedBonuses = groupedBonuses[BonusSalaryModeEnum.UnTaxed];

      employee.totalUntaxedBonus = Money.addMany(
        employee.untaxedBonuses as PayrollSalaryAddon[],
        'amount'
      );
    }

    if (!isEmpty(groupedBonuses[BonusSalaryModeEnum.ExtraMonth])) {
      employee.extraMonthBonus =
        groupedBonuses[BonusSalaryModeEnum.ExtraMonth][0];

      employee.totalExtraMonthBonus = employee.extraMonthBonus.amount;
    }

    if (!isEmpty(groupedBonuses[BonusSalaryModeEnum.LeaveAllowance])) {
      employee.leaveAllowance =
        groupedBonuses[BonusSalaryModeEnum.LeaveAllowance][0];

      employee.totalLeaveAllowance = employee.leaveAllowance.amount;
    }
  }

  /**
   * Nigeria - NHF, ITF, NSITF
   * Kenya - NHIF
   * Rwanda -
   * * Should implement a factory design pattern check Pay v2 tax or pension setup and link
   * https://sbcode.net/typescript/factory/
   */
  processCountryStatutory(employee: IPayrollEmployee): void {
    // code goes here
  }

  /**
   * Process Tax for all countries
   * Should implement a factory design pattern check Pay v2 tax or pension setup and link
   * https://sbcode.net/typescript/factory/
   */
  processTax(employee: IPayrollEmployee): void {
    try {
      const countryTaxService = CountryTax.get(
        this.organization,
        this.organizationCountry,
        this.organizationSettings,
        this.meta
      );

      const entity = (<Group>employee.group || this.organizationSettings)
        .remittances;

      const enabledTaxes = entity?.tax?.enabled;

      const enabledWHT = (<Group>employee.group)?.remittances?.tax
        ?.enabledWithHoldingTax;

      if (!enabledTaxes || countryTaxService.exempt(employee)) {
        return;
      }

      const {relief, tax} = enabledWHT
        ? countryTaxService.processEmployeeWHT(employee)
        : countryTaxService.processEmployeeTax(employee);

      const employeeTaxObj = {
        remittanceEnabled: entity.tax?.remit,
        amount: tax,
        relief: relief.relief,
        taxableSalary: relief.taxableSalary,
      };
      let remittances = <TRecord<EmployeeRemittancesItem>>(
        (employee.remittances || {})
      );

      remittances = {...remittances, tax: employeeTaxObj};
      employee.remittances = remittances;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Process Pension for all countries
   * Should implement a factory design pattern check Pay v2 tax or pension setup and link
   * https://sbcode.net/typescript/factory/
   */
  processPension(employee: IPayrollEmployee): void {
    // code goes here
  }
}
