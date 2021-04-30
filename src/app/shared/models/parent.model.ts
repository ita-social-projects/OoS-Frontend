export class Parent {
  firstName: string;
  lastName: string;
  secondName: string;
  birthDay: Date;
  gender: string;
  phone: string;
  email: string;

  constructor(info) {
    this.firstName = info.firstName;
    this.lastName = info.lastName;
    this.secondName = info.secondName;
    this.birthDay = info.birthDay;
    this.gender = info.gender;
  }
}
