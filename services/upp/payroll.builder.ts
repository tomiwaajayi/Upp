import {groupBy, isEmpty} from 'lodash';
import {
  BonusSalaryModeEnum,
  IGroup,
} from '../../interfaces/account/employee.interface';
import {Organization} from '../../interfaces/account/organization.interface';
import {IMoney, Money} from '../../interfaces/payment/money.interface';
import * as moment from 'moment';
import {
  CountryStatutories,
  IPayroll,
  IPayrollEmployee,
  IPayrollMeta,
  OrganizationSettings,
  IProrate,
  PayrollSalaryAddon,
  ProrateStatusEnum,
  ProrateTypeEnum,
} from '../../interfaces/payroll/payroll.interface';
import {BuilderPayload, IPayrollBuilder} from './builder.interface';
import {PensionService} from './pension/pesion.service';
// import {calculateWeekDays} from './util.service';

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
  /**
   * This holds query data or data from backend that needs to be input in each processes
   */
  private meta: IPayrollMeta;

  constructor(data: BuilderPayload) {
    this.employees = data.employees;
    this.organization = data.organization;
    this.organizationSettings = data.organizationSettings;
    this.meta = data.meta;
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
    const {proRateMonth, proRates} = this.meta;
    if (isEmpty(proRates)) return;

    const monthStart = moment().month(proRateMonth).startOf('month');
    const monthEnd = moment().month(proRateMonth).endOf('month');

    let paidDays = 0;
    const payrollDays = monthEnd.add(1, 'hour').diff(monthStart, 'days') + 1;
    proRates.forEach((prorate: IProrate) => {
      const {startDate, endDate} = prorate;

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
      prorate.type = recurrType
        ? ProrateTypeEnum.Recurring
        : ProrateTypeEnum.Once;
      prorate.status = ProrateStatusEnum.Pending;
      paidDays += end.add(1, 'hour').diff(start, 'days') + 1;
    });
    let base = employee.base;

    if (this.organization?.removeVariableAmount)
      base = Money.substractMany([
        base as IMoney,
        employee.variableAmount as IMoney,
      ]);

    const proRatedSalary = Money.toMoney((base.value / payrollDays) * paidDays);
    const proRateDeduction = Money.substractMany([
      base as IMoney,
      proRatedSalary,
    ]);

    employee.proRates = proRates;
    employee.proRateDeduction = paidDays > 0 ? proRateDeduction : undefined;

    employee.basePayable = paidDays > 0 ? proRatedSalary : base;

    if (this.organization?.removeVariableAmount) {
      employee.basePayable = Money.addMany([
        employee.basePayable as IMoney,
        employee.variableAmount as IMoney,
      ]);
    }
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
    const group = employee.group as IGroup;
    const {base} = employee;

    // ITF
    const itfRecord = !isEmpty(group)
      ? group.remittances && group.remittances[CountryStatutories.ITF]
      : this.organizationSettings.remittances[CountryStatutories.ITF];

    if (itfRecord && itfRecord.enabled && itfRecord.remit) {
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

    if (!isEmpty(nhfRecord) && nhfRecord.enabled) {
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

    // NHIF
    const nhifRecord = !isEmpty(group)
      ? group.remittances && group.remittances[CountryStatutories.NHIF]
      : this.organizationSettings.remittances[CountryStatutories.NHIF];

    if (nhifRecord && nhifRecord.enabled) {
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

    // NSITF
    const nsitfRecord = !isEmpty(group)
      ? group.remittances && group.remittances[CountryStatutories.NSITF]
      : this.organizationSettings.remittances[CountryStatutories.NSITF];

    if (nsitfRecord && nsitfRecord.enabled) {
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
  }

  calculateNHF(
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

  calculateNHIF(grossSalary: IMoney): IMoney {
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
    // code goes here
  }

  /**
   * Process Pension for all countries
   * Should implement a factory design pattern check Pay v2 tax or pension setup and link
   * https://sbcode.net/typescript/factory/
   */
  processPension(employee: IPayrollEmployee): void {
    const {group} = employee;
    const remittances = group
      ? group.remittances
      : this.organizationSettings.remittances;
    if (remittances && remittances.pension && remittances.pension.enabled) {
      PensionService.process(this.organization.country.name, {
        group,
        organizationSettings: this.organizationSettings,
        employee,
      });
    }
  }
}
