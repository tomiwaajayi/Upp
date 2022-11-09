import { IMoney } from '../../../interfaces/payment/money.interface';
import { BaseCountryPensionService } from './base.service';
import { ProcessPensionPayload } from './pension.types';
export declare class KenyaPensionService extends BaseCountryPensionService {
    constructor();
    static country: string;
    calculatePension(_breakdown: Record<string, number>, salary: IMoney, percent: number): IMoney;
    processEmployeePensionDeduction(payload: ProcessPensionPayload): {
        amount: IMoney;
        employeeContribution: {
            value: number;
            currency: string;
        };
        employerContribution: {
            value: number;
            currency: string;
        };
        pensionDeductType: "old-rate" | "tier-1";
        name: string;
    };
}
