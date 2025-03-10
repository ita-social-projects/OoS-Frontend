import { Person } from './user.model';

export class Judge implements Person {
  id?: string;
  competitiveEventId?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: string;
  description?: string;
  isChiefJudge: boolean;
  coverImageId: string;

  constructor(info: Partial<Judge>) {
    this.firstName = info.firstName;
    this.lastName = info.lastName;
    this.middleName = info.middleName;
    this.description = info.description;
    this.dateOfBirth = info.dateOfBirth;
    this.gender = info.gender;
    this.description = info.description;
    this.isChiefJudge = info.isChiefJudge;
    this.coverImageId = info.coverImageId;
    if (info.id) {
      this.id = info.id;
    }
  }
}
