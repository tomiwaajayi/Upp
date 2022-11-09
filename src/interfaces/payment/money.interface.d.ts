import * as Currency from 'currency.js';
export interface IMoney {
    value: number;
    currency: string;
}
export declare class Money extends Currency {
    static _({ value, currency }: IMoney): Money;
    /** return IMoney object with params initialized */
    static new(value: number, currency: string): IMoney;
    /**
     * This is a short form of Money.add() function
     * @example
     * const amount = { value: 400, currency: 'NGN' }
     * const anotherAmount = { value: 900, currency: 'NGN' }
     * Money.add(amount, anotherAmount)
     */
    static add(a: IMoney, b: IMoney | number): IMoney;
    static sub(a: IMoney, b: IMoney | number): IMoney;
    static mul(a: IMoney, b: IMoney | number): IMoney;
    static div(a: IMoney, b: IMoney | number): IMoney;
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
    static subMany(from: IMoney, entries: IMoney[] | number[]): IMoney;
    /**
     * Returns true if first param is greater than second param
     */
    static greaterThan(a: IMoney, b: IMoney | number): boolean;
    /**
     * Returns true if first param is greater than or equal to second param
     */
    static greaterThanEq(a: IMoney, b: IMoney | number): boolean;
    /**
     * Returns true if first param is less than second param
     */
    static lessThan(a: IMoney, b: IMoney | number): boolean;
    /**
     * Returns true if first param is less than or equal to second param
     */
    static lessThanEq(a: IMoney, b: IMoney | number): boolean;
    static equalTo(a: IMoney, b: IMoney | number): boolean;
    static toMoney(data: any): IMoney;
}
