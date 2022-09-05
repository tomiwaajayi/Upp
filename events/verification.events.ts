import {SERVICES} from '../constants/services.constant';

export const VERIFICATION_EVENTS = {
  sendOtp: `${SERVICES.VERIFICATION_SERVICE}.otp.sendOtp`,
  verifyOtp: `${SERVICES.VERIFICATION_SERVICE}.otp.verifyOtp`,
};
