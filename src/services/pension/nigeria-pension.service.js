"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NigeriaPensionService = void 0;
const pension_constant_1 = require("../../constants/pension.constant");
const base_service_1 = require("./base.service");
class NigeriaPensionService extends base_service_1.BaseCountryPensionService {
    constructor() {
        super(pension_constant_1.PENSION.NIGERIA.EMPLOYEE_PERCENT, pension_constant_1.PENSION.NIGERIA.EMPLOYER_PERCENT);
    }
    remitEnabled(payload) {
        const enabled = super.remitEnabled(payload);
        const { employee } = payload;
        return (enabled &&
            !!employee.pensionId &&
            !!employee.pensionFundAdmin &&
            /^[a-zA-Z0-9]{15}$/.test(employee.pensionId));
    }
}
exports.NigeriaPensionService = NigeriaPensionService;
NigeriaPensionService.country = 'NG';
//# sourceMappingURL=nigeria-pension.service.js.map