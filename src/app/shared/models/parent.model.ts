export class Parent {
  firstName: string;
  secondName: string;
  patronymic: string;
  birthDay: Date;
  gender: string;
  phone: string;
  email: string;

  constructor(info) {
    this.firstName = info.firstName;
    this.secondName = info.lastName;
    this.patronymic = info.secondName;
    this.birthDay = info.birthDay;
    this.gender = info.gender;
  }
}
