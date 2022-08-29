import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
export declare class ResponseObject<T> {
    code?: string;
    message?: string;
    data?: T;
    meta?: any;
}
export declare class ResponseService {
    private configService;
    constructor(configService: ConfigService);
    static json<T>(res: Response, statusOrError: number | Error, message?: string, data?: Record<string, unknown> | Array<Record<string, unknown>> | T, meta?: any, code?: string): void;
}
