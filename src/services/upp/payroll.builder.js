"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollBuilder = void 0;
const lodash_1 = require("lodash");
const employee_interface_1 = require("../../interfaces/account/employee.interface");
const money_interface_1 = require("../../interfaces/payment/money.interface");
/**
 * To improve the speed, this builder implements the Builder Design Pattern.
 * There are 4 ordinal build parts that must be called in order from the get method,
 * which returns the processed payroll object
 */
class PayrollBuilder {
    constructor(data) {
        this.employees = data.employees;
        this.organization = data.organization;
        this.meta = data.meta;
        this.payroll = {
            ...data.payrollInit,
        };
    }
    /**
     * This part consists of prorate  only
     * @returns
     */
    buildPartA(employee) {
        this.processProRates(employee);
        return this;
    }
    /**
     * This part consists of prorate, bonuses/allowances of all types including BIK, and deductions of all types
     * @ bonus, untaxed bonus, extra month, leave allowance, bik, deductions and cdb loans
     * @returns
     */
    buildPartB(employee) {
        this.processBonuses(employee);
        return this;
    }
    /**
     * This part consists of Health access calculation and all statutory remittance calculations EXCEPT Tax
     * @ health access, nhif, nsitf, pension, itf, nhf
     * @returns
     */
    buildPartC(employee) {
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
    buildPartD(employee) {
        this.processTax(employee);
        return this;
    }
    /**
     * You must call this method to return the payroll object
     * @returns payroll
     */
    get() {
        Promise.all(this.employees.map((employee) => {
            // employee processes goes here
            this.buildPartA(employee)
                .buildPartB(employee)
                .buildPartC(employee)
                .buildPartD(employee);
        }));
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
    processProRates(employee) {
        employee.totalProRate = { value: 5000, currency: 'NGN' };
    }
    /**
     * In a single loop processes single employee bonus, untaxed bonus, extra month, leave allowance, and deductions
     */
    processBonuses(employee) {
        if ((0, lodash_1.isEmpty)(employee.bonuses))
            return;
        const groupedBonuses = (0, lodash_1.groupBy)(employee.bonuses, 'mode');
        if (!(0, lodash_1.isEmpty)(groupedBonuses[employee_interface_1.BonusSalaryModeEnum.Quick])) {
            employee.bonuses = groupedBonuses[employee_interface_1.BonusSalaryModeEnum.Quick];
            employee.totalBonus = money_interface_1.Money.addMany(employee.bonuses, 'amount');
        }
        if (!(0, lodash_1.isEmpty)(groupedBonuses[employee_interface_1.BonusSalaryModeEnum.UnTaxed])) {
            employee.untaxedBonuses = groupedBonuses[employee_interface_1.BonusSalaryModeEnum.UnTaxed];
            employee.totalUntaxedBonus = money_interface_1.Money.addMany(employee.untaxedBonuses, 'amount');
        }
        if (!(0, lodash_1.isEmpty)(groupedBonuses[employee_interface_1.BonusSalaryModeEnum.ExtraMonth])) {
            employee.extraMonthBonus =
                groupedBonuses[employee_interface_1.BonusSalaryModeEnum.ExtraMonth][0];
            employee.totalExtraMonthBonus = employee.extraMonthBonus.amount;
        }
        if (!(0, lodash_1.isEmpty)(groupedBonuses[employee_interface_1.BonusSalaryModeEnum.LeaveAllowance])) {
            employee.leaveAllowance =
                groupedBonuses[employee_interface_1.BonusSalaryModeEnum.LeaveAllowance][0];
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
    processCountryStatutory(employee) {
        // code goes here
    }
    /**
     * Process Tax for all countries
     * Should implement a factory design pattern check Pay v2 tax or pension setup and link
     * https://sbcode.net/typescript/factory/
     */
    processTax(employee) {
        // code goes here
    }
    /**
     * Process Pension for all countries
     * Should implement a factory design pattern check Pay v2 tax or pension setup and link
     * https://sbcode.net/typescript/factory/
     */
    processPension(employee) {
        // code goes here
    }
}
exports.PayrollBuilder = PayrollBuilder;
//# sourceMappingURL=payroll.builder.js.map