import {SERVICES} from '../constants/services.constant';

export const ACCOUNT_EVENTS = {
  createEmployees: `${SERVICES.ACCOUNT_SERVICE}.employee.create`,
  validateEmployees: `${SERVICES.ACCOUNT_SERVICE}.employee.validate`,
  checkEmployee: `${SERVICES.ACCOUNT_SERVICE}.employee.check`,
  updateEmployee: `${SERVICES.ACCOUNT_SERVICE}.employee.update`,
  sendInvite: `${SERVICES.ACCOUNT_SERVICE}.employee.sendInvite`,
  getEmployees: `${SERVICES.ACCOUNT_SERVICE}.employee.get`,
  getEmployee: `${SERVICES.ACCOUNT_SERVICE}.employee.getOne`,
  updateEmployeeWithIntent: `${SERVICES.ACCOUNT_SERVICE}.employee.updateWithIntent`,
  createEmployeeSalaryAddon: `${SERVICES.ACCOUNT_SERVICE}.employee.createEmployeeSalaryAddon`,
  updateEmployeeSalaryAddon: `${SERVICES.ACCOUNT_SERVICE}.employee.updateEmployeeSalaryAddon`,
  deleteEmployeeSalaryAddon: `${SERVICES.ACCOUNT_SERVICE}.employee.deleteEmployeeSalaryAddon`,
  createGroup: `${SERVICES.ACCOUNT_SERVICE}.group.create`,
  getGroup: `${SERVICES.ACCOUNT_SERVICE}.group.getOne`,
  getGroups: `${SERVICES.ACCOUNT_SERVICE}.group.getAll`,
  updateGroup: `${SERVICES.ACCOUNT_SERVICE}.group.update`,
  deleteGroup: `${SERVICES.ACCOUNT_SERVICE}.group.delete`,
  getGroupEmployees: `${SERVICES.ACCOUNT_SERVICE}.employeeGroup.get`,
  addEmployeesToGroup: `${SERVICES.ACCOUNT_SERVICE}.employeeGroup.add`,
  removeEmployeeFromGroup: `${SERVICES.ACCOUNT_SERVICE}.employeeGroup.remove`,
  terminateEmployee: `${SERVICES.ACCOUNT_SERVICE}.employee.terminateEmployee`,
};
