export declare class CheckEmployeeDTO {
    emailOrPhonenumber?: string;
    employeeId?: string;
}
export interface ICheckEmployeeResponse {
    companyName: string;
    companyLogo: string;
    employeeId: string;
    firstName: string;
    workEmail: string;
    country: string;
    phoneNumber: string;
    organization: string;
    lastName: string;
    user?: string;
}
