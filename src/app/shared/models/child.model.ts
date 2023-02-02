import { ParentWithContactInfo } from './parent.model';
import { DataItem } from './item.model';
import { Person } from './user.model';

export class Child implements Person {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: number;
  parentId?: number;
  isParent: boolean;
  socialGroups: DataItem[];
  placeOfLiving: string;
  parent: ParentWithContactInfo;

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

export interface ChildrenParameters {
  isParent?: boolean;
  searchString?: string;
  from?: number;
  size?: number;
}
export interface RequestParams {
  id: string;
  isParent: boolean;
}
