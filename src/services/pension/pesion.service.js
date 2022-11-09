"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PensionService = void 0;
const ghana_pension_service_1 = require("./ghana-pension.service");
const kenya_pension_service_1 = require("./kenya-pension.service");
const nigeria_pension_service_1 = require("./nigeria-pension.service");
const rwanda_pension_service_1 = require("./rwanda-pension.service");
class PensionService {
    static registerServices() {
        if (this.registered) {
            return;
        }
        PensionService.countryPensionServices[nigeria_pension_service_1.NigeriaPensionService.country] =
            new nigeria_pension_service_1.NigeriaPensionService();
        PensionService.countryPensionServices[ghana_pension_service_1.GahanaPensionService.country] =
            new ghana_pension_service_1.GahanaPensionService();
        PensionService.countryPensionServices[rwanda_pension_service_1.RwandaPensionService.country] =
            new rwanda_pension_service_1.RwandaPensionService();
        PensionService.countryPensionServices[kenya_pension_service_1.KenyaPensionService.country] =
            new kenya_pension_service_1.KenyaPensionService();
        this.registered = true;
    }
    static get(name) {
        this.registerServices();
        const service = PensionService.countryPensionServices[name];
        if (!service) {
            throw new Error(`pension service for '${name}' does not exist`);
        }
        return service;
    }
    static process(country, context) {
        return PensionService.get(country).process(context);
    }
}
exports.PensionService = PensionService;
PensionService.countryPensionServices = {};
PensionService.registered = false;
//# sourceMappingURL=pesion.service.js.map