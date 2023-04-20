import { DataItem } from './item.model';
import { ParentWithContactInfo } from './parent.model';
import { PaginationParameters } from './queryParameters.model';
import { Person } from './user.model';

export class Child implements Person {
  id?: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  dateOfBirth: string;
  gender: number;
  parentId: string;
  isParent: boolean;
  socialGroups?: DataItem[];
  socialGroupIds?: number[] = [];
  placeOfStudy: string;
  parent?: ParentWithContactInfo;

  constructor(childFormValue, parentId: string, id?: string) {
    this.id = id;
    this.firstName = childFormValue.firstName;
    this.lastName = childFormValue.lastName;
    this.middleName = childFormValue.middleName;
    this.dateOfBirth = childFormValue.dateOfBirth;
    this.gender = childFormValue.gender;
    this.socialGroupIds = childFormValue.socialGroups.map((item: DataItem) => item.id);
    this.parentId = parentId;
    this.placeOfStudy = childFormValue.placeOfStudy;
    this.isParent = childFormValue.isParent || false;
  }
}

export interface ChildrenParameters extends PaginationParameters {
  isParent?: boolean;
  isGetParent?: boolean;
  searchString?: string;
}
export interface RequestParams {
  id: string;
  isParent: boolean;
}
