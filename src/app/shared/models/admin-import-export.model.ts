export interface EmailsEdrpous {
  edrpous: Object;
  emails: Object;
}

export interface EmailsEdrpousResponse {
  edrpous: number[];
  emails: number[];
}

export interface Providers {
  providerName: string;
  ownership: string;
  identifier: number;
  licenseNumber: number;
  settlement: string;
  errors: IErrors;
  address: string;
  email: string;
  phoneNumber: number;
}
export interface ProvidersID extends Providers {
  id: number;
}
export interface IErrors {
  providerNameEmpty?: boolean;
  providerNameLength?: boolean;
  ownershipEmpty?: boolean;
  identifierEmpty?: boolean;
  identifierFormat?: boolean;
  identifierDuplicate?: boolean;
  licenseNumberEmpty?: boolean;
  settlementEmpty?: boolean;
  settlementLength?: boolean;
  settlementLanguage?: boolean;
  addressEmpty?: boolean;
  addressLanguage?: boolean;
  emailEmpty?: boolean;
  emailFormat?: boolean;
  emailDuplicate?: boolean;
  phoneNumberEmpty?: boolean;
  phoneNumberFormat?: boolean;
}
