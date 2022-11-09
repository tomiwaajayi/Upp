"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PayrollBuilder = void 0;
const lodash_1 = require("lodash");
const employee_interface_1 = require("../../interfaces/account/employee.interface");
const money_interface_1 = require("../../interfaces/payment/money.interface");
const payroll_interface_1 = require("../../interfaces/payroll/payroll.interface");
const util_service_1 = require("../util.service");
const pesion_service_1 = require("./pension/pesion.service");
const tax_service_1 = require("./tax/tax.service");
/**
 * To improve the speed, this builder implements the Builder Design Pattern.
 * There are 4 ordinal build parts that must be called in order from the get method,
 * which returns the processed payroll object
 */
class PayrollBuilder {
    constructor(data) {
        this.processedPayrollTotals = false;
        this.data = (0, lodash_1.cloneDeep)(data);
        this.employees = data.employees;
        this.organization = data.organization;
        this.organizationSettings = data.organizationSettings;
        this.organizationCountry = this.organization.country;
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
        this.processNetSalary(employee);
        return this;
    }
    /**
     * This part calculates totals for payroll
     * @returns
     */
    buildPartE(employee) {
        this.processPayrollTotals(employee);
        return this;
    }
    getResponse() {
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
        Promise.all(this.employees.map((employee) => {
            const currency = employee.currency.toUpperCase();
            // init employee base
            employee.base = employee.base || {
                value: employee.salary || 0,
                currency,
            };
            employee.zeroMoney = { value: 0, currency };
            // employee processes goes here
            this.buildPartA(employee)
                .buildPartB(employee)
                .buildPartC(employee)
                .buildPartD(employee)
                .buildPartE(employee);
        }));
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
    processProRates(employee) {
        employee.totalProRate = { value: 5000, currency: 'NGN' };
    }
    /**
     * In a single loop processes single employee bonus, untaxed bonus, extra month, leave allowance, and deductions
     */
    processBonuses(employee) {
        if ((0, lodash_1.isEmpty)(employee.bonuses))
            return;
        const currency = employee.base.currency.toUpperCase();
        const groupedBonuses = (0, lodash_1.groupBy)(employee.bonuses, bonus => {
            if (typeof bonus.amount === 'number') {
                bonus.amount = { value: bonus.amount, currency };
            }
            return bonus.mode;
        });
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
        const group = employee.group;
        const { base } = employee;
        // ITF
        const itfRecord = !(0, lodash_1.isEmpty)(group)
            ? group.remittances && group.remittances[payroll_interface_1.CountryStatutories.ITF]
            : this.organizationSettings.remittances[payroll_interface_1.CountryStatutories.ITF];
        if (itfRecord && itfRecord.enabled && itfRecord.remit) {
            let grossSalary = base;
            if (this.organizationSettings.isTotalItfEnumeration) {
                const { totalBonus, totalLeaveAllowance } = employee;
                grossSalary = money_interface_1.Money.addMany([base, totalBonus, totalLeaveAllowance]);
            }
            const baseIncomeWithITF = money_interface_1.Money.mul(grossSalary, {
                value: 0.01,
                currency: base.currency,
            });
            const remittances = (employee === null || employee === void 0 ? void 0 : employee.remittances) || [];
            remittances.push({
                name: payroll_interface_1.CountryStatutories.ITF,
                remittanceEnabled: itfRecord.remit,
                amount: baseIncomeWithITF,
            });
            employee.remittances = remittances;
        }
        // ->> end ITF
        // NHF
        const nhfRecord = !(0, lodash_1.isEmpty)(group)
            ? group.remittances && group.remittances[payroll_interface_1.CountryStatutories.NHF]
            : this.organizationSettings.remittances[payroll_interface_1.CountryStatutories.NHF];
        if (!(0, lodash_1.isEmpty)(nhfRecord) && nhfRecord.enabled) {
            let salaryBreakdown = group.salaryBreakdown;
            if (group.useOrgSalaryBreakdown) {
                salaryBreakdown = this.organizationSettings.salaryBreakdown;
            }
            const nhfContribution = this.calculateNHF(salaryBreakdown, base, {
                value: 2.5,
                currency: base.currency,
            }, this.organizationSettings.enableConsolidatedGross);
            if (nhfRecord.remit) {
                const remittances = (employee === null || employee === void 0 ? void 0 : employee.remittances) || [];
                remittances.push({
                    name: payroll_interface_1.CountryStatutories.NHF,
                    remittanceEnabled: nhfRecord.remit,
                    amount: nhfContribution,
                });
                employee.remittances = remittances;
            }
        }
        // --> end NHF
        // NSITF
        const nsitfRecord = !(0, lodash_1.isEmpty)(group)
            ? group.remittances && group.remittances[payroll_interface_1.CountryStatutories.NSITF]
            : this.organizationSettings.remittances[payroll_interface_1.CountryStatutories.NSITF];
        if (nsitfRecord && nsitfRecord.enabled) {
            let grossSalary = base;
            if (this.organizationSettings.isTotalNsitfEnumeration) {
                const { totalBonus, totalLeaveAllowance } = employee;
                grossSalary = money_interface_1.Money.addMany([base, totalBonus, totalLeaveAllowance]);
            }
            const nsitfContribution = money_interface_1.Money.mul(grossSalary, {
                value: 0.01,
                currency: grossSalary.currency,
            });
            if (nsitfRecord.remit) {
                const remittances = (employee === null || employee === void 0 ? void 0 : employee.remittances) || [];
                remittances.push({
                    name: payroll_interface_1.CountryStatutories.NSITF,
                    remittanceEnabled: nsitfRecord.remit,
                    amount: nsitfContribution,
                });
                employee.remittances = remittances;
            }
        }
        // --> end NSITF
        // NHIF
        const nhifRecord = !(0, lodash_1.isEmpty)(group)
            ? group.remittances && group.remittances[payroll_interface_1.CountryStatutories.NHIF]
            : this.organizationSettings.remittances[payroll_interface_1.CountryStatutories.NHIF];
        if (nhifRecord && nhifRecord.enabled) {
            const defaultAmount = {
                value: 0,
                currency: base.currency,
            };
            const grossSalary = money_interface_1.Money.addMany([
                base,
                employee.totalBonus || defaultAmount,
                employee.totalLeaveAllowance || defaultAmount,
            ]);
            const nhifContribution = this.calculateNHIF(grossSalary);
            if (nhifRecord.remit) {
                const remittances = (employee === null || employee === void 0 ? void 0 : employee.remittances) || [];
                remittances.push({
                    name: payroll_interface_1.CountryStatutories.NHIF,
                    remittanceEnabled: nhifRecord.remit,
                    amount: nhifContribution,
                });
                employee.remittances = remittances;
            }
        }
        // --> end NHIF
    }
    updatePayrollStatutoryTotal(country, statutory, currentIncome) {
        if (this.payroll.totalStatutories[country]) {
            const cloned = (0, lodash_1.cloneDeep)(this.payroll.totalStatutories[country]);
            if (this.payroll.totalStatutories[country][statutory]) {
                const total = money_interface_1.Money.add(currentIncome, this.payroll.totalStatutories[country][statutory]);
                this.payroll.totalStatutories[country] = {
                    ...cloned,
                    [statutory]: total,
                };
            }
            else {
                this.payroll.totalStatutories[country] = {
                    ...cloned,
                    [statutory]: currentIncome,
                };
            }
        }
        else {
            this.payroll.totalStatutories[country] = {
                [statutory]: currentIncome,
            };
        }
    }
    calculateNHF(salaryBreakdown, grossMonthly, percentage, enableConsolidatedGross) {
        const basicPercent = salaryBreakdown['basic'] || 0;
        const housingPercent = salaryBreakdown['housing'] || 0;
        const transportPercent = salaryBreakdown['transport'] || 0;
        const basic = money_interface_1.Money.mul(grossMonthly, {
            value: basicPercent,
            currency: grossMonthly.currency,
        });
        if ((basicPercent === 0 && housingPercent === 0 && transportPercent === 0) ||
            enableConsolidatedGross) {
            return money_interface_1.Money.div(percentage, { value: 100, currency: percentage.currency });
        }
        return money_interface_1.Money.mul(basic, money_interface_1.Money.div(percentage, { value: 100, currency: percentage.currency }));
    }
    calculateNHIF(grossSalary) {
        let value = 1700;
        if (grossSalary.value <= 5999) {
            value = 150;
        }
        else if (grossSalary.value <= 7999) {
            value = 300;
        }
        else if (grossSalary.value <= 11999) {
            value = 400;
        }
        else if (grossSalary.value <= 14999) {
            value = 500;
        }
        else if (grossSalary.value <= 19999) {
            value = 600;
        }
        else if (grossSalary.value <= 24999) {
            value = 750;
        }
        else if (grossSalary.value <= 29999) {
            value = 850;
        }
        else if (grossSalary.value <= 34999) {
            value = 900;
        }
        else if (grossSalary.value <= 39999) {
            value = 950;
        }
        else if (grossSalary.value <= 44999) {
            value = 1000;
        }
        else if (grossSalary.value <= 49999) {
            value = 1100;
        }
        else if (grossSalary.value <= 59999) {
            value = 1200;
        }
        else if (grossSalary.value <= 69999) {
            value = 1300;
        }
        else if (grossSalary.value <= 79999) {
            value = 1400;
        }
        else if (grossSalary.value <= 89999) {
            value = 1500;
        }
        else if (grossSalary.value <= 99999) {
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
    processTax(employee) {
        var _a;
        try {
            const { group } = employee;
            const remittances = group
                ? group.remittances
                : this.organizationSettings.remittances;
            if ((_a = remittances.tax) === null || _a === void 0 ? void 0 : _a.enabled) {
                tax_service_1.TaxService.process(employee.country.toUpperCase(), {
                    organization: this.organization,
                    settings: this.organizationSettings,
                    meta: this.meta,
                }, employee);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    /**
     * Process Pension for all countries
     * Should implement a factory design pattern check Pay v2 tax or pension setup and link
     * https://sbcode.net/typescript/factory/
     */
    processPension(employee) {
        const { group } = employee;
        const remittances = group
            ? group.remittances
            : this.organizationSettings.remittances;
        if (remittances && remittances.pension && remittances.pension.enabled) {
            pesion_service_1.PensionService.process(employee.country.toUpperCase(), {
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
    processNetSalary(employee) {
        const remittancesKeyedByName = (0, lodash_1.keyBy)(employee.remittances || [], 'name');
        employee.remittancesKeyedByName = remittancesKeyedByName;
        employee.netSalary = (0, lodash_1.cloneDeep)(employee.base);
        employee.sumOfBonus = money_interface_1.Money.addMany(util_service_1.UtilService.cleanArray([
            { value: 0, currency: employee.base.currency },
            employee.totalBonus,
            employee.totalExtraMonthBonus,
            employee.totalUntaxedBonus,
            employee.totalLeaveAllowance,
        ]));
        employee.netSalary = money_interface_1.Money.addMany(util_service_1.UtilService.cleanArray([employee.netSalary, employee.sumOfBonus]));
        if (employee.totalDeductions) {
            employee.netSalary = money_interface_1.Money.sub(employee.netSalary, employee.totalDeductions);
        }
        Object.values(payroll_interface_1.CountryStatutories).forEach(countryStatutory => {
            const statutory = remittancesKeyedByName[countryStatutory];
            if (statutory && employee.netSalary) {
                employee.netSalary = money_interface_1.Money.sub(employee.netSalary, statutory.amount);
            }
        });
        const pension = remittancesKeyedByName['pension'];
        if (pension &&
            pension.remittanceEnabled &&
            pension.amount.value < employee.netSalary.value) {
            employee.netSalary = money_interface_1.Money.sub(employee.netSalary, pension.amount);
        }
    }
    /**
     * Process all totals on payroll
     * Should implement a factory design pattenr
     * https://sbcode.net/typescript/factory/
     */
    processPayrollTotals(employee) {
        var _a;
        const remittancesKeyedByName = employee.remittancesKeyedByName || {};
        const currency = employee.currency.toUpperCase();
        const zeroMoney = { value: 0, currency };
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
                const name = _name;
                this.payroll[name] = this.payroll[name] || {};
                this.payroll[name][currency] = money_interface_1.Money.add(this.payroll[name][currency] || zeroMoney, amount);
            }
        });
        if (this.payroll.payItem.bonus) {
            this.payroll.totalCharge[currency] = money_interface_1.Money.addMany(util_service_1.UtilService.cleanArray([
                this.payroll.totalCharge[currency],
                employee.sumOfBonus,
            ]));
        }
        /************
         * Base     *
         ************/
        this.payroll.totalBase[currency] = money_interface_1.Money.add(employee.base, this.payroll.totalBase[currency] || zeroMoney);
        if (this.payroll.payItem.base) {
            this.payroll.totalCharge[currency] = money_interface_1.Money.addMany(util_service_1.UtilService.cleanArray([
                money_interface_1.Money.sub(employee.netSalary || zeroMoney, employee.sumOfBonus || zeroMoney),
                this.payroll.totalCharge[currency],
            ]));
        }
        /****************
         * Statutory    *
         ****************/
        const addRemittance = (name, amount) => {
            this.payroll.remittances = this.payroll.remittances || {};
            this.payroll.remittances[currency] =
                this.payroll.remittances[currency] || {};
            this.payroll.remittances[currency][name] = this.payroll.remittances[currency][name] || {
                name,
                remittanceEnabled: true,
                amount: zeroMoney,
            };
            this.payroll.remittances[currency][name].amount = money_interface_1.Money.add(amount, this.payroll.remittances[currency][name].amount);
        };
        Object.values(payroll_interface_1.CountryStatutories).forEach(countryStatutory => {
            const statutory = remittancesKeyedByName[countryStatutory];
            if (statutory) {
                this.updatePayrollStatutoryTotal(currency, countryStatutory, statutory.amount);
                addRemittance(countryStatutory, statutory.amount);
                if (this.payroll.payItem[countryStatutory] &&
                    this.payroll.totalCharge) {
                    this.payroll.totalCharge[currency] = money_interface_1.Money.addMany(util_service_1.UtilService.cleanArray([
                        statutory.amount,
                        this.payroll.totalCharge[currency],
                    ]));
                }
            }
        });
        /***************
         * Pension     *
         ***************/
        const pension = remittancesKeyedByName['pension'];
        if (pension && pension.amount.value < (((_a = employee.netSalary) === null || _a === void 0 ? void 0 : _a.value) || 0)) {
            this.payroll.totalPension = this.payroll.totalPension || {};
            this.payroll.totalPension[currency] = money_interface_1.Money.add(pension.amount, this.payroll.totalPension[currency] || zeroMoney);
            if (pension.remittanceEnabled) {
                addRemittance(pension.name, pension.amount);
                if (this.payroll.payItem.pension) {
                    this.payroll.totalCharge[currency] = money_interface_1.Money.addMany(util_service_1.UtilService.cleanArray([
                        pension.amount,
                        this.payroll.totalCharge[currency],
                    ]));
                }
            }
        }
        this.processedPayrollTotals = true;
    }
}
exports.PayrollBuilder = PayrollBuilder;
//# sourceMappingURL=payroll.builder.js.map