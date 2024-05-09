export interface IEmailsEdrpous {
  edrpous: Object;
  emails: Object;
}

export interface IEmailsEdrpousResponse {
  edrpous: number[];
  emails: number[];
}

export interface IProviders {
  providerName?: string;
  ownership?: string;
  identifier?: string;
  licenseNumber?: number;
  settlement?: string;
  errors?: IErrors;
  address?: string;
  email?: string;
  phoneNumber?: number;
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

export interface IProvidersID extends IProviders {
  elem: {};
  id: number;
}
