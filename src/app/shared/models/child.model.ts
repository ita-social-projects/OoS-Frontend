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
  birthCertificate?: {
    id: number;
    svidSer: string,
    svidNum: string,
    svidNumMD5: string,
    svidWho: string,
    svidDate: string,
    childId: number;
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
  }
}
