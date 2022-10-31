import {IsOptional} from 'class-validator';
import {IMoney} from '../payment/money.interface';
import {Organization} from './organization.interface';

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
  employeeExist: boolean;
}

export interface Employee {
  id: string;
  country: string;
  workEmail: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  phoneNumber: string;
  gender?: GenderEnum | string;
  bankName?: string;
  bankId?: string;
  accountNumber?: string;
  salaryType?: SalaryTypeEnum | string;
  ibanAccountNumber?: string;
  swiftBIC?: string;
  bankAddress?: string;
  cryptoWalletAddress?: string;
  cryptoNetwork?: string;
  dob?: Date;
  employedAt?: Date;
  createdBy: string;
  isDeleted?: boolean;
  deletedAt?: Date;
  department?: string;
  currency: SupportedCurrencyEnum | string;
  swiftCode?: string;
  walletAddress?: string;
  organization: Organization | string;
  invitationSent?: boolean;
  salary?: number;
  // TODO: add Group Schema ID
  group?: Group;
  // TODO: add Tax State Schema ID
  taxState?: string;
  taxId?: string;
  // TODO: add Pension Fund Admin Schema ID
  pensionFundAdmin?: string;
  pensionId?: string;
  pensionContributionEnabled?: boolean;
  pensionContribution?: number;
  nhfId?: string;
  itfId?: string;
  nsitfId?: string;
  nhifId?: string;
  hasHealthAccessEnabled?: boolean;
  hasHealthAccessRemit?: boolean;
  healthReliefAmount?: number;
  hasHealthReliefEnabled?: boolean;
  hasSalaryBreakdown?: boolean;
  salaryBreakdown?: Record<string, number>;
  completionStatus?: EmployeeCompletionStatus | string;
  /** Virtuals */
  bonuses?: EmployeeSalaryAddon[];
  deductions?: EmployeeSalaryAddon[];
  biks?: string[];
  proratedSalaries?: string[];
}

export interface EmployeeSalaryAddon {
  id: string;
  name: string;
  employee: Employee | string;
  organization: Organization | string;
  amount: IMoney;
  frequency: SalaryAddonFrequencyEnum | string;
  type: SalaryAddonTypeEnum | string;
  mode?: BonusSalaryModeEnum | string;
  startDate?: Date;
  endDate?: Date;
  status?: SalaryAddonStatusEnum | string;
  createdBy: string;
  isDeleted?: boolean;
  deletedAt?: Date;
}

export interface Group {
  hasSalaryBreakdown?: boolean;
  salaryBreakdown?: Record<string, number>;
  remittances?: Record<string, Record<string, unknown>>;
}

export enum SalaryAddonFrequencyEnum {
  Once = 'once',
  Recurring = 'recurring',
}

export enum SalaryAddonTypeEnum {
  Bonus = 'bonus',
  Deduction = 'deduction',
  Protate = 'prorate',
}

export enum BonusSalaryModeEnum {
  Quick = 'quick',
  UnTaxed = 'untaxed',
  LeaveAllowance = 'leave-allowance',
  ExtraMonth = 'extra-month',
}

export enum SalaryAddonStatusEnum {
  Pending = 'pending',
  Processing = 'processing',
  Completed = 'completed',
}

export enum EmployeeCompletionStatus {
  Complete = 'All info complete',
  PendingPayment = 'Payment info pending',
  PendingStatutory = 'Statutory info pending',
}

export enum GenderEnum {
  Male = 'male',
  Female = 'female',
  Other = 'other',
}

export enum SalaryTypeEnum {
  Net = 'net',
  Gross = 'gross',
}

export enum SupportedCurrencyEnum {
  USD = 'usd',
  GBP = 'gbp',
  EUR = 'eur',
  USDT = 'usdt',
  NGN = 'ngn',
  GHS = 'ghs',
  KES = 'kes',
  RWF = 'rwf',
}
