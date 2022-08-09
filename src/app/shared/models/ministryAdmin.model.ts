export class MinistryAdmin {
  id?: string;
  email?: string;
  phoneNumber?: string;
  lastName?: string;
  middleName?: string;
  firstName?: string;
  accountStatus?: string;
  institutionId?: string;
  gender?: number;
  institutionTitle?: string;

  constructor(info,institutionId?,institutionTitle?, accountStatus?,) {
    this.email = info.email;
    this.phoneNumber = info.phoneNumber;
    this.lastName = info.lastName;
    this.middleName = info.middleName;
    this.middleName = info.middleName;
    this.firstName = info.firstName;
    this.institutionId = institutionId;
    this.gender = info.gender;
    this.institutionTitle = institutionTitle;
    this.accountStatus = accountStatus;
  }
}
