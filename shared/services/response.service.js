"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseService = exports.ResponseObject = void 0;
const lodash_1 = require("lodash");
class ResponseObject {
}
exports.ResponseObject = ResponseObject;
const defaultStatus = 400;
class ResponseService {
    constructor(configService) {
        this.configService = configService;
    }
    static json(res, statusOrError, message, data, meta, code) {
        const error = statusOrError instanceof Error ? statusOrError : null;
        const responseObj = {};
        responseObj.message = message;
        let status = statusOrError;
        if (error) {
            const errorObj = statusOrError;
            responseObj.message = message || errorObj.message;
            status = (0, lodash_1.get)(errorObj, 'status', defaultStatus);
        }
        if (!(0, lodash_1.isNil)(data)) {
            responseObj.data = data;
        }
        if (!(0, lodash_1.isNil)(meta)) {
            responseObj.meta = meta;
        }
        if (!(0, lodash_1.isEmpty)(code)) {
            responseObj.code = code;
        }
        const statusCode = status;
        res.status(statusCode).send(responseObj);
    }
}
exports.ResponseService = ResponseService;
//# sourceMappingURL=response.service.js.map