import { PaginationParameters } from './query-parameters.model';
import { TechAdmin } from './tech-admin.model';
import { User } from './user.model';

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

export interface EmployeeHistory {
  employeeId: string;
  employeeFullName: string;
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

export interface ParentsBlockingByAdminHistory {
  parentFullName: string;
  operationDate: Date;
  isBlocked: string;
  reason: string;
  parentId: string;
  user: TechAdmin;
}

export interface FilterData extends PaginationParameters {
  dateFrom: string;
  dateTo: string;
  PropertyName?: string;
  ShowParents?: string;
  AdminType?: string;
  OperationType?: string;
}

export interface DropdownData {
  value: string;
  label: string;
}

export interface DateFilters {
  dateFrom: string;
  dateTo: string;
}
