export declare class BaseSchemaInterface {
    id?: string;
    updatedAt?: Date;
    createdAt?: Date;
}
export interface Country {
    _id: string;
    name: string;
    isoCode: string;
    iso2: string;
    dialCode: string;
    lat: number;
    long: number;
    location: {
        type: string;
        coordinates: number[];
    };
    code: string;
    isDeleted: boolean;
    slug: string;
    createdAt: string;
    updatedAt: string;
    imageUrl: string;
    isActive: boolean;
    symbol: string;
}
