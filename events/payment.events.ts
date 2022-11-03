import {SERVICES} from '../constants/services.constant';

export const PAYMENT_EVENTS = {
  getAllBanks: `${SERVICES.PAYMENT_SERVICE}.getAllBanks`,
  createNubanAccount: `${SERVICES.PAYMENT_SERVICE}.createNubanAccount`,
  fetchPaymentProviders: `${SERVICES.PAYMENT_SERVICE}.fetchPaymentProviders`,
};
