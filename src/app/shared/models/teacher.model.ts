import { Person } from './user.model';

export class Teacher implements Person {
  id?: string;
  workshopId?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  gender: number;
  dateOfBirth?: Date | string;
  description?: string;
  coverImageId?: string[] | string;
  coverImage?: File[] | File;

  constructor(info: Partial<Teacher>) {
    this.firstName = info.firstName;
    this.lastName = info.lastName;
    this.middleName = info.middleName;
    this.gender = info.gender;
    this.dateOfBirth = new Date(info.dateOfBirth).toISOString();
    this.description = info.description;
    if (info.id) {
      this.id = info.id;
    }
    if ((info.coverImage as File[])?.length) {
      this.coverImage = info.coverImage[0];
    }
    if (info.coverImageId?.length) {
      this.coverImageId = info.coverImageId[0];
    }
  }
}
