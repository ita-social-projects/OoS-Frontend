export class Workshop {
  type:string;
  title:string;
  phone:number;
  email:string;
  website:string;
  age:{
      from:number;
      to:number;
  }
  classAmount:number;

  constructor(type, title, phone,email, ageFrom, ageTo, classAmount) {
    this.type = type;
    this.title = title;
    this.phone=phone;
    this.email=email;
    this.age.from=ageFrom;
    this.age.to=ageTo;
    this.classAmount=classAmount;
  }
}