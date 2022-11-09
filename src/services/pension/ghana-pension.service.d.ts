import { IMoney } from '../../interfaces/payment/money.interface';
import { BaseCountryPensionService } from './base.service';
import { ProcessPensionPayload } from './pension.types';
export declare class GahanaPensionService extends BaseCountryPensionService {
    constructor();
    static country: string;
    calculatePension(breakdown: Record<string, number>, salary: IMoney, percent: number, calculateExcess?: boolean): IMoney;
    processEmployeePensionDeduction(payload: ProcessPensionPayload): {
        pensionTierOne: IMoney;
        pensionTierTwo: IMoney;
        pensionTierThree: IMoney;
        excessPension: {
            value: number;
            currency: string;
        };
        tierThree: {
            value: number;
            currency: string;
        };
        employerTierThree: {
            value: number;
            currency: string;
        };
        actualVoluntaryPension: {
            tierThree: {
                value: number;
                currency: string;
            };
            employerTierThree: {
                value: number;
                currency: string;
            };
        };
        voluntaryPensionContribution: IMoney;
        voluntaryPensionContributionEmployer: IMoney;
        amount: IMoney;
        name: string;
        employeeContribution: {
            value: number;
            currency: string;
        };
        employerContribution: {
            value: number;
            currency: string;
        };
    };
}
