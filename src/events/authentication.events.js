"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AUTHENTICATION_EVENTS = void 0;
const services_constant_1 = require("../constants/services.constant");
exports.AUTHENTICATION_EVENTS = {
    findOrCreateEmployeeUser: `${services_constant_1.SERVICES.AUTHENTICATION_SERVICE}.user.findOrCreateEmployeeUser`,
    switchCurrentUserOrganization: `${services_constant_1.SERVICES.AUTHENTICATION_SERVICE}.user.switchCurrentUserOrganization`,
    createUserOrganization: `${services_constant_1.SERVICES.AUTHENTICATION_SERVICE}.user.createUserOrganization`,
    sendEmailValidationToken: `${services_constant_1.SERVICES.AUTHENTICATION_SERVICE}.user.sendEmailValidationToken`,
    fetchCountries: `${services_constant_1.SERVICES.AUTHENTICATION_SERVICE}.fetchCountries`,
    getUserOrganization: `${services_constant_1.SERVICES.AUTHENTICATION_SERVICE}.getUserOrganization`,
};
//# sourceMappingURL=authentication.events.js.map