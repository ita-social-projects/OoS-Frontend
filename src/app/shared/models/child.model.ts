import { ParentWithContactInfo } from './parent.model';
import { Person } from './user.model';
import { SocialGroup } from './socialGroup.model';

export class Child implements Person {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  gender: number;
  parentId?: number;
  socialGroups: SocialGroup[];
  placeOfLiving: string;
  parent: ParentWithContactInfo;
  isParent: boolean;

  constructor(info, parentId, id?) {
    this.id = id;
    this.firstName = info.firstName;
    this.lastName = info.lastName;
    this.middleName = info.middleName;
    this.dateOfBirth = info.dateOfBirth;
    this.gender = info.gender;
    this.socialGroups = info.socialGroups;
    this.parentId = parentId;
    this.placeOfLiving = info.placeOfLiving;
    this.isParent = info.isParent;
  }
}
export interface ChildCards {
  totalAmount: number;
  entities: Child[];
}
