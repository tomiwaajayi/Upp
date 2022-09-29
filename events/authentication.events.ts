import {SERVICES} from '../constants/services.constant';

export const AUTHENTICATION_EVENTS = {
  findOrCreateEmployeeUser: `${SERVICES.AUTHENTICATION_SERVICE}.user.findOrCreateEmployeeUser`,
  switchCurrentUserOrganization: `${SERVICES.AUTHENTICATION_SERVICE}.user.switchCurrentUserOrganization`,
};
