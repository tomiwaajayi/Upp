"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PAYMENT_EVENTS = void 0;
const services_constant_1 = require("../constants/services.constant");
exports.PAYMENT_EVENTS = {
    getAllBanks: `${services_constant_1.SERVICES.PAYMENT_SERVICE}.getAllBanks`,
    createNubanAccount: `${services_constant_1.SERVICES.PAYMENT_SERVICE}.createNubanAccount`,
    fetchPaymentProviders: `${services_constant_1.SERVICES.PAYMENT_SERVICE}.fetchPaymentProviders`,
};
//# sourceMappingURL=payment.events.js.map