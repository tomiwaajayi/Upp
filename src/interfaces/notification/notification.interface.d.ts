export declare class SendEmailDTO<T> {
    data: T;
    template: string;
    to: Recipient;
    subject: string;
}
export interface Recipient {
    firstName: string;
    lastName: string;
    email: string;
}
