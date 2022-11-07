import { BaseCountryPensionService } from './base.service';
import { ProcessPensionPayload } from './pension.types';
export declare class NigeriaPensionService extends BaseCountryPensionService {
    constructor();
    static country: string;
    remitEnabled(payload: ProcessPensionPayload): boolean;
}
