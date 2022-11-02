import {BaseSchemaInterface} from '../base.interface';

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
