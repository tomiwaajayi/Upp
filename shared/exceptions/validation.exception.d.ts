import { HttpException, ValidationError } from '@nestjs/common';
export declare class ValidationException extends HttpException {
    validationErrors: Record<string, unknown>;
    constructor(validationErrors: Record<string, unknown>);
    getResponse(): {
        statusCode: number;
        error: string;
        errors: Record<string, unknown>;
        message: string;
    };
    static formatErrors(errorsToFromat: ValidationError[]): {
        [x: string]: any;
    };
}
