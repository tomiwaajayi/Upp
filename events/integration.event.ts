import {SERVICES} from '../constants/services.constant';
export const PEOPLE = 'people';
export const CDB = 'cdb';
export const PRODUCT = 'product';

export const INTEGRATION_EVENTS = {
  deleteEmployeeOnPeople: `${SERVICES.INTEGRATION_SERVICE}.${PEOPLE}.deleteEmployee`,
  terminateEmployeeOnCDB: `${SERVICES.INTEGRATION_SERVICE}.${CDB}.terminateEmployee`,
  restoreEmployeeOnPeople: `${SERVICES.INTEGRATION_SERVICE}.${PEOPLE}.restoreEmployee`,
  productProxyRelayer: `${SERVICES.INTEGRATION_SERVICE}.${PRODUCT}.proxyRelayer`,
  getUserCdbAuthToken: `${SERVICES.INTEGRATION_SERVICE}.${CDB}.getUserAuthToken`,
};
