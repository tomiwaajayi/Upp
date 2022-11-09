"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Money = void 0;
const Currency = require("currency.js");
class Money extends Currency {
    static _({ value, currency }) {
        return Currency(value || 0, { symbol: currency, precision: 3 });
    }
    /** return IMoney object with params initialized */
    static new(value, currency) {
        return this.toMoney(Money._({ value, currency }));
    }
    /**
     * This is a short form of Money.add() function
     * @example
     * const amount = { value: 400, currency: 'NGN' }
     * const anotherAmount = { value: 900, currency: 'NGN' }
     * Money.add(amount, anotherAmount)
     */
    static add(a, b) {
        const x = typeof b === 'number' ? b : this._(b);
        return this.toMoney(this._(a).add(x));
    }
    static sub(a, b) {
        const x = typeof b === 'number' ? b : this._(b);
        return this.toMoney(this._(a).subtract(x));
    }
    static mul(a, b) {
        const x = typeof b === 'number' ? b : this._(b);
        return this.toMoney(this._(a).multiply(x));
    }
    static div(a, b) {
        const x = typeof b === 'number' ? b : this._(b);
        return this.toMoney(this._(a).divide(x));
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
        return this.toMoney(array.reduce((acc, amount) => acc.add(this._(amount)), this._({
            value: 0,
            currency,
        })));
    }
    /**
     * Subtract more than one value from a value
     * @example
     * Money.subMany(
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
    static subMany(from, entries) {
        // if (typeof subs === IMoney[])
        return this.toMoney(entries.reduce((acc, b) => {
            const x = typeof b === 'number' ? b : this._(b);
            return acc.subtract(x);
        }, this._(from)));
    }
    /**
     * Returns true if first param is greater than second param
     */
    static greaterThan(a, b) {
        return a.value > (b.value || b);
    }
    /**
     * Returns true if first param is greater than or equal to second param
     */
    static greaterThanEq(a, b) {
        return a.value >= (b.value || b);
    }
    /**
     * Returns true if first param is less than second param
     */
    static lessThan(a, b) {
        return a.value < (b.value || b);
    }
    /**
     * Returns true if first param is less than or equal to second param
     */
    static lessThanEq(a, b) {
        return a.value <= (b.value || b);
    }
    static equalTo(a, b) {
        return a.value === (b.value || b);
    }
    static toMoney(data) {
        return {
            value: data.value,
            currency: data.s.symbol,
        };
    }
}
exports.Money = Money;
//# sourceMappingURL=money.interface.js.map