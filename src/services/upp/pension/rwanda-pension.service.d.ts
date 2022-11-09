import { IMoney } from '../../../interfaces/payment/money.interface';
import { BaseCountryPensionService } from './base.service';
import { ProcessPensionPayload } from './pension.types';
export declare class RwandaPensionService extends BaseCountryPensionService {
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
        employeeContributionWithoutMaternityAndMedical: {
            value: number;
            currency: string;
        };
        employerContributionWithoutMaternityAndMedical: {
            value: number;
            currency: string;
        };
        medicalPension: {
            value: number;
            currency: string;
        };
        employeeMedicalPension: {
            value: number;
            currency: string;
        };
        employerMedicalPension: {
            value: number;
            currency: string;
        };
        maternityPension: IMoney;
        employeeMaternityPension: IMoney;
        employerMaternityPension: IMoney;
        employeeVoluntaryPensionContribution: {
            value: number;
            currency: string;
        };
        employerVoluntaryPensionContribution: {
            value: number;
            currency: string;
        };
        name: string;
    };
}
