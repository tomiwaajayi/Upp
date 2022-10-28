import {IMoney} from '../payment/money.interface';
import {Organization} from './organization.interface';

export class CheckEmployeeDTO {
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
  employeeExist: boolean;
}

export interface IRemitance {
  enabled: boolean;
  remit: boolean;
  useOrgsettings?: boolean;
  type?: string;
}

export interface IGroup {
  name: string;
  remittances?: Record<string, IRemitance>;
  useOrgSalaryBreakdown?: boolean;
  hasSalaryBreakdown?: boolean;
  salaryBreakdown?: Record<string, number>;
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
  group?: IGroup;
  taxState?: string;
  taxId?: string;
  pensionFundAdmin?: string;
  pensionId?: string;
  nhfId?: string;
  itfId?: string;
  nsitfId?: string;
  nhifId?: string;
  hasHealthAccessEnabled?: boolean;
  hasHealthAccessRemit?: boolean;
  healthReliefAmount?: number;
  hasHealthReliefEnabled?: boolean;
  hasSalaryBreakdown?: boolean;
  salaryBreakdown?: Map<string, number>;
  completionStatus?: EmployeeCompletionStatus | string;
  /** Virtuals */
  bonuses?: EmployeeSalaryAddon[];
  deductions?: EmployeeSalaryAddon[];
  biks?: string[];
  proratedSalaries?: string[];
}

export interface IEmployeeWithGroup {
  group: IGroup;
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
