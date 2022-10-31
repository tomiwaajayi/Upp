import {IRemitance} from './employee.interface';

export interface IOrganizationResponse {
  name: string;
  email: string;
  id: string;
}

export interface Organization {
  country: {id: string; name: string};
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

export interface OrganizationSettings {
  hasSalaryBreakdown: boolean;
  salaryBreakdown?: Record<string, number>;
  remittances: Record<string, IRemitance>;
  isTotalNsitfEnumeration?: boolean;
  isTotalItfEnumeration?: boolean;
  enableConsolidatedGross?: boolean;
}
