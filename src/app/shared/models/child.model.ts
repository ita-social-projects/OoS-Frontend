
export class Child {
  firstName:string;
  surname:string;
  lastName:string;
  birthDay:Date;

  
  constructor(info) {
    this.firstName = info.firstName;
    this.surname= info.surname;
    this.lastName= info.lasteName;
    this.birthDay= info.birthDay;
  }
}

