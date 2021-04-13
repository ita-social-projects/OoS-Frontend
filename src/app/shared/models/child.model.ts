
export class Child {
  firstName: string;
  lastName: string;
  secondName: string;
  birthDay: Date;
  type: Boolean;
  gender: string;

  
  constructor(info) {
    this.firstName = info.firstName;
    this.lastName= info.lastName;
    this.secondName= info.secondName;
    this.birthDay= info.birthDay;
    this.type = info.type;
    this.gender = info.gender;
  }
}

