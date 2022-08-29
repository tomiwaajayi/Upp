"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationException = void 0;
const common_1 = require("@nestjs/common");
class ValidationException extends common_1.HttpException {
    constructor(validationErrors) {
        super('', common_1.HttpStatus.UNPROCESSABLE_ENTITY);
        this.validationErrors = validationErrors;
    }
    getResponse() {
        return {
            statusCode: this.getStatus(),
            error: 'Validation Error',
            errors: this.validationErrors,
            message: 'validation error',
        };
    }
    static formatErrors(errorsToFromat) {
        return errorsToFromat.reduce((accumulator, error) => {
            let constraints;
            if (Array.isArray(error.children) && error.children.length) {
                constraints = ValidationException.formatErrors(error.children);
            }
            else {
                const hasContraints = !!error.constraints;
                if (hasContraints) {
                    let items = Object.values(error.constraints);
                    const lastItem = items.pop();
                    items = [items.join(', '), lastItem].filter(item => item);
                    constraints = items.join(' and ');
                }
                else {
                    constraints = '';
                }
            }
            return {
                ...accumulator,
                [error.property]: constraints,
            };
        }, {});
    }
}
exports.ValidationException = ValidationException;
//# sourceMappingURL=validation.exception.js.map