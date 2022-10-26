"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Money = void 0;
const dinero_js_1 = require("dinero.js");
const lodash_1 = require("lodash");
class Money {
    /**
     * @example
     * import {add} from 'dinero.js'
     * const amount = { amount: 400, currency: 'NGN' }
     * const anotherAmount = { amount: 900, currency: 'NGN' }
     * Money.add(amount, anotherAmount)
     */
    static _({ amount, currency }) {
        return (0, dinero_js_1.dinero)({
            amount,
            currency: {
                code: currency,
                base: 10,
                exponent: 3,
            },
        });
    }
    static add(a, b) {
        return this.toMoney((0, dinero_js_1.add)(this._(a), this._(b)));
    }
    static sub(a, b) {
        return this.toMoney((0, dinero_js_1.subtract)(this._(a), this._(b)));
    }
    static mul(a, b) {
        return this.toMoney((0, dinero_js_1.multiply)(this._(a), (0, lodash_1.toNumber)(this._(b))));
    }
    static div(a, b) {
        return this.toMoney((0, dinero_js_1.multiply)(this._(a), (0, lodash_1.toNumber)(this._(b))));
    }
    /**
     * Adds array of objects or array of money interface
     * @example
     * Money.addMany(
        [
          {loan: {amount: 1000, currency: 'NGN'}},
          {loan: {amount: 300, currency: 'NGN'}},
          {loan: {amount: 488, currency: 'NGN'}},
        ],
        'loan'
      )
      @example
      Money.addMany(
        [
          {amount: 1000, currency: 'NGN'},
          {amount: 300, currency: 'NGN'},
          {amount: 488, currency: 'NGN'},
        ]
      )
     */
    static addMany(addends, on) {
        if (!on)
            return this.toMoney(addends.map(a => Money._(a)).reduce(dinero_js_1.add));
        return this.toMoney(addends.map(a => Money._(a[on])).reduce(dinero_js_1.add));
    }
    static toMoney(dineroObject) {
        const obj = JSON.parse(JSON.stringify(dineroObject));
        return {
            amount: obj.amount,
            currency: obj.currency.code,
        };
    }
}
exports.Money = Money;
//# sourceMappingURL=money.interface.js.map