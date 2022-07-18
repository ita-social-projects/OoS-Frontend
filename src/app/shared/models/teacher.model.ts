import { Person } from "./user.model";
export class Teacher implements Person {
  id?: string;
  workshopId?: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth?: Date | string;
  description?: string;
  coverImageId?: string[];
  coverImage?: File[];

  constructor(info) {
    this.firstName = info.firstName;
    this.lastName = info.lastName;
    this.middleName = info.middleName;
    this.dateOfBirth = new Date(info.dateOfBirth).toISOString();
    this.description = info.description;
    if (info.id) {
      this.id = info.id;
    }
    if (info.coverImage?.length) {
      this.coverImage = info.coverImage[0];
    }
    if (info.coverImageId?.length) {
      this.coverImageId = info.coverImageId[0];
    }
  }
}
