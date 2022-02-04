export class Teacher {
  id?: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth?: Date;
  description?: string;
  image?: string;

  constructor(info) {
    this.firstName = info.firstName;
    this.lastName = info.lastName;
    this.middleName = info.middleName;
    this.dateOfBirth = info.dateOfBirth;
    this.description = info.description;
  }
}
