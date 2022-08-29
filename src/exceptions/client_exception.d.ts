import { HttpException } from '@nestjs/common';
export declare class ClientException extends HttpException {
    constructor(error: unknown, status?: number);
}
