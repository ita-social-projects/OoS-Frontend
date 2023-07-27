export interface Person {
  id?: string;
  lastName: string;
  middleName?: string;
  firstName: string;
}
export class User implements Person {
  isRegistered: boolean;
  lastName: string;
  middleName?: string;
  firstName: string;
  gender?: string;
  id: string;
  userName?: string;
  email?: string;
  phoneNumber?: string;
  role: string;
  dateOfBirth: string;

  constructor(info, id: string) {
    this.firstName = info.firstName;
    this.lastName = info.lastName;
    this.middleName = info.middleName;
    this.gender = info.gender;
    if (info.dateOfBirth) {
      this.dateOfBirth = info.dateOfBirth;
    }
    this.phoneNumber = info.phoneNumber;
    this.id = id;
  }
}
