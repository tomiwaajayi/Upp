import { CountryPensionService, ProcessPensionPayload } from './pension.types';
export declare class PensionService {
    private static countryPensionServices;
    private static registered;
    private static registerServices;
    static get(name: string): CountryPensionService;
    static process(country: string, context: ProcessPensionPayload): void;
}
