export class Teacher {
    name:string;
    lastName:string;
    secondName:string;
    birthDate:string;
    description:string;
    img:string;
  
    constructor(info) {
      this.name = info.name;
      this.lastName= info.lastName;
      this.secondName= info.secondName;
      this.birthDate= info.birthDate;
      this.description= info.description;
      this.img= info.img;
    }
  }