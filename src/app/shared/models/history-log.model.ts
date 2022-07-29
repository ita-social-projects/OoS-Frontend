import {User} from "./user.model";

export interface Provider {
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

export interface ProviderList {
  totalAmount: number,
  entities: Provider[],
}

export interface ProviderAdmin {
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

export interface ProviderAdminList {
  totalAmount: number,
  entities: ProviderAdmin[],
}

export interface Application {
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

export interface ApplicationList {
  totalAmount: number,
  entities: Application[],
}
