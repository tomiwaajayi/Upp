import {cloneDeep, groupBy, isEmpty, keyBy} from 'lodash';
import {
  BonusSalaryModeEnum,
  IGroup,
} from '../../interfaces/account/employee.interface';
import {Organization} from '../../interfaces/account/organization.interface';
import {IMoney, Money} from '../../interfaces/payment/money.interface';
import {
  CountryISO,
  CountryStatutories,
  IPayroll,
  IPayrollEmployee,
  IPayrollMeta,
  OrganizationSettings,
  PayrollSalaryAddon,
} from '../../interfaces/payroll/payroll.interface';
import {UtilService} from '../util.service';
import {BuilderPayload, IPayrollBuilder} from './builder.interface';
import {PensionService} from './pension/pesion.service';

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
      totalBase: {},
      totalStatutories: {},
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
    this.processNetSalary(employee);
    return this;
  }

  /**
   * This part calculates totals for payroll
   * @returns
   */
  protected buildPartE(employee: IPayrollEmployee) {
    this.processPayrollTotals(employee);
    return this;
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

        // get total base
        this.payroll.totalBase[currency] = Money.add(
          employee.base,
          this.payroll.totalBase[currency] || {value: 0, currency}
        );

        // employee processes goes here
        this.buildPartA(employee)
          .buildPartB(employee)
          .buildPartC(employee)
          .buildPartD(employee)
          .buildPartE(employee);
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

    const currency = employee.base.currency.toUpperCase();
    const groupedBonuses = groupBy(employee.bonuses, bonus => {
      if (typeof bonus.amount === 'number') {
        bonus.amount = {value: bonus.amount, currency};
      }

      return bonus.mode;
    });
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

      this.updatePayrollStatutoryTotal(
        CountryISO.Nigeria,
        CountryStatutories.ITF,
        baseIncomeWithITF
      );
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

        this.updatePayrollStatutoryTotal(
          CountryISO.Nigeria,
          CountryStatutories.NHF,
          nhfContribution
        );
      }
    }
    // --> end NHF

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

        this.updatePayrollStatutoryTotal(
          CountryISO.Nigeria,
          CountryStatutories.NSITF,
          nsitfContribution
        );
      }
    }
    // --> end NSITF

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

        this.updatePayrollStatutoryTotal(
          CountryISO.Kenya,
          CountryStatutories.NHIF,
          nhifContribution
        );
      }
    }
    // --> end NHIF
  }

  protected updatePayrollStatutoryTotal(
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
  processNetSalary(employee: IPayrollEmployee): void {
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
  processPayrollTotals(employee: IPayrollEmployee): void {
    const remittancesKeyedByName = employee.remittancesKeyedByName || {};
    const currency = employee.currency.toUpperCase();
    const zeroMoney = {value: 0, currency};

    this.payroll.totalCharge = this.payroll.totalCharge || {};

    /************
     * Bonus    *
     ************/
    if (this.payroll.payItem.bonus) {
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
            (this.payroll[name] as Record<string, IMoney>)[currency] ||
              zeroMoney,
            amount as IMoney
          );
        }
      });
      this.payroll.totalCharge[currency] = Money.addMany(
        UtilService.cleanArray([
          this.payroll.totalCharge[currency],
          employee.sumOfBonus,
        ])
      );
    }

    const pension = remittancesKeyedByName['pension'];
    if (
      this.payroll.payItem.pension &&
      pension &&
      pension.remittanceEnabled &&
      pension.amount.value < (employee.netSalary?.value || 0)
    ) {
      this.payroll.totalCharge[currency] = Money.addMany(
        UtilService.cleanArray([
          pension.amount,
          this.payroll.totalCharge[currency],
        ])
      );
    }

    if (this.payroll.payItem.base) {
      this.payroll.totalCharge[currency] = Money.addMany(
        UtilService.cleanArray([
          Money.sub(
            employee.netSalary as IMoney,
            employee.sumOfBonus as IMoney
          ),
          this.payroll.totalCharge[currency],
        ])
      );
    }
  }
}
