export interface IMoney {
    amount: number;
    currency: string;
}
export declare class Money {
    static get({ amount, currency }: IMoney): void;
}
