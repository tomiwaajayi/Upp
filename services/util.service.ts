import {BadRequestException, HttpException, HttpStatus} from '@nestjs/common';
import {
  validateOrReject,
  validateSync,
  ValidationError,
  ValidatorOptions,
} from 'class-validator';
import {Response} from 'express';
import {ClientException} from '../exceptions/client_exception';
import {ResponseService} from './response.service';
import {PhoneNumberFormat, PhoneNumberUtil} from 'google-libphonenumber';
import {firstValueFrom, Observable} from 'rxjs';
import {RedisOptions, Transport} from '@nestjs/microservices';
const phoneUtil = PhoneNumberUtil.getInstance();
export class UtilService {
  static async quickController(
    res: Response,
    successMessage: string,
    service: any,
    method: string,
    httpStatusCode?: number,
    ...opts: any
  ): Promise<any> {
    try {
      let meta: any;
      let data: any;
      const result = await service[method](...opts);
      if (result.error) {
        throw new ClientException(
          Error(result.error.message),
          result.error.status
        );
      }
      if (result && result.metadata) {
        data = result.data;
        meta = result.metadata;
      } else {
        data = result;
      }
      return ResponseService.json(
        res,
        httpStatusCode || HttpStatus.OK,
        successMessage || '',
        data,
        meta
      );
    } catch (e) {
      if ('statusCode' in (e as any)) {
        return res.status((e as any).statusCode).send(e);
      }
      return ResponseService.json(
        res,
        e as Error,
        (e as Error).message ||
          'An Error Occurred, we are already on top of it',
        undefined,
        undefined,
        (e as any).status || HttpStatus.BAD_REQUEST
      );
    }
  }

  static async microServiceController(
    service: any,
    method: string,
    ...opts: any
  ): Promise<any> {
    try {
      return await service[method](...opts);
    } catch (e) {
      if (e instanceof ClientException || e instanceof HttpException) {
        return {
          error: {
            message: e.message,
            status: e.getStatus(),
          },
        };
      }
      return {
        error: {
          message: (e as any).message,
          status: HttpStatus.BAD_REQUEST,
        },
      };
    }
  }

  static parseMicroserviceResp<T>(payload: any): T {
    if (payload.error) {
      throw new ClientException(
        Error(payload.error.message),
        payload.statusCode || payload.error.status
      );
    }
    return payload as T;
  }

  static async callMicroService<T>(u: Observable<T>): Promise<T> {
    const x = UtilService.parseMicroserviceResp(await firstValueFrom(u));
    return x as T;
  }

  static async validateOrReject(
    payload: Object,
    options?: ValidatorOptions
  ): Promise<boolean> {
    try {
      await validateOrReject(payload, options);
      return true;
    } catch (e) {
      const validationErors = e as ValidationError[];
      let message = '';
      validationErors.forEach(err => {
        Object.keys(err.constraints as any).forEach(constraint => {
          message += `\n${(err.constraints as any)[constraint]}`;
        });
      });
      throw new Error(message);
    }
  }

  static validateOrRejectSync(
    payload: Object,
    options?: ValidatorOptions
  ): boolean {
    try {
      const errors = validateSync(payload, options);
      if (errors.length > 0) {
        throw errors;
      }
      return true;
    } catch (e) {
      const validationErors = e as ValidationError[];
      let message = '';
      validationErors.forEach(err => {
        Object.keys(err.constraints as any).forEach(constraint => {
          message += `\n${err.property} => ${
            (err.constraints as any)[constraint]
          }`;
        });
      });
      throw new Error(message);
    }
  }

  static parseEmail(email: string): string {
    return email.toLowerCase().trim();
  }

  static formatPhoneNumber(phoneNumber: string, countryCode: string) {
    try {
      const number = phoneUtil.parse(phoneNumber, countryCode);
      const formatted = phoneUtil
        .format(number, PhoneNumberFormat.E164)
        .replace('+', '');

      return formatted;
    } catch (error) {
      throw new BadRequestException('invalid phonumber');
    }
  }

  static generateRandom(
    length: number,
    chars?: string,
    isOTP?: boolean
  ): string {
    let dict = chars ?? '';
    if (!chars) {
      dict = '0123456789';
      if (!isOTP) {
        dict += 'ABCDEFGHJKLMNOPQRSTUVWXYZ';
      }
    }

    let result = '';
    for (let i = length; i > 0; i -= 1) {
      result += dict[Math.round(Math.random() * (dict.length - 1))];
    }
    return result;
  }

  static getKafkaConfig(configuration: any): any {
    return {
      brokers: configuration.kafka.endpoint.split(','),
      connectionTimeout: 10000,
      requestTimeout: 10000,
      enforceRequestTimeout: true,
      clientId: configuration.kafka.clientId,
      sasl: configuration.kafka.ssl && {
        mechanism: 'plain',
        username: configuration.kafka.username,
        password: configuration.kafka.password,
      },
      retry: {
        retries: 100,
      },
      ssl: configuration.kafka.ssl,
    };
  }

  static cleanArray<T>(arr: T[]) {
    return arr.filter(item => Boolean(item));
  }

  static getRedisServerConfig(configuration: {
    redis: {
      url?: string;
      host?: string;
      port?: number;
      password?: string;
      prefix?: string;
    };
    isDev(): boolean;
  }): RedisOptions {
    return {
      transport: Transport.REDIS,
      options: {
        url: configuration.redis.url,
        host: configuration.redis.host,
        port: configuration.redis.port,
        password: configuration.redis.password,
        prefix:
          configuration.redis.prefix ||
          (configuration.isDev() ? 'dev' : 'production'),
      },
    };
  }

  static getRedisClientConfig(
    clientName: string,
    configuration: {
      redis: {
        url?: string;
        host?: string;
        port?: number;
        password?: string;
        prefix?: string;
      };
      isDev(): boolean;
    }
  ) {
    return {
      name: clientName,
      transport: Transport.REDIS,
      options: {
        url: configuration.redis.url,
        host: configuration.redis.host,
        port: configuration.redis.port,
        password: configuration.redis.password,
        prefix:
          configuration.redis.prefix ||
          (configuration.isDev() ? 'dev' : 'production'),
      },
    };
  }
}
