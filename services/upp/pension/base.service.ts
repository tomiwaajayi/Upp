import {IRemitance} from '../../../interfaces/account/employee.interface';
import {IMoney, Money} from '../../../interfaces/payment/money.interface';
import {CountryPensionService, ProcessPensionPayload} from './pension.types';

export class BaseCountryPensionService implements CountryPensionService {
  constructor(
    protected employeePercent: number,
    protected employerPercent: number
  ) {}

  process(context: ProcessPensionPayload): void {
    const {group, organizationSettings, employee, payroll} = context;
    const pension =
      (group ? group : organizationSettings).remittances?.pension || {};
    const pensionType = (pension as IRemitance).type as 'deduct' | 'quote';
    const remittances = employee.remittances || [];
    let remittance:
      | ((
          | ReturnType<typeof this.processEmployeePensionDeduction>
          | ReturnType<typeof this.processEmployeePensionQuote>
        ) & {
          remittanceEnabled: boolean;
        })
      | null = null;

    if (pensionType === 'deduct') {
      remittance = {
        ...this.processEmployeePensionDeduction(context),
        remittanceEnabled: this.remitEnabled(context),
      };

      employee.remittances = [...remittances, remittance];
    }

    if (pensionType === 'quote') {
      remittance = {
        ...this.processEmployeePensionQuote(context),
        remittanceEnabled: this.remitEnabled(context),
      };
    }

    if (remittance) {
      payroll.totalPension = payroll.totalPension || {};
      payroll.totalPension[remittance.amount.currency] = Money.add(
        remittance.amount,
        payroll.totalPension[remittance.amount.currency] || {
          value: 0,
          currency: remittance.amount.currency,
        }
      );

      if (remittance?.remittanceEnabled) {
        employee.remitanceEnabled = remittance.remittanceEnabled;
        employee.remittances = [...remittances, remittance];
        payroll.remittances = payroll.remittances || {};
        payroll.remittances[employee.currency] =
          payroll.remittances[employee.currency] || {};

        payroll.remittances[employee.currency][remittance.name] = payroll
          .remittances[employee.currency][remittance.name] || {
          ...remittance,
          amount: {value: 0, currency: employee.base.currency},
        };

        payroll.remittances[employee.currency][remittance.name].amount =
          Money.add(
            payroll.remittances[employee.currency][remittance.name].amount,
            remittance.amount
          );
      }
    }
  }

  calculatePension(
    breakdown: Record<string, number>,
    salary: IMoney,
    percent: number
  ) {
    const basicPercent = breakdown.basic || 0;
    const housingPercent = breakdown.housing || 0;
    const transportPercent = breakdown.transport || 0;
    // use gross if no breakdown
    if (basicPercent === 0 && housingPercent === 0 && transportPercent === 0) {
      return {value: salary.value * (percent / 100), currency: salary.currency};
    }

    const basic = salary.value * (basicPercent / 100);
    const housing = salary.value * (housingPercent / 100);
    const transport = salary.value * (transportPercent / 100);
    const itemsTotal = basic + housing + transport;

    return {value: itemsTotal * (percent / 100), currency: salary.currency};
  }

  protected getBreakdown(payload: ProcessPensionPayload) {
    const {group, organizationSettings} = payload;

    return group?.salaryBreakdown || organizationSettings.salaryBreakdown || {};
  }

  processEmployeePensionDeduction(payload: ProcessPensionPayload) {
    const {employee} = payload;
    const {base: salary} = employee;
    const breakdown = this.getBreakdown(payload);
    const employerContribution = this.calculatePension(
      breakdown,
      salary,
      this.employerPercent
    );
    let employeeContribution = this.calculatePension(
      breakdown,
      salary,
      this.employeePercent
    );
    if (employee.pensionContributionEnabled) {
      employeeContribution = Money.add(employeeContribution, {
        value: employee.pensionContribution || 0,
        currency: employeeContribution.currency,
      });
    }

    return {
      amount: Money.add(employeeContribution, employerContribution),
      name: 'pension',
      employeeContribution,
      employerContribution,
    };
  }

  processEmployeePensionQuote(payload: ProcessPensionPayload) {
    const {employee} = payload;
    const {base: salary} = employee;
    const breakdown = this.getBreakdown(payload);
    let employeeContribution = {value: 0, currency: salary.currency};
    const employerContribution = this.calculatePension(
      breakdown,
      salary,
      this.employerPercent * 2 // Quote is 20% of employee base salary
    );
    if (employee.pensionContributionEnabled) {
      employeeContribution = Money.add(employeeContribution, {
        value: employee.pensionContribution || 0,
        currency: employeeContribution.currency,
      });
    }

    return {
      amount: Money.add(employeeContribution, employerContribution),
      name: 'pension',
      employeeContribution,
      employerContribution,
    };
  }

  remitEnabled(payload: ProcessPensionPayload) {
    const {group, organizationSettings} = payload;

    return !!(group ? group : organizationSettings).remittances?.pension?.remit;
  }
}
