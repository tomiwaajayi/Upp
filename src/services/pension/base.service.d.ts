import { IMoney } from '../../interfaces/payment/money.interface';
import { CountryPensionService, ProcessPensionPayload } from './pension.types';
export declare class BaseCountryPensionService implements CountryPensionService {
    protected employeePercent: number;
    protected employerPercent: number;
    constructor(employeePercent: number, employerPercent: number);
    process(context: ProcessPensionPayload): void;
    calculatePension(breakdown: Record<string, number>, salary: IMoney, percent: number): {
        value: number;
        currency: string;
    };
    protected getBreakdown(payload: ProcessPensionPayload): Record<string, number>;
    processEmployeePensionDeduction(payload: ProcessPensionPayload): {
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
    processEmployeePensionQuote(payload: ProcessPensionPayload): {
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
    remitEnabled(payload: ProcessPensionPayload): boolean;
}
