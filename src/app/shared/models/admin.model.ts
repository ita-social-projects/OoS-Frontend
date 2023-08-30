import { PaginationParameters } from './queryParameters.model';

export class BaseAdmin {
  id?: string;
  email: string;
  phoneNumber: string;
  lastName: string;
  middleName?: string;
  firstName: string;
  accountStatus?: string;
  institutionId: string;
  institutionTitle?: string;
  catottgName?: string;

  constructor(info, institutionId: string, id?: string, accountStatus?: string) {
    this.email = info.email;
    this.phoneNumber = info.phoneNumber;
    this.lastName = info.lastName;
    this.middleName = info.middleName;
    this.firstName = info.firstName;
    this.institutionId = institutionId;
    this.institutionTitle = info.institutionTitle;
    this.catottgName = info.catottgName;
    if (id) {
      this.id = id;
    }
    if (accountStatus) {
      this.accountStatus = accountStatus;
    }
  }
}

export interface BaseAdminParameters extends PaginationParameters {
  tabTitle?: string;
  searchString?: string;
}

export interface BaseAdminBlockData {
  adminId: string;
  isBlocked: boolean;
}
