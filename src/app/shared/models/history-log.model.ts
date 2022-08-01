import {User} from "./user.model";

export interface ProviderHistory {
  fieldName: string,
  oldValue: string,
  newValue: string,
  updatedDate: string,
  user: User,
  institutionTitle: string,
  providerId: string,
  providerTitle: string,
  providerCity: string
}

export interface ProvidersHistory {
  totalAmount: number,
  entities: ProviderHistory[],
}

export interface ProviderAdminHistory {
  providerAdminId: string,
  providerAdminFullName: string,
  providerTitle: string,
  workshopTitle: string,
  workshopCity: string,
  operationType: string,
  operationDate: string,
  user: User,
  institutionTitle: string
}

export interface ProviderAdminsHistory {
  totalAmount: number,
  entities: ProviderAdminHistory[],
}

export interface ApplicationHistory {
  fieldName: string,
  oldValue: string,
  newValue: string,
  updatedDate: string,
  user: User,
  institutionTitle: string,
  applicationId: string,
  workshopTitle: string,
  workshopCity: string,
  providerTitle: string
}

export interface ApplicationsHistory {
  totalAmount: number,
  entities: ApplicationHistory[],
}
