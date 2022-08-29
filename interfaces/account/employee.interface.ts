import {IsOptional} from 'class-validator';

export class CheckEmployeeDTO {
  @IsOptional()
  emailOrPhonenumber?: string;
  @IsOptional()
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
