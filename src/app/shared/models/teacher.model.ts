export class Teacher {
  id?: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth?: Date;
  description?: string;
  image?: string;
  avatarImageId?: string;
  avatarImage?: File[];

  constructor(info) {
    this.firstName = info.firstName;
    this.lastName = info.lastName;
    this.middleName = info.middleName;
    this.dateOfBirth = info.dateOfBirth;
    this.description = info.description;
    this.avatarImage = info.avatarImage;
    if (info.avatarImageId) {
      this.avatarImageId = info.avatarImageId;
    }
  }
}
