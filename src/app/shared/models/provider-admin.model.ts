import { TruncatedItem } from './item.model';
import { PaginationParameters } from './query-parameters.model';
import { Person } from './user.model';

export interface ProviderAdminParameters extends PaginationParameters {
  deputyOnly: boolean;
  assistantsOnly: boolean;
  searchString?: string;
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
  workshopTitles?: TruncatedItem[];

  constructor(
    info: Partial<ProviderAdmin>,
    isDebuty: boolean,
    userId?: string,
    workshopIds?: string[],
    providerId?: string,
    accountStatus?: string
  ) {
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
