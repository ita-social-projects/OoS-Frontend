export class Teacher {
  id?: number;
  firstName: string;
  lastName: string;
  middleName: string;
  birthDay?: Date;
  description?: string;
  image?: string;

  constructor(info) {
    this.firstName = info.firstName;
    this.lastName = info.lastName;
    this.middleName = info.middleName;
    this.birthDay = info.birthDay;
    this.description = info.description;
  }
}