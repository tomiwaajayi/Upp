"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseSchemaDecorator = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const BaseSchemaDecorator = (options) => (0, common_1.applyDecorators)((0, mongoose_1.Schema)({
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: (_doc, ret) => {
            delete ret._id;
            delete ret.__v;
        },
    },
    toObject: {
        virtuals: true,
    },
    ...options,
}));
exports.BaseSchemaDecorator = BaseSchemaDecorator;
//# sourceMappingURL=base-schema.decorator.js.map