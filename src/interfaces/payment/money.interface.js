"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Money = void 0;
const dinero_js_1 = require("dinero.js");
class Money {
    static get({ amount, currency }) {
        const d = (0, dinero_js_1.dinero)({
            amount,
            currency: {
                code: currency,
                base: 10,
                exponent: 3,
            },
        });
    }
}
exports.Money = Money;
//# sourceMappingURL=money.interface.js.map