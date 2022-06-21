export class Teacher {
  id?: string;
  workshopId?: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth?: Date | string;
  description?: string;
  avatarImageId?: string[];
  avatarImage?: File[];

  constructor(info) {
    this.firstName = info.firstName;
    this.lastName = info.lastName;
    this.middleName = info.middleName;
    this.dateOfBirth = new Date(info.dateOfBirth).toISOString();
    this.description = info.description;
    if (info.id) {
      this.id = info.id;
    }
    if (info.avatarImage?.length) {
      this.avatarImage = info.avatarImage[0];
    }
    if (info.avatarImageId?.length) {
      this.avatarImageId = info.avatarImageId[0];
    }
  }
}
