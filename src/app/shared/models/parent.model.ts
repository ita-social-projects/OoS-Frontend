export class Parent {
  id: number;
  userId: number;
  firstName: string;
  lastName: string;
  middleName: string;
  birthDay: Date;
  gender: string;
  phone: string;
  email: string;

  constructor(info) {
    this.userId = info.userId;
    this.firstName = info.firstName;
    this.lastName = info.lastName;
    this.middleName = info.secondName;
    this.birthDay = info.birthDay;
    this.gender = info.gender;
  }
}
