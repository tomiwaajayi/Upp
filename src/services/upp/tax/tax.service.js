"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxService = void 0;
const kenya_tax_1 = require("@sh/services/upp/tax/kenya.tax");
const ghana_tax_1 = require("@sh/services/upp/tax/ghana.tax");
const nigeria_tax_1 = require("@upp/tax/nigeria.tax");
const rwanda_tax_1 = require("@upp/tax/rwanda.tax");
class TaxService {
    static registerServices(context) {
        if (this.registered) {
            return;
        }
        TaxService.countryTaxServices[nigeria_tax_1.NigeriaTax.country] = new nigeria_tax_1.NigeriaTax(context);
        TaxService.countryTaxServices[ghana_tax_1.GhanaTax.country] = new ghana_tax_1.GhanaTax(context);
        TaxService.countryTaxServices[kenya_tax_1.KenyaTax.country] = new kenya_tax_1.KenyaTax(context);
        TaxService.countryTaxServices[rwanda_tax_1.RwandaTax.country] = new rwanda_tax_1.RwandaTax(context);
        this.registered = true;
    }
    static get(name, context) {
        this.registerServices(context);
        const service = TaxService.countryTaxServices[name];
        if (!service) {
            throw new Error(`tax service for '${name}' does not exist`);
        }
        return service;
    }
    static process(country, context, employee) {
        return TaxService.get(country, context).process(employee);
    }
}
exports.TaxService = TaxService;
TaxService.countryTaxServices = {};
TaxService.registered = false;
//# sourceMappingURL=tax.service.js.map