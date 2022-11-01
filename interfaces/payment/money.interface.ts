import * as Currency from 'currency.js';

export interface IMoney {
  value: number;
  currency: string;
}

export class Money extends Currency {
  /**
   * @example
   * import {add} from 'dinero.js'
   * const amount = { value: 400, currency: 'NGN' }
   * const anotherAmount = { value: 900, currency: 'NGN' }
   * Money.add(amount, anotherAmount)
   */
  static _({value, currency}: IMoney) {
    return Currency(value, {symbol: currency});
  }

  static add(a: IMoney, b: IMoney) {
    return this.toMoney(this._(a).add(this._(b)));
  }

  static sub(a: IMoney, b: IMoney) {
    return this.toMoney(this._(a).subtract(this._(b)));
  }

  static mul(a: IMoney, b: IMoney) {
    return this.toMoney(this._(a).multiply(this._(b)));
  }

  static div(a: IMoney, b: IMoney) {
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
  static addMany(addends: IMoney[] | unknown[], key?: string) {
    let array: IMoney[];
    let currency = '';
    if (!key) {
      array = addends as IMoney[];
    } else {
      array = addends.map(a => (a as Record<string, IMoney>)[key]);
    }

    currency = (array[0] as IMoney).currency;
    return array.reduce(
      (acc: IMoney, amount: IMoney) => this.add(amount, acc),
      {
        value: 0,
        currency,
      }
    );
  }

  static substractMany(addends: IMoney[] | unknown[], key?: string) {
    let array: IMoney[];
    let currency = '';
    if (!key) {
      array = addends as IMoney[];
    } else {
      array = addends.map(a => (a as Record<string, IMoney>)[key]);
    }

    currency = (array[0] as IMoney).currency;
    return array.reduce(
      (acc: IMoney, amount: IMoney) => this.sub(amount, acc),
      {
        value: 0,
        currency,
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static toMoney(data: any): IMoney {
    return {
      value: data.value,
      currency: data.s.symbol,
    };
  }
}
