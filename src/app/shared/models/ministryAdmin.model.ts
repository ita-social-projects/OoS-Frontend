export class MinistryAdmin {
  id?: string;
  email: string;
  phoneNumber: string;
  lastName: string;
  middleName?: string;
  firstName: string;
  accountStatus?: string;
  institutionId: string;
  gender?: number;
  institutionTitle?: string;

  constructor(info, institutionId, accountStatus?) {
    this.email = info.email;
    this.phoneNumber = info.phoneNumber;
    this.lastName = info.lastName;
    this.middleName = info.middleName;
    this.middleName = info.middleName;
    this.firstName = info.firstName;
    this.institutionId = institutionId;
    this.gender = info.gender;
    this.accountStatus = accountStatus;
    this.institutionTitle = info.institutionTitle;
  }
}
export interface AllMinistryAdmins{
  totalAmount: number;
  entities: MinistryAdmin[];
}
