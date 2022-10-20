export class MinistryAdmin {
  id?: string;
  email: string;
  phoneNumber: string;
  lastName: string;
  middleName?: string;
  firstName: string;
  accountStatus?: string;
  institutionId: string;
  institutionTitle?: string;

  constructor(info, institutionId: string, id?: string, accountStatus?: string) {
    this.email = info.email;
    this.phoneNumber = info.phoneNumber;
    this.lastName = info.lastName;
    this.middleName = info.middleName;
    this.firstName = info.firstName;
    this.institutionId = institutionId;
    this.institutionTitle = info.institutionTitle;
    if (id) {
      this.id = id;
    }
    if (accountStatus) {
      this.accountStatus = accountStatus;
    }
  }
}

export interface MinistryAdminParameters {
  tabTitle?: string;
  searchString?: string;
  from?: number;
  size?: number;
}
