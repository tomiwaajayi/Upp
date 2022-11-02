"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Money = void 0;
const Currency = require("currency.js");
class Money extends Currency {
    /**
     * @example
     * import {add} from 'dinero.js'
     * const amount = { value: 400, currency: 'NGN' }
     * const anotherAmount = { value: 900, currency: 'NGN' }
     * Money.add(amount, anotherAmount)
     */
    static _({ value, currency }) {
        return Currency(value, { symbol: currency });
    }
    static add(a, b) {
        return this.toMoney(this._(a).add(this._(b)));
    }
    static sub(a, b) {
        return this.toMoney(this._(a).subtract(this._(b)));
    }
    static mul(a, b) {
        return this.toMoney(this._(a).multiply(this._(b)));
    }
    static div(a, b) {
        return this.toMoney(this._(a).divide(this._(b)));
    }
    /**
     * Adds array of objects or array of money interface
     * @example
     * Money.addMany(
        [
          {loanAmount: {value: 1000, currency: 'NGN'}},
          {loanAmount: {value: 300, currency: 'NGN'}},
          {loanAmount: {value: 488, currency: 'NGN'}},
        ],
        'loanAmount'
      )
      @example
      Money.addMany(
        [
          {value: 1000, currency: 'NGN'},
          {value: 300, currency: 'NGN'},
          {value: 488, currency: 'NGN'},
        ]
      )
     */
    static addMany(addends, key) {
        let array;
        let currency = '';
        if (!key) {
            array = addends;
        }
        else {
            array = addends.map(a => a[key]);
        }
        currency = array[0].currency;
        return array.reduce((acc, amount) => this.add(amount, acc), {
            value: 0,
            currency,
        });
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static toMoney(data) {
        return {
            value: data.value,
            currency: data.s.symbol,
        };
    }
}
exports.Money = Money;
//# sourceMappingURL=money.interface.js.map