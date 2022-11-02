import * as Currency from 'currency.js';
export interface IMoney {
    value: number;
    currency: string;
}
export declare class Money extends Currency {
    /**
     * @example
     * import {add} from 'dinero.js'
     * const amount = { value: 400, currency: 'NGN' }
     * const anotherAmount = { value: 900, currency: 'NGN' }
     * Money.add(amount, anotherAmount)
     */
    static _({ value, currency }: IMoney): Currency;
    static add(a: IMoney, b: IMoney): IMoney;
    static sub(a: IMoney, b: IMoney): IMoney;
    static mul(a: IMoney, b: IMoney): IMoney;
    static div(a: IMoney, b: IMoney): IMoney;
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
    static addMany(addends: IMoney[] | unknown[], key?: string): IMoney;
    static toMoney(data: any): IMoney;
}
