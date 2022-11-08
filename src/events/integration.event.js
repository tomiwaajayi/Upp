"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INTEGRATION_EVENTS = exports.PRODUCT = exports.CDB = exports.PEOPLE = void 0;
const services_constant_1 = require("../constants/services.constant");
exports.PEOPLE = 'people';
exports.CDB = 'cdb';
exports.PRODUCT = 'product';
exports.INTEGRATION_EVENTS = {
    deleteEmployeeOnPeople: `${services_constant_1.SERVICES.INTEGRATION_SERVICE}.${exports.PEOPLE}.deleteEmployee`,
    terminateEmployeeOnCDB: `${services_constant_1.SERVICES.INTEGRATION_SERVICE}.${exports.CDB}.terminateEmployee`,
    restoreEmployeeOnPeople: `${services_constant_1.SERVICES.INTEGRATION_SERVICE}.${exports.PEOPLE}.restoreEmployee`,
    productProxyRelayer: `${services_constant_1.SERVICES.INTEGRATION_SERVICE}.${exports.PRODUCT}.proxyRelayer`,
};
//# sourceMappingURL=integration.event.js.map