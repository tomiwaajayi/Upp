"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilService = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const client_exception_1 = require("../exceptions/client_exception");
const response_service_1 = require("./response.service");
const google_libphonenumber_1 = require("google-libphonenumber");
const rxjs_1 = require("rxjs");
const microservices_1 = require("@nestjs/microservices");
const phoneUtil = google_libphonenumber_1.PhoneNumberUtil.getInstance();
class UtilService {
    static async quickController(res, successMessage, service, method, httpStatusCode, ...opts) {
        try {
            let meta;
            let data;
            const result = await service[method](...opts);
            if (result.error) {
                throw new client_exception_1.ClientException(Error(result.error.message), result.error.status);
            }
            if (result && result.metadata) {
                data = result.data;
                meta = result.metadata;
            }
            else {
                data = result;
            }
            return response_service_1.ResponseService.json(res, httpStatusCode || common_1.HttpStatus.OK, successMessage || '', data, meta);
        }
        catch (e) {
            if ('statusCode' in e) {
                return res.status(e.statusCode).send(e);
            }
            return response_service_1.ResponseService.json(res, e, e.message ||
                'An Error Occurred, we are already on top of it', undefined, undefined, e.status || common_1.HttpStatus.BAD_REQUEST);
        }
    }
    static async microServiceController(service, method, ...opts) {
        try {
            return await service[method](...opts);
        }
        catch (e) {
            if (e instanceof client_exception_1.ClientException || e instanceof common_1.HttpException) {
                return {
                    error: {
                        message: e.message,
                        status: e.getStatus(),
                    },
                };
            }
            return {
                error: {
                    message: e.message,
                    status: common_1.HttpStatus.BAD_REQUEST,
                },
            };
        }
    }
    static parseMicroserviceResp(payload) {
        if (payload.error) {
            throw new client_exception_1.ClientException(Error(payload.error.message), payload.statusCode || payload.error.status);
        }
        return payload;
    }
    static async callMicroService(u) {
        const x = UtilService.parseMicroserviceResp(await (0, rxjs_1.firstValueFrom)(u));
        return x;
    }
    static async validateOrReject(payload, options) {
        try {
            await (0, class_validator_1.validateOrReject)(payload, options);
            return true;
        }
        catch (e) {
            const validationErors = e;
            let message = '';
            validationErors.forEach(err => {
                Object.keys(err.constraints).forEach(constraint => {
                    message += `\n${err.constraints[constraint]}`;
                });
            });
            throw new Error(message);
        }
    }
    static validateOrRejectSync(payload, options) {
        try {
            const errors = (0, class_validator_1.validateSync)(payload, options);
            if (errors.length > 0) {
                throw errors;
            }
            return true;
        }
        catch (e) {
            const validationErors = e;
            let message = '';
            validationErors.forEach(err => {
                Object.keys(err.constraints).forEach(constraint => {
                    message += `\n${err.property} => ${err.constraints[constraint]}`;
                });
            });
            throw new Error(message);
        }
    }
    static parseEmail(email) {
        return email.toLowerCase().trim();
    }
    static formatPhoneNumber(phoneNumber, countryCode) {
        try {
            const number = phoneUtil.parse(phoneNumber, countryCode);
            const formatted = phoneUtil
                .format(number, google_libphonenumber_1.PhoneNumberFormat.E164)
                .replace('+', '');
            return formatted;
        }
        catch (error) {
            throw new common_1.BadRequestException('invalid phonumber');
        }
    }
    static generateRandom(length, chars, isOTP) {
        let dict = chars !== null && chars !== void 0 ? chars : '';
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
    static getKafkaConfig(configuration) {
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
    static cleanArray(arr) {
        return arr.filter(item => Boolean(item));
    }
    static getRedisServerConfig(configuration) {
        return {
            transport: microservices_1.Transport.REDIS,
            options: {
                url: configuration.redis.url,
                host: configuration.redis.host,
                port: configuration.redis.port,
                password: configuration.redis.password,
                prefix: configuration.redis.prefix ||
                    (configuration.isDev() ? 'dev' : 'production'),
            },
        };
    }
}
exports.UtilService = UtilService;
//# sourceMappingURL=util.service.js.map