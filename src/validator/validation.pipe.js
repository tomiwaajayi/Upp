"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const validation_exception_1 = require("../exceptions/validation.exception");
class AppValidationPipe extends common_1.ValidationPipe {
    constructor(options) {
        super({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
            exceptionFactory: (errors) => {
                const messages = validation_exception_1.ValidationException.formatErrors(errors);
                return new validation_exception_1.ValidationException(messages);
            },
            ...(options || {}),
        });
    }
}
exports.AppValidationPipe = AppValidationPipe;
//# sourceMappingURL=validation.pipe.js.map