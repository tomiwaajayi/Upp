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
    getEmployees: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.employee.get`,
    getEmployee: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.employee.getOne`,
    updateEmployeeWithIntent: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.employee.updateWithIntent`,
    createEmployeeSalaryAddon: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.employee.createEmployeeSalaryAddon`,
    updateEmployeeSalaryAddon: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.employee.updateEmployeeSalaryAddon`,
    deleteEmployeeSalaryAddon: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.employee.deleteEmployeeSalaryAddon`,
    createGroup: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.group.create`,
    getGroup: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.group.getOne`,
    getGroups: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.group.getAll`,
    updateGroup: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.group.update`,
    deleteGroup: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.group.delete`,
    getGroupEmployees: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.employeeGroup.get`,
    addEmployeesToGroup: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.employeeGroup.add`,
    removeEmployeeFromGroup: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.employeeGroup.remove`,
    terminateEmployee: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.employee.terminateEmployee`,
    addOrganization: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.organization.add`,
    getOrganization: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.organization.get`,
    fetchActiveEmployeesData: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.employee.fetchActiveEmployeesData`,
    fetchEmployeesForWorksheet: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.employee.fetchEmployeesForWorksheet`,
    restoreEmployee: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.employee.restoreEmployee`,
    getPayrollEmployees: `${services_constant_1.SERVICES.ACCOUNT_SERVICE}.employee.getForPayroll`,
};
//# sourceMappingURL=account.events.js.map