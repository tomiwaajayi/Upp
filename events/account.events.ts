import {SERVICES} from '../constants/services.constant';

export const ACCOUNT_EVENTS = {
  createEmployees: `${SERVICES.ACCOUNT_SERVICE}.employee.create`,
  validateEmployees: `${SERVICES.ACCOUNT_SERVICE}.employee.validate`,
  checkEmployee: `${SERVICES.ACCOUNT_SERVICE}.employee.check`,
  updateEmployee: `${SERVICES.ACCOUNT_SERVICE}.employee.update`,
  sendInvite: `${SERVICES.ACCOUNT_SERVICE}.employee.sendInvite`,
  getEmployees: `${SERVICES.ACCOUNT_SERVICE}.employee.get`,
  updateEmployeeWithIntent: `${SERVICES.ACCOUNT_SERVICE}.employee.updateWithIntent`,
  createEmployeeSalaryAddon: `${SERVICES.ACCOUNT_SERVICE}.employee.createEmployeeSalaryAddon`,
};
