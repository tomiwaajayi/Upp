"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTEGRATION_EVENTS = exports.CDB = exports.PEOPLE = void 0;
const services_constant_1 = require("../constants/services.constant");
exports.PEOPLE = 'people';
exports.CDB = 'cdb';
exports.INTEGRATION_EVENTS = {
    deleteEmployeeOnPeople: `${services_constant_1.SERVICES.INTEGRATION_SERVICE}.${exports.PEOPLE}.deleteEmployee`,
    terminateEmployeeOnCDB: `${services_constant_1.SERVICES.INTEGRATION_SERVICE}.${exports.CDB}.terminateEmployee`,
};
//# sourceMappingURL=integration.event.js.map