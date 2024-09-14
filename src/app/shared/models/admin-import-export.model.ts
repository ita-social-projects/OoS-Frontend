export interface EmailsEdrpous {
  edrpous: Object;
  emails: Object;
}

export interface EmailsEdrpousResponse {
  edrpous: number[];
  emails: number[];
}
export interface ValidProvider {
  id: number;
  directorsName: string;
  directorsSurname: string;
  providerName: string;
  ownership: string;
  identifier: number;
  licenseNumber: number;
  settlement: string;
  address: string;
  email: string;
  phoneNumber: number;
}

export interface Provider {
  directorsName: string;
  directorsSurname: string;
  providerName: string;
  ownership: string;
  identifier: number;
  licenseNumber: number;
  settlement: string;
  errors: ProviderValidationErrors;
  address: string;
  email: string;
  phoneNumber: number;
}
export interface ProviderId extends Provider {
  id: number;
}

export interface ProviderValidationErrors {
  directorsNameEmpty?: boolean;
  directorsSurnameEmpty?: boolean;
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
