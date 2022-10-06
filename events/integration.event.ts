import {SERVICES} from '../constants/services.constant';
export const PEOPLE = 'people';
export const CDB = 'cdb';

export const INTEGRATION_EVENTS = {
  deleteEmployeeOnPeople: `${SERVICES.INTEGRATION_SERVICE}.${PEOPLE}.deleteEmployee`,
  terminateEmployeeOnCDB: `${SERVICES.INTEGRATION_SERVICE}.${CDB}.terminateEmployee`,
};
