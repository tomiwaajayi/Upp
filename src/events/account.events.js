"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACCOUNT_EVENTS = void 0;
const services_constant_1 = require("../constants/services.constant");
exports.ACCOUNT_EVENTS = {
    createEmployees: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.employee.create`,
    validateEmployees: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.employee.validate`,
    checkEmployee: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.employee.check`,
    updateEmployee: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.employee.update`,
    sendInvite: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.employee.sendInvite`,
};
//# sourceMappingURL=account.events.js.map