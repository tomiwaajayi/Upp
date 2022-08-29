import { HttpStatus } from '@nestjs/common';
export interface IClientException {
    message: string;
    status: HttpStatus;
    errors: string[];
}
