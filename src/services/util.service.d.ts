import { ValidatorOptions } from 'class-validator';
import { Response } from 'express';
import { Observable } from 'rxjs';
export declare class UtilService {
    static quickController(res: Response, successMessage: string, service: any, method: string, httpStatusCode?: number, ...opts: any): Promise<any>;
    static microServiceController(service: any, method: string, ...opts: any): Promise<any>;
    static parseMicroserviceResp<T>(payload: any): T;
    static callMicroService<T>(u: Observable<T>): Promise<T>;
    static validateOrReject(payload: Object, options?: ValidatorOptions): Promise<boolean>;
    static validateOrRejectSync(payload: Object, options?: ValidatorOptions): boolean;
    static parseEmail(email: string): string;
    static formatPhoneNumber(phoneNumber: string, countryCode: string): string;
    static generateRandom(length: number, chars?: string, isOTP?: boolean): string;
    static getKafkaConfig(configuration: any): any;
    static cleanArray<T>(arr: T[]): T[];
}
