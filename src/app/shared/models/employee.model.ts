import { TruncatedItem } from './item.model';
import { PaginationParameters } from './query-parameters.model';
import { Person } from './user.model';

export interface EmployeeParameters extends PaginationParameters {
  searchString?: string;
}

export class Employee implements Person {
  id?: string;
  userId?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  managedWorkshopIds?: string[];
  accountStatus?: string;
  returnUrl?: string;
  providerId?: string;
  workshopTitles?: TruncatedItem[];

  constructor(info: Partial<Employee>, userId?: string, workshopIds?: string[], providerId?: string, accountStatus?: string) {
    this.email = info.email;
    this.phoneNumber = info.phoneNumber;
    this.firstName = info.firstName;
    this.middleName = info.middleName;
    this.lastName = info.lastName;
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
