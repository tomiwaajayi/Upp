import {NigeriaPensionService} from './nigeria-pension.service';
import {CountryPensionService, ProcessPensionPayload} from './pension.types';

const registerServices = (() => {
  let registered = false;
  return () => {
    if (registered) {
      return;
    }

    PensionService.countryPensionServices[NigeriaPensionService.country] =
      new NigeriaPensionService();

    registered = true;
  };
})();

export class PensionService {
  static countryPensionServices: Record<string, CountryPensionService> = {};

  static get(name: string) {
    registerServices();

    const service = PensionService.countryPensionServices[name];
    if (!service) {
      throw new Error(`pension service for '${name}' does not exist`);
    }

    return service;
  }

  static process(country: string, context: ProcessPensionPayload) {
    return PensionService.get(country).process(context);
  }
}
