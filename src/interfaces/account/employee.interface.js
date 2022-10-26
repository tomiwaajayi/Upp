"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportedCurrencyEnum = exports.SalaryTypeEnum = exports.GenderEnum = exports.EmployeeCompletionStatus = exports.SalaryAddonStatusEnum = exports.BonusSalaryModeEnum = exports.SalaryAddonTypeEnum = exports.SalaryAddonFrequencyEnum = exports.CheckEmployeeDTO = void 0;
const class_validator_1 = require("class-validator");
class CheckEmployeeDTO {
}
__decorate([
    (0, class_validator_1.IsOptional)()
], CheckEmployeeDTO.prototype, "emailOrPhonenumber", void 0);
__decorate([
    (0, class_validator_1.IsOptional)()
], CheckEmployeeDTO.prototype, "employeeId", void 0);
exports.CheckEmployeeDTO = CheckEmployeeDTO;
var SalaryAddonFrequencyEnum;
(function (SalaryAddonFrequencyEnum) {
    SalaryAddonFrequencyEnum["Once"] = "once";
    SalaryAddonFrequencyEnum["Recurring"] = "recurring";
})(SalaryAddonFrequencyEnum = exports.SalaryAddonFrequencyEnum || (exports.SalaryAddonFrequencyEnum = {}));
var SalaryAddonTypeEnum;
(function (SalaryAddonTypeEnum) {
    SalaryAddonTypeEnum["Bonus"] = "bonus";
    SalaryAddonTypeEnum["Deduction"] = "deduction";
    SalaryAddonTypeEnum["Protate"] = "prorate";
})(SalaryAddonTypeEnum = exports.SalaryAddonTypeEnum || (exports.SalaryAddonTypeEnum = {}));
var BonusSalaryModeEnum;
(function (BonusSalaryModeEnum) {
    BonusSalaryModeEnum["Quick"] = "quick";
    BonusSalaryModeEnum["UnTaxed"] = "untaxed";
    BonusSalaryModeEnum["LeaveAllowance"] = "leave-allowance";
    BonusSalaryModeEnum["ExtraMonth"] = "extra-month";
})(BonusSalaryModeEnum = exports.BonusSalaryModeEnum || (exports.BonusSalaryModeEnum = {}));
var SalaryAddonStatusEnum;
(function (SalaryAddonStatusEnum) {
    SalaryAddonStatusEnum["Pending"] = "pending";
    SalaryAddonStatusEnum["Processing"] = "processing";
    SalaryAddonStatusEnum["Completed"] = "completed";
})(SalaryAddonStatusEnum = exports.SalaryAddonStatusEnum || (exports.SalaryAddonStatusEnum = {}));
var EmployeeCompletionStatus;
(function (EmployeeCompletionStatus) {
    EmployeeCompletionStatus["Complete"] = "All info complete";
    EmployeeCompletionStatus["PendingPayment"] = "Payment info pending";
    EmployeeCompletionStatus["PendingStatutory"] = "Statutory info pending";
})(EmployeeCompletionStatus = exports.EmployeeCompletionStatus || (exports.EmployeeCompletionStatus = {}));
var GenderEnum;
(function (GenderEnum) {
    GenderEnum["Male"] = "male";
    GenderEnum["Female"] = "female";
    GenderEnum["Other"] = "other";
})(GenderEnum = exports.GenderEnum || (exports.GenderEnum = {}));
var SalaryTypeEnum;
(function (SalaryTypeEnum) {
    SalaryTypeEnum["Net"] = "net";
    SalaryTypeEnum["Gross"] = "gross";
})(SalaryTypeEnum = exports.SalaryTypeEnum || (exports.SalaryTypeEnum = {}));
var SupportedCurrencyEnum;
(function (SupportedCurrencyEnum) {
    SupportedCurrencyEnum["USD"] = "usd";
    SupportedCurrencyEnum["GBP"] = "gbp";
    SupportedCurrencyEnum["EUR"] = "eur";
    SupportedCurrencyEnum["USDT"] = "usdt";
    SupportedCurrencyEnum["NGN"] = "ngn";
    SupportedCurrencyEnum["GHS"] = "ghs";
    SupportedCurrencyEnum["KES"] = "kes";
    SupportedCurrencyEnum["RWF"] = "rwf";
})(SupportedCurrencyEnum = exports.SupportedCurrencyEnum || (exports.SupportedCurrencyEnum = {}));
//# sourceMappingURL=employee.interface.js.map