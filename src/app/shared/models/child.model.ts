import { Parent } from "./parent.model";
export class Child {
  id: null;
  firstName: string;
  lastName: string;
  middleName: string;
  dateOfBirth: string;
  type: Boolean;
  gender: number;
  parent?: Parent;
  socialGroupId: number;

  constructor(info) {
    this.firstName = info.firstName;
    this.lastName = info.lastName;
    this.middleName = info.middleName;
    this.dateOfBirth = "2021-04-27";
    this.gender = 0;
    this.socialGroupId = 0;
  }
}
