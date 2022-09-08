import {
  Catch,
  HttpException,
  InternalServerErrorException,
} from '@nestjs/common';
import {BaseRpcExceptionFilter, RpcException} from '@nestjs/microservices';
import {throwError} from 'rxjs';

@Catch()
export class ExceptionFilter extends BaseRpcExceptionFilter {
  catch(exception: Error) {
    let error = new InternalServerErrorException(
      'Something went wrong'
    ).getResponse();
    if (exception instanceof RpcException) {
      error = exception.getError();
    }
    if (exception instanceof HttpException) {
      error = exception.getResponse();
    }

    return throwError(() => Buffer.from(JSON.stringify(error)));
  }
}
