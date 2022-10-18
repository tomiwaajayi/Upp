import {SERVICES} from '../constants/services.constant';
export const WORKSHEET = 'worksheet';
export const PAYROLL = 'payroll';

export const PAYROLL_EVENTS = {
  fetchWorksheet: `${SERVICES.PAYROLL_SERVICE}.${WORKSHEET}.fetchWorksheet`,
  updateWorksheet: `${SERVICES.PAYROLL_SERVICE}.${WORKSHEET}.updateWorksheet`,
  deleteWorksheet: `${SERVICES.PAYROLL_SERVICE}.${WORKSHEET}.deleteWorksheet`,
  removeEmployeeFromWorksheet: `${SERVICES.PAYROLL_SERVICE}.${WORKSHEET}.removeEmployeeFromWorksheet`,
};
