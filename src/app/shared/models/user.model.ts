export class User {
  isRegistered: boolean;
  lastName?: string;
  middleName?: string;
  firstName?: string;
  id: string;
  userName?: string;
  email?: string;
  phoneNumber?: string;
  role: string;

  constructor(info, id?: string) {
    this.id = info.id;
    this.firstName = info.firstName;
    this.lastName = info.lastName;
    this.middleName = info.middleName;
    this.phoneNumber = info.phoneNumber;
    this.id = id;
  }
}
