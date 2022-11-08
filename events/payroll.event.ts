import {SERVICES} from '../constants/services.constant';
export const WORKSHEET = 'worksheet';
export const PAYROLL = 'payroll';
export const ORGANIZATION = 'organization';
export const WALLET = 'wallet';

export const PAYROLL_EVENTS = {
  fetchWorksheet: `${SERVICES.PAYROLL_SERVICE}.${WORKSHEET}.fetchWorksheet`,
  updateWorksheet: `${SERVICES.PAYROLL_SERVICE}.${WORKSHEET}.updateWorksheet`,
  deleteWorksheet: `${SERVICES.PAYROLL_SERVICE}.${WORKSHEET}.deleteWorksheet`,
  removeEmployeeFromWorksheet: `${SERVICES.PAYROLL_SERVICE}.${WORKSHEET}.removeEmployeeFromWorksheet`,
  getOrganizationSetting: `${SERVICES.PAYROLL_SERVICE}.${ORGANIZATION}.getSettings`,
  updateOrganizationSetting: `${SERVICES.PAYROLL_SERVICE}.${ORGANIZATION}.updateSettings`,
  fetchOrgWalletAccount: `${SERVICES.PAYROLL_SERVICE}.${WALLET}.fetchOrgWalletAccount`,
  createOrgWalletAccount: `${SERVICES.PAYROLL_SERVICE}.${WALLET}.createOrgWalletAccount`,
  createPayroll: `${SERVICES.PAYROLL_SERVICE}.${PAYROLL}.createPayroll`,
  editPayroll: `${SERVICES.PAYROLL_SERVICE}.${PAYROLL}.editPayroll`,
  getPayrolls: `${SERVICES.PAYROLL_SERVICE}.${PAYROLL}.getPayrolls`,
  getEmployeePayrolls: `${SERVICES.PAYROLL_SERVICE}.${PAYROLL}.getEmployeePayrolls`,
};
