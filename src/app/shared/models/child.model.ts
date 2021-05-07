import { Parent } from "./parent.model";
export class Child {
  firstName: string;
  lastName: string;
  secondName: string;
  patronymic: string;
  birthDay: string;
  type: Boolean;
  gender: number;
  parent?: Parent;
  socialGroupId: number;

  constructor(info) {
    this.firstName = info.firstName;
    this.lastName = info.lastName;
    this.patronymic = info.second;
    this.birthDay = "2021-04-27";
    this.gender = 0;
    this.socialGroupId = 0;
  }
}
