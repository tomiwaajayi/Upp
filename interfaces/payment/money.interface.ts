import {dinero} from 'dinero.js';

export interface IMoney {
  amount: number;
  currency: string;
}

export class Money {
  static get({amount, currency}: IMoney) {
    const d = dinero({
      amount,
      currency: {
        code: currency,
        base: 10,
        exponent: 3,
      },
    });
  }
}
