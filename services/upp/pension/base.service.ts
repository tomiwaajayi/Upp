import {IMoney, Money} from '../../../interfaces/payment/money.interface';
import {CountryPensionService, ProcessPensionPayload} from './pension.types';

export class BaseCountryPensionService implements CountryPensionService {
  constructor(
    protected employeePercent: number,
    protected employerPercent: number
  ) {}

  process(context: ProcessPensionPayload): void {
    const {group, organizationSettings, employee} = context;
    const pension =
      (group ? group : organizationSettings).remittances?.pension || {};
    const pensionType = pension.type as 'deduct' | 'quote';
    const remittances = employee.remittances || [];
    if (pensionType === 'deduct') {
      employee.remittances = [
        ...remittances,
        {
          ...this.processEmployeePensionDeduction(context),
          remittanceEnabled: this.remitEnabled(context),
        },
      ];
    }

    if (pensionType === 'quote') {
      employee.remittances = [
        ...remittances,
        {
          ...this.processEmployeePensionQuote(context),
          remittanceEnabled: this.remitEnabled(context),
        },
      ];
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

  processEmployeePensionDeduction(payload: ProcessPensionPayload) {
    const {employee, group, organizationSettings} = payload;
    const {base: salary} = employee;
    const breakdown =
      group?.salaryBreakdown || organizationSettings.salaryBreakdown || {};
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
    const {employee, group, organizationSettings} = payload;
    const {base: salary} = employee;
    const breakdown =
      group?.salaryBreakdown || organizationSettings.salaryBreakdown || {};
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
