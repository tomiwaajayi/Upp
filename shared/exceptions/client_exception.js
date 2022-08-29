"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientException = void 0;
const common_1 = require("@nestjs/common");
class ClientException extends common_1.HttpException {
    constructor(error, status) {
        super(error, status ||
            error.statusCode ||
            common_1.HttpStatus.BAD_REQUEST);
    }
}
exports.ClientException = ClientException;
//# sourceMappingURL=client_exception.js.map