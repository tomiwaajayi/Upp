import {Country} from '../base.interface';

export interface IOrganizationResponse {
  name: string;
  email: string;
  id: string;
}

export interface Organization {
  country: Country;
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

export interface RemittanceItem {
  enabled: boolean;
  remit: boolean;
  WHTaxRate?: number;
  enabledWithHoldingTax?: boolean;
  useGrossOnlyForMinimumWage: boolean;
  type?: string; // pension type quote or deduct
}
