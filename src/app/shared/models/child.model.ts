import { ParentWithContactInfo } from './parent.model';
import { Person } from './user.model';
export class Child implements Person {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: number;
  parentId?: number;
  socialGroupId: number;
  placeOfStudy: string;
  parent: ParentWithContactInfo;

  constructor(info, parentId, id?) {
    this.id = id;
    this.firstName = info.firstName;
    this.lastName = info.lastName;
    this.middleName = info.middleName;
    this.dateOfBirth = info.dateOfBirth;
    this.gender = info.gender;
    this.socialGroupId = info.socialGroupId ? info.socialGroupId : null;
    this.parentId = parentId;
    this.placeOfStudy = info.placeOfStudy;
  }
}
export interface ChildCards {
  totalAmount: number;
  entities: Child[];
}
