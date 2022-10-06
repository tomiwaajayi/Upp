export interface IOrganizationResponse {
    name: string;
    email: string;
    id: string;
}
export interface Organization {
    country: string;
    email: string;
    name: string;
    logo?: string;
    address?: string;
    industry?: string;
    website?: string;
    registrationNumber?: string;
    registrationDate?: Date;
    createdBy: string;
    isDeleted?: boolean;
    deletedAt?: Date;
}
