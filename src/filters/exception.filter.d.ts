import { BaseRpcExceptionFilter } from '@nestjs/microservices';
export declare class ExceptionFilter extends BaseRpcExceptionFilter {
    catch(exception: Error): import("rxjs").Observable<never>;
}
