"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VERIFICATION_EVENNTS = void 0;
const services_constant_1 = require("../constants/services.constant");
exports.VERIFICATION_EVENNTS = {
    sendOtp: `${services_constant_1.SERVICES.VERIFICATION_SERVICE}.otp.sendOtp`,
    verifyOtp: `${services_constant_1.SERVICES.VERIFICATION_SERVICE}.otp.verifyOtp`,
};
//# sourceMappingURL=verification.events.js.map