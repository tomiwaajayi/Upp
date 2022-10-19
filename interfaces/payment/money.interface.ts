import {dinero} from 'dinero.js';

export interface IMoney {
  amount: number;
  currency: string;
}

export class Money {
  /**
   * @example
   * import {add} from 'dinero.js'
   * const moneyInstance = new Money({ amount: 400, currency: 'NGN' })
   * const anotherMoneyInstance = new Money({ amount: 900, currency: 'NGN' })
   * add(moneyInstance, anotherMoneyInstance)
   */
  constructor({amount, currency}: IMoney) {
    return dinero({
      amount,
      currency: {
        code: currency,
        base: 10,
        exponent: 3,
      },
    });
  }
}
