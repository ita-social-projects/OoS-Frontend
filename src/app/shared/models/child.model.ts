import { Parent } from "./parent.model";
export class Child {
  id: number;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: number;
  parentId?: number;
  socialGroupId: number;
  placeOfStudy: string;
  parent: {
    id: 0,
    userId: Parent;
  }

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
  totalAmount: number,
  entities: Child[]
}