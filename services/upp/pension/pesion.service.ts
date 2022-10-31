import {NigeriaPensionService} from './nigeria-pension.service';
import {CountryPensionService, ProcessPensionPayload} from './pension.types';

export class PensionService {
  private static countryPensionServices: Record<string, CountryPensionService> =
    {};

  private static registered = true;

  private static registerServices() {
    if (this.registered) {
      return;
    }

    PensionService.countryPensionServices[NigeriaPensionService.country] =
      new NigeriaPensionService();

    this.registered = true;
  }

  static get(name: string) {
    this.registerServices();

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
