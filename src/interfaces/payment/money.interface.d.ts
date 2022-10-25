export interface IMoney {
    amount: number;
    currency: string;
}
export interface MoneyCalculator {
    add(a: IMoney, b: IMoney): this;
}
export declare class Money {
    /**
     * @example
     * import {add} from 'dinero.js'
     * const amount = { amount: 400, currency: 'NGN' }
     * const anotherAmount = { amount: 900, currency: 'NGN' }
     * Money.add(amount, anotherAmount)
     */
    static _({ amount, currency }: IMoney): import("dinero.js").Dinero<number>;
    static add(a: IMoney, b: IMoney): IMoney;
    static sub(a: IMoney, b: IMoney): IMoney;
    static mul(a: IMoney, b: IMoney): IMoney;
    static div(a: IMoney, b: IMoney): IMoney;
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
    static addMany<T extends object | IMoney, U extends keyof T>(addends: T[], on?: U): IMoney;
    static toMoney(dineroObject: unknown): IMoney;
}
