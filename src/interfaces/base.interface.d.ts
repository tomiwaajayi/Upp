import { IRemitance } from './account/employee.interface';
export declare class BaseSchemaInterface {
    id?: string;
    updatedAt?: Date;
    createdAt?: Date;
}
export interface Country {
    _id?: string;
    id: string;
    name: string;
    isoCode?: string;
    iso2: string;
    dialCode: string;
    code: string;
    isDeleted: boolean;
    slug?: string;
    createdAt: string;
    updatedAt: string;
    imageUrl: string;
    isActive: boolean;
    symbol: string;
    lat?: number;
    long?: number;
    location?: {
        type: string;
        coordinates: number[];
    };
}
export declare type NestedRecord = Record<string, Record<string, unknown>>;
export declare type NestedIRemittance = Record<string, IRemitance>;
