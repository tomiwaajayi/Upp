import {cloneDeep, groupBy, isEmpty, keyBy} from 'lodash';
import {
  BonusSalaryModeEnum,
  IGroup,
  SalaryAddonTypeEnum,
} from '../interfaces/account/employee.interface';
import {Organization} from '../interfaces/account/organization.interface';
import {Country, NestedIRemittance} from '../interfaces/base.interface';
import {IMoney, Money} from '../interfaces/payment/money.interface';
import * as moment from 'moment';
import {
  CountryStatutories,
  IPayroll,
  IPayrollEmployee,
  IPayrollMeta,
  OrganizationSettings,
  PayItemStatus,
  PayrollSalaryAddon,
  ProrateStatusEnum,
  ProrateTypeEnum,
} from '../interfaces/payroll/payroll.interface';
import {UtilService} from './util.service';
import {BuilderPayload, IPayrollBuilder} from './builder.interface';
// import {calculateWeekDays} from './util.service';
import {PensionService} from './pension/pesion.service';
import {TaxService} from './tax/tax.service';

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
  private data: BuilderPayload;
  private processedPayrollTotals = false;

  constructor(data: BuilderPayload) {
    this.data = cloneDeep(data);
    this.employees = data.employees;
    this.organization = data.organization;
    this.organizationSettings = data.organizationSettings;
    this.organizationCountry = <Country>this.organization.country;
    this.meta = data.meta;
    this.meta.payItem = data.payrollInit.payItem;
    this.payroll = {
      ...data.payrollInit,
      totalBase: {},
      totalStatutories: {},
    };
  }

  /**
   * This part consists of prorate  only
   * @returns
   */
  private buildPartA(employee: IPayrollEmployee) {
    // this.processProRates(employee);
    return this;
  }

  /**
   * This part consists of prorate, bonuses/allowances of all types including BIK, and deductions of all types
   * @ bonus, untaxed bonus, extra month, leave allowance, bik, deductions and cdb loans
   * @returns
   */
  private buildPartB(employee: IPayrollEmployee) {
    this.processBonuses(employee);
    this.processDeductions(employee);
    return this;
  }

  /**
   * This part consists of Health access calculation and all statutory remittance calculations EXCEPT Tax
   * @ health access, nhif, nsitf, pension, itf, nhf
   * @returns
   */
  private buildPartC(employee: IPayrollEmployee) {
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
  private buildPartD(employee: IPayrollEmployee) {
    this.processTax(employee);
    this.processNetSalary(employee);
    return this;
  }

  /**
   * This part calculates totals for payroll
   * @returns
   */
  private buildPartE(employee: IPayrollEmployee) {
    this.processPayrollTotals(employee);
    return this;
  }

  private getResponse() {
    return {
      ...this.payroll,
      organization: this.organization,
      employees: this.employees,
    };
  }

  /**
   * You must call this method to return the payroll object
   * @returns payroll
   */
  get() {
    Promise.all(
      this.employees.map((employee: IPayrollEmployee) => {
        const currency = employee.currency.toUpperCase();
        // init employee base
        employee.base = employee.base || {
          value: employee.salary || 0,
          currency,
        };
        employee.zeroMoney = {value: 0, currency};

        // employee processes goes here
        this.buildPartA(employee)
          .buildPartB(employee)
          .buildPartC(employee)
          .buildPartD(employee)
          .buildPartE(employee);
      })
    );

    return this.getResponse();
  }

  getData() {
    return this.data;
  }

  getProcessedEmployees() {
    return this.employees;
  }

  getTotals() {
    if (!this.processedPayrollTotals) {
      this.employees.map(employee => {
        this.buildPartE(employee);
      });
    }

    return this.getResponse();
  }

  /**
   * Process single employee prorate
   * note that there can only be a single prorate entry for an employee
   */
  processProRates(employee: IPayrollEmployee): void {
    const proRate = employee.bonuses?.find(
      p => p.type === SalaryAddonTypeEnum.Protate
    );
    const {proRateMonth} = this.meta;
    if (isEmpty(proRate)) return;

    const monthStart = moment().month(proRateMonth).startOf('month');
    const monthEnd = moment().month(proRateMonth).endOf('month');

    let paidDays = 0;
    const payrollDays = monthEnd.add(1, 'hour').diff(monthStart, 'days') + 1;

    const {startDate, endDate} = proRate;

    let start = moment(startDate);
    let end = moment(endDate);
    let recurrType = false;

    if (start.isBefore(monthStart)) {
      recurrType = true;
      start = monthStart;
    }

    if (end.isBefore(monthEnd) && end.month() === monthEnd.month()) {
      recurrType = false;
    }
    if (end.isAfter(monthEnd)) {
      recurrType = true;
      end = monthEnd;
    }
    proRate.frequency = recurrType
      ? ProrateTypeEnum.Recurring
      : ProrateTypeEnum.Once;
    proRate.status = ProrateStatusEnum.Pending;
    paidDays += end.add(1, 'hour').diff(start, 'days') + 1;

    const base = employee.base;

    const proRatedSalary = Money.mul(Money.div(base, payrollDays), paidDays);
    const proRateDeduction = Money.sub(base as IMoney, proRatedSalary);

    employee.proRateDeduction =
      paidDays > 0 ? proRateDeduction : employee.zeroMoney;
  }
  /**
   * In a single loop processes single employee bonus, untaxed bonus, extra month, leave allowance, and deductions
   */
  private processBonuses(employee: IPayrollEmployee): void {
    if (isEmpty(employee.bonuses)) return;

    const currency = employee.base.currency.toUpperCase();
    const groupedBonuses = groupBy(employee.bonuses, bonus => {
      if (typeof bonus.amount === 'number') {
        bonus.amount = {value: bonus.amount, currency};
      }

      return bonus.mode;
    });

    // START UNTAXED BONUS
    // Do untaxed bonus first because it's a separate payItem entry
    if (
      !isEmpty(groupedBonuses[BonusSalaryModeEnum.UnTaxed]) &&
      this.meta.payItem.untaxedBonus !== PayItemStatus.Unpaid
    ) {
      employee.untaxedBonuses = groupedBonuses[BonusSalaryModeEnum.UnTaxed];

      employee.totalUntaxedBonus = Money.addMany(
        employee.untaxedBonuses as PayrollSalaryAddon[],
        'amount'
      );
    }
    // END UNTAXED BONUS

    // START BONUS
    if (this.meta.payItem.bonus === PayItemStatus.Unpaid) {
      employee.bonuses = [];
      return; // all below are still bonuses so it's safe to exit
    }

    if (!isEmpty(groupedBonuses[BonusSalaryModeEnum.Quick])) {
      employee.bonuses = groupedBonuses[BonusSalaryModeEnum.Quick];

      employee.totalBonus = Money.addMany(
        employee.bonuses as PayrollSalaryAddon[],
        'amount'
      );
    }
    // END BONUS

    // START EXTRA MONTH BONUS (13TH MONTH SALARY)
    if (!isEmpty(groupedBonuses[BonusSalaryModeEnum.ExtraMonth])) {
      employee.extraMonthBonus =
        groupedBonuses[BonusSalaryModeEnum.ExtraMonth][0];

      employee.totalExtraMonthBonus = employee.extraMonthBonus.amount;
    }
    // START EXTRA MONTH BONUS

    // START LEAVE ALLOWANCE
    if (!isEmpty(groupedBonuses[BonusSalaryModeEnum.LeaveAllowance])) {
      employee.leaveAllowance =
        groupedBonuses[BonusSalaryModeEnum.LeaveAllowance][0];

      employee.totalLeaveAllowance = employee.leaveAllowance.amount;
    }
    // END LEAVE ALLOWANCE
  }

  /**
   * In a single loop processes single employee bonus, untaxed bonus, extra month, leave allowance, and deductions
   */
  private processDeductions(employee: IPayrollEmployee): void {
    if (isEmpty(employee.deductions)) return;

    employee.totalDeductions = Money.addMany(
      employee.deductions as PayrollSalaryAddon[],
      'amount'
    );
  }

  /**
   * Nigeria - NHF, ITF, NSITF
   * Kenya - NHIF
   * Rwanda -
   * * Should implement a factory design pattern check Pay v2 tax or pension setup and link
   * https://sbcode.net/typescript/factory/
   */
  private processCountryStatutory(employee: IPayrollEmployee): void {
    const group = employee.group as IGroup;
    const {base} = employee;

    // ITF
    const itfRecord = !isEmpty(group)
      ? group.remittances && group.remittances[CountryStatutories.ITF]
      : this.organizationSettings.remittances[CountryStatutories.ITF];
    const isItf = this.meta.payItem.itf !== PayItemStatus.Unpaid;

    if (itfRecord && itfRecord.enabled && itfRecord.remit && isItf) {
      let grossSalary = base;

      if (this.organizationSettings.isTotalItfEnumeration) {
        const {totalBonus, totalLeaveAllowance} = employee;
        grossSalary = Money.addMany([base, totalBonus, totalLeaveAllowance]);
      }

      const baseIncomeWithITF = Money.mul(grossSalary, {
        value: 0.01,
        currency: base.currency,
      });

      const remittances = employee?.remittances || [];
      remittances.push({
        name: CountryStatutories.ITF,
        remittanceEnabled: itfRecord.remit,
        amount: baseIncomeWithITF,
      });

      employee.remittances = remittances;
    }
    // ->> end ITF

    // NHF
    const nhfRecord = !isEmpty(group)
      ? group.remittances && group.remittances[CountryStatutories.NHF]
      : this.organizationSettings.remittances[CountryStatutories.NHF];
    const isNhf = this.meta.payItem.nhf !== PayItemStatus.Unpaid;

    if (!isEmpty(nhfRecord) && nhfRecord.enabled && isNhf) {
      let salaryBreakdown: Record<string, number> | undefined =
        group.salaryBreakdown;

      if (group.useOrgSalaryBreakdown) {
        salaryBreakdown = this.organizationSettings.salaryBreakdown;
      }

      const nhfContribution = this.calculateNHF(
        salaryBreakdown as Record<string, number>,
        base,
        {
          value: 2.5,
          currency: base.currency,
        },
        this.organizationSettings.enableConsolidatedGross
      );

      if (nhfRecord.remit) {
        const remittances = employee?.remittances || [];

        remittances.push({
          name: CountryStatutories.NHF,
          remittanceEnabled: nhfRecord.remit,
          amount: nhfContribution,
        });

        employee.remittances = remittances;
      }
    }
    // --> end NHF

    // NSITF
    const nsitfRecord = !isEmpty(group)
      ? group.remittances && group.remittances[CountryStatutories.NSITF]
      : this.organizationSettings.remittances[CountryStatutories.NSITF];
    const isNsitf = this.meta.payItem.nsitf !== PayItemStatus.Unpaid;

    if (nsitfRecord && nsitfRecord.enabled && isNsitf) {
      let grossSalary = base;

      if (this.organizationSettings.isTotalNsitfEnumeration) {
        const {totalBonus, totalLeaveAllowance} = employee;
        grossSalary = Money.addMany([base, totalBonus, totalLeaveAllowance]);
      }

      const nsitfContribution = Money.mul(grossSalary, {
        value: 0.01,
        currency: grossSalary.currency,
      });

      if (nsitfRecord.remit) {
        const remittances = employee?.remittances || [];

        remittances.push({
          name: CountryStatutories.NSITF,
          remittanceEnabled: nsitfRecord.remit,
          amount: nsitfContribution,
        });

        employee.remittances = remittances;
      }
    }
    // --> end NSITF

    // NHIF
    const nhifRecord = !isEmpty(group)
      ? group.remittances && group.remittances[CountryStatutories.NHIF]
      : this.organizationSettings.remittances[CountryStatutories.NHIF];
    const isNhif = this.meta.payItem.nhif !== PayItemStatus.Unpaid;

    if (nhifRecord && nhifRecord.enabled && isNhif) {
      const defaultAmount: IMoney = {
        value: 0,
        currency: base.currency,
      };

      const grossSalary = Money.addMany([
        base,
        employee.totalBonus || defaultAmount,
        employee.totalLeaveAllowance || defaultAmount,
      ]);

      const nhifContribution = this.calculateNHIF(grossSalary);

      if (nhifRecord.remit) {
        const remittances = employee?.remittances || [];

        remittances.push({
          name: CountryStatutories.NHIF,
          remittanceEnabled: nhifRecord.remit,
          amount: nhifContribution,
        });

        employee.remittances = remittances;
      }
    }
    // --> end NHIF
  }

  private updatePayrollStatutoryTotal(
    country: string,
    statutory: CountryStatutories,
    currentIncome: IMoney
  ) {
    if (this.payroll.totalStatutories[country]) {
      const cloned = cloneDeep(this.payroll.totalStatutories[country]);
      if (this.payroll.totalStatutories[country][statutory]) {
        const total = Money.add(
          currentIncome,
          this.payroll.totalStatutories[country][statutory]
        );
        this.payroll.totalStatutories[country] = {
          ...cloned,
          [statutory]: total,
        };
      } else {
        this.payroll.totalStatutories[country] = {
          ...cloned,
          [statutory]: currentIncome,
        };
      }
    } else {
      this.payroll.totalStatutories[country] = {
        [statutory]: currentIncome,
      };
    }
  }

  private calculateNHF(
    salaryBreakdown: Record<string, number>,
    grossMonthly: IMoney,
    percentage: IMoney,
    enableConsolidatedGross?: boolean
  ): IMoney {
    const basicPercent = salaryBreakdown['basic'] || 0;
    const housingPercent = salaryBreakdown['housing'] || 0;
    const transportPercent = salaryBreakdown['transport'] || 0;

    const basic = Money.mul(grossMonthly, {
      value: basicPercent,
      currency: grossMonthly.currency,
    });

    if (
      (basicPercent === 0 && housingPercent === 0 && transportPercent === 0) ||
      enableConsolidatedGross
    ) {
      return Money.div(percentage, {value: 100, currency: percentage.currency});
    }

    return Money.mul(
      basic,
      Money.div(percentage, {value: 100, currency: percentage.currency})
    );
  }

  private calculateNHIF(grossSalary: IMoney): IMoney {
    let value = 1700;

    if (grossSalary.value <= 5999) {
      value = 150;
    } else if (grossSalary.value <= 7999) {
      value = 300;
    } else if (grossSalary.value <= 11999) {
      value = 400;
    } else if (grossSalary.value <= 14999) {
      value = 500;
    } else if (grossSalary.value <= 19999) {
      value = 600;
    } else if (grossSalary.value <= 24999) {
      value = 750;
    } else if (grossSalary.value <= 29999) {
      value = 850;
    } else if (grossSalary.value <= 34999) {
      value = 900;
    } else if (grossSalary.value <= 39999) {
      value = 950;
    } else if (grossSalary.value <= 44999) {
      value = 1000;
    } else if (grossSalary.value <= 49999) {
      value = 1100;
    } else if (grossSalary.value <= 59999) {
      value = 1200;
    } else if (grossSalary.value <= 69999) {
      value = 1300;
    } else if (grossSalary.value <= 79999) {
      value = 1400;
    } else if (grossSalary.value <= 89999) {
      value = 1500;
    } else if (grossSalary.value <= 99999) {
      value = 1600;
    }

    return {
      value,
      currency: grossSalary.currency,
    };
  }

  /**
   * Process Tax for all countries
   * Should implement a factory design pattern check Pay v2 tax or pension setup and link
   * https://sbcode.net/typescript/factory/
   */
  processTax(employee: IPayrollEmployee): void {
    const {group} = employee;
    const remittances = group
      ? group.remittances
      : this.organizationSettings.remittances;

    if (
      (<NestedIRemittance>remittances).tax?.enabled &&
      this.meta.payItem.tax !== PayItemStatus.Unpaid
    ) {
      TaxService.process(
        employee.country.toUpperCase(),
        {
          organization: this.organization,
          settings: this.organizationSettings,
          meta: this.meta,
        },
        employee
      );
    }
  }

  /**
   * Process Pension for all countries
   * Should implement a factory design pattern check Pay v2 tax or pension setup and link
   * https://sbcode.net/typescript/factory/
   */
  private processPension(employee: IPayrollEmployee): void {
    const {group} = employee;
    const remittances = group
      ? group.remittances
      : this.organizationSettings.remittances;
    const isPension = this.meta.payItem.pension !== PayItemStatus.Unpaid;
    if ((<NestedIRemittance>remittances).pension?.enabled && isPension) {
      PensionService.process(employee.country.toUpperCase(), {
        group,
        organizationSettings: this.organizationSettings,
        employee,
        payroll: this.payroll,
      });
    }
  }

  /**
   * Process net salary for all countries
   * Should implement a factory design pattenr
   * https://sbcode.net/typescript/factory/
   */
  private processNetSalary(employee: IPayrollEmployee): void {
    const remittancesKeyedByName = keyBy(employee.remittances || [], 'name');

    employee.remittancesKeyedByName = remittancesKeyedByName;
    employee.netSalary = cloneDeep(employee.base);

    employee.sumOfBonus = Money.addMany(
      UtilService.cleanArray([
        {value: 0, currency: employee.base.currency},
        employee.totalBonus,
        employee.totalExtraMonthBonus,
        employee.totalUntaxedBonus,
        employee.totalLeaveAllowance,
      ])
    );

    employee.netSalary = Money.addMany(
      UtilService.cleanArray([employee.netSalary, employee.sumOfBonus])
    );

    if (employee.totalDeductions) {
      employee.netSalary = Money.sub(
        employee.netSalary,
        employee.totalDeductions
      );
    }

    Object.values(CountryStatutories).forEach(countryStatutory => {
      const statutory = remittancesKeyedByName[countryStatutory];
      if (statutory && employee.netSalary) {
        employee.netSalary = Money.sub(employee.netSalary, statutory.amount);
      }
    });

    const pension = remittancesKeyedByName['pension'];
    if (
      pension &&
      pension.remittanceEnabled &&
      pension.amount.value < employee.netSalary.value
    ) {
      employee.netSalary = Money.sub(employee.netSalary, pension.amount);
    }
  }

  /**
   * Process all totals on payroll
   * Should implement a factory design pattenr
   * https://sbcode.net/typescript/factory/
   */
  private processPayrollTotals(employee: IPayrollEmployee): void {
    const remittancesKeyedByName = employee.remittancesKeyedByName || {};
    const currency = employee.currency.toUpperCase();
    const zeroMoney = {value: 0, currency};

    this.payroll.totalCharge = this.payroll.totalCharge || {};

    /************
     * Bonus    *
     ************/
    [
      ['totalBonus', employee.totalBonus],
      ['totalUntaxedBonus', employee.totalUntaxedBonus],
      ['totalLeaveAllowance', employee.totalLeaveAllowance],
      ['totalExtraMonthBonus', employee.totalExtraMonthBonus],
    ].forEach(([_name, amount]) => {
      if (amount) {
        const name = _name as 'totalBonus';
        this.payroll[name] = this.payroll[name] || {};
        (this.payroll[name] as Record<string, IMoney>)[currency] = Money.add(
          (this.payroll[name] as Record<string, IMoney>)[currency] || zeroMoney,
          amount as IMoney
        );
      }
    });
    if (this.payroll.payItem.bonus) {
      this.payroll.totalCharge[currency] = Money.addMany(
        UtilService.cleanArray([
          this.payroll.totalCharge[currency],
          employee.sumOfBonus,
        ])
      );
    }

    /************
     * Base     *
     ************/
    this.payroll.totalBase[currency] = Money.add(
      employee.base,
      this.payroll.totalBase[currency] || zeroMoney
    );
    if (this.payroll.payItem.base) {
      this.payroll.totalCharge[currency] = Money.addMany(
        UtilService.cleanArray([
          Money.sub(
            employee.netSalary || zeroMoney,
            employee.sumOfBonus || zeroMoney
          ),
          this.payroll.totalCharge[currency],
        ])
      );
    }

    /****************
     * Statutory    *
     ****************/
    const addRemittance = (name: string, amount: IMoney) => {
      this.payroll.remittances = this.payroll.remittances || {};
      this.payroll.remittances[currency] =
        this.payroll.remittances[currency] || {};
      this.payroll.remittances[currency][name] = this.payroll.remittances[
        currency
      ][name] || {
        name,
        remittanceEnabled: true,
        amount: zeroMoney,
      };
      this.payroll.remittances[currency][name].amount = Money.add(
        amount,
        this.payroll.remittances[currency][name].amount
      );
    };
    Object.values(CountryStatutories).forEach(countryStatutory => {
      const statutory = remittancesKeyedByName[countryStatutory];
      if (statutory) {
        this.updatePayrollStatutoryTotal(
          currency,
          countryStatutory,
          statutory.amount
        );
        addRemittance(countryStatutory, statutory.amount);

        if (
          this.payroll.payItem[countryStatutory] &&
          this.payroll.totalCharge
        ) {
          this.payroll.totalCharge[currency] = Money.addMany(
            UtilService.cleanArray([
              statutory.amount,
              this.payroll.totalCharge[currency],
            ])
          );
        }
      }
    });

    /***************
     * Pension     *
     ***************/
    const pension = remittancesKeyedByName['pension'];
    if (pension && pension.amount.value < (employee.netSalary?.value || 0)) {
      this.payroll.totalPension = this.payroll.totalPension || {};
      this.payroll.totalPension[currency] = Money.add(
        pension.amount,
        this.payroll.totalPension[currency] || zeroMoney
      );

      if (pension.remittanceEnabled) {
        addRemittance(pension.name, pension.amount);
        if (this.payroll.payItem.pension) {
          this.payroll.totalCharge[currency] = Money.addMany(
            UtilService.cleanArray([
              pension.amount,
              this.payroll.totalCharge[currency],
            ])
          );
        }
      }
    }

    this.processedPayrollTotals = true;
  }
}
