import * as Currency from 'currency.js';

export interface IMoney {
  value: number;
  currency: string;
}

export class Money extends Currency {
  static _({value, currency}: IMoney): Money {
    return Currency(value || 0, {symbol: currency, precision: 3});
  }

  /** return IMoney object with params initialized */
  static new(value: number, currency: string): IMoney {
    return this.toMoney(Money._({value, currency}));
  }

  /**
   * This is a short form of Money.add() function
   * @example
   * const amount = { value: 400, currency: 'NGN' }
   * const anotherAmount = { value: 900, currency: 'NGN' }
   * Money.add(amount, anotherAmount)
   */
  static add(a: IMoney, b: IMoney | number) {
    const x = typeof b === 'number' ? b : this._(b as IMoney);
    return this.toMoney(this._(a).add(x));
  }

  static sub(a: IMoney, b: IMoney | number) {
    const x = typeof b === 'number' ? b : this._(b as IMoney);
    return this.toMoney(this._(a).subtract(x));
  }

  static mul(a: IMoney, b: IMoney | number) {
    const x = typeof b === 'number' ? b : this._(b as IMoney);
    return this.toMoney(this._(a).multiply(x));
  }

  static div(a: IMoney, b: IMoney | number) {
    const x = typeof b === 'number' ? b : this._(b as IMoney);
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
  static addMany(addends: IMoney[] | unknown[], key?: string) {
    let array: IMoney[];
    let currency = '';
    if (!key) {
      array = addends as IMoney[];
    } else {
      array = addends.map(a => (a as Record<string, IMoney>)[key]);
    }

    currency = (array[0] as IMoney).currency;
    return this.toMoney(
      array.reduce(
        (acc: Money, amount: IMoney) => acc.add(this._(amount)),
        this._({
          value: 0,
          currency,
        })
      )
    );
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
  static subMany(from: IMoney, entries: IMoney[] | number[]) {
    // if (typeof subs === IMoney[])
    return this.toMoney(
      (entries as []).reduce((acc: Money, b: IMoney | number) => {
        const x = typeof b === 'number' ? b : this._(b as IMoney);
        return acc.subtract(x);
      }, this._(from))
    );
  }

  /**
   * Returns true if first param is greater than second param
   */
  static greaterThan(a: IMoney, b: IMoney | number): boolean {
    return a.value > ((<IMoney>b).value || <number>b);
  }

  /**
   * Returns true if first param is greater than or equal to second param
   */
  static greaterThanEq(a: IMoney, b: IMoney | number): boolean {
    return a.value >= ((<IMoney>b).value || <number>b);
  }

  /**
   * Returns true if first param is less than second param
   */
  static lessThan(a: IMoney, b: IMoney | number): boolean {
    return a.value < ((<IMoney>b).value || <number>b);
  }

  /**
   * Returns true if first param is less than or equal to second param
   */
  static lessThanEq(a: IMoney, b: IMoney | number): boolean {
    return a.value <= ((<IMoney>b).value || <number>b);
  }

  static equalTo(a: IMoney, b: IMoney | number): boolean {
    return a.value === ((<IMoney>b).value || <number>b);
  }

  static toMoney(data: any): IMoney {
    return {
      value: data.value,
      currency: data.s.symbol,
    };
  }
}
