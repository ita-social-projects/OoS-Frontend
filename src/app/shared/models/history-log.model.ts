import {User} from './user.model';

export interface ProviderHistory {
  fieldName: string;
  oldValue: string;
  newValue: string;
  updatedDate: string;
  user: User;
  institutionTitle: string;
  providerId: string;
  providerTitle: string;
  providerCity: string;
}

export interface ProviderAdminHistory {
  providerAdminId: string;
  providerAdminFullName: string;
  providerTitle: string;
  workshopTitle: string;
  workshopCity: string;
  operationType: string;
  operationDate: string;
  user: User;
  institutionTitle: string;
}

export interface ApplicationHistory {
  fieldName: string;
  oldValue: string;
  newValue: string;
  updatedDate: string;
  user: User;
  institutionTitle: string;
  applicationId: string;
  workshopTitle: string;
  workshopCity: string;
  providerTitle: string;
}

export interface FilterData {
  dateFrom: string;
  dateTo: string;
  options: string;
}

export interface DropdownData {
  value: string;
  label: string;
}
