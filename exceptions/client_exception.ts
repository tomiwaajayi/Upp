import {HttpException, HttpStatus} from '@nestjs/common';

export class ClientException extends HttpException {
  constructor(error: unknown, status?: number) {
    super(
      error as any,
      status ||
        ((error as Record<string, unknown>).statusCode as number) ||
        HttpStatus.BAD_REQUEST
    );
  }
}
