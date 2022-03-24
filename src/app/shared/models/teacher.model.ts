export class Teacher {
  id?: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth?: Date | string;
  description?: string;
  image?: string;
  avatarImageId?: string;
  avatarImage?: File[];

  constructor(info) {
    this.firstName = info.firstName;
    this.lastName = info.lastName;
    this.middleName = info.middleName;
    this.dateOfBirth = new Date(info.dateOfBirth).toISOString();
    this.description = info.description;
    this.avatarImage = info.avatarImage[0];
    if (info.avatarImageId) {
      this.avatarImageId = info.avatarImageId;
    }
  }
}
