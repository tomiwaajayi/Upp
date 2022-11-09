"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryISO = exports.ProrateStatusEnum = exports.ProrateTypeEnum = exports.CountryStatutories = exports.PayItemStatus = void 0;
var PayItemStatus;
(function (PayItemStatus) {
    PayItemStatus["Unpaid"] = "unpaid";
    PayItemStatus["Paid"] = "paid";
    PayItemStatus["Processing"] = "processing";
    PayItemStatus["Pending"] = "pending";
})(PayItemStatus = exports.PayItemStatus || (exports.PayItemStatus = {}));
var CountryStatutories;
(function (CountryStatutories) {
    CountryStatutories["ITF"] = "itf";
    CountryStatutories["NHF"] = "nhf";
    CountryStatutories["NHIF"] = "nhif";
    CountryStatutories["NSITF"] = "nsitf";
})(CountryStatutories = exports.CountryStatutories || (exports.CountryStatutories = {}));
var ProrateTypeEnum;
(function (ProrateTypeEnum) {
    ProrateTypeEnum["Once"] = "once";
    ProrateTypeEnum["Recurring"] = "recurring";
})(ProrateTypeEnum = exports.ProrateTypeEnum || (exports.ProrateTypeEnum = {}));
var ProrateStatusEnum;
(function (ProrateStatusEnum) {
    ProrateStatusEnum["Pending"] = "pending";
    ProrateStatusEnum["Processing"] = "processing";
    ProrateStatusEnum["Canceled"] = "cancelled";
    ProrateStatusEnum["Completed"] = "completed";
})(ProrateStatusEnum = exports.ProrateStatusEnum || (exports.ProrateStatusEnum = {}));
var CountryISO;
(function (CountryISO) {
    CountryISO["Nigeria"] = "ng";
    CountryISO["Kenya"] = "ke";
})(CountryISO = exports.CountryISO || (exports.CountryISO = {}));
//# sourceMappingURL=payroll.interface.js.map