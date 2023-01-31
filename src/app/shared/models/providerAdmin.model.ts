import { PaginationParameters } from './queryParameters.model';
import { Person } from './user.model';

export interface ProviderAdminParameters extends PaginationParameters {
  deputyOnly: boolean;
  assistantsOnly: boolean;
  searchString?: string;
}

export interface ProviderAdminTable {
  id: string;
  pib: string;
  email: string;
  phoneNumber: string;
  isDeputy: boolean;
  status: string;
  role?: string;
}
export class ProviderAdmin implements Person {
  id?: string;
  userId?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  isDeputy: boolean;
  managedWorkshopIds?: string[];
  accountStatus?: string;
  returnUrl?: string;
  providerId?: string;

  constructor(info, isDebuty: boolean, userId?: string, workshopIds?: string[], providerId?: string, accountStatus?: string) {
    this.email = info.email;
    this.phoneNumber = info.phoneNumber;
    this.firstName = info.firstName;
    this.middleName = info.middleName;
    this.lastName = info.lastName;
    this.isDeputy = isDebuty;
    if (userId) {
      this.id = userId;
      this.userId = userId;
    }
    if (workshopIds?.length) {
      this.managedWorkshopIds = workshopIds;
    }
    if (providerId) {
      this.providerId = providerId;
    }
    this.accountStatus = accountStatus;
  }
}
