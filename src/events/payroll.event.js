"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYROLL_EVENTS = exports.ORGANIZATION = exports.PAYROLL = exports.WORKSHEET = void 0;
const services_constant_1 = require("../constants/services.constant");
exports.WORKSHEET = 'worksheet';
exports.PAYROLL = 'payroll';
exports.ORGANIZATION = 'organization';
exports.PAYROLL_EVENTS = {
    fetchWorksheet: `${services_constant_1.SERVICES.PAYROLL_SERVICE}.${exports.WORKSHEET}.fetchWorksheet`,
    updateWorksheet: `${services_constant_1.SERVICES.PAYROLL_SERVICE}.${exports.WORKSHEET}.updateWorksheet`,
    deleteWorksheet: `${services_constant_1.SERVICES.PAYROLL_SERVICE}.${exports.WORKSHEET}.deleteWorksheet`,
    removeEmployeeFromWorksheet: `${services_constant_1.SERVICES.PAYROLL_SERVICE}.${exports.WORKSHEET}.removeEmployeeFromWorksheet`,
    getOrganizationSetting: `${services_constant_1.SERVICES.PAYROLL_SERVICE}.${exports.ORGANIZATION}.getSettings`,
    updateOrganizationSetting: `${services_constant_1.SERVICES.PAYROLL_SERVICE}.${exports.ORGANIZATION}.updateSettings`,
};
//# sourceMappingURL=payroll.event.js.map