import { Address } from "./address.model";
import { Teacher } from "./teacher.model";

export class Workshop {
  type:string;
  title:string;
  phone:string;
  email:string;
  website:string;
  minAge:number;
  maxAge:number;
  daysPerWeek:number;
  photos:string;
  description:string;
  head:string;
  resources:string;
  direction:string;
  keyWords:string;
  price:number;
  address:Address;
  teachers:Teacher[];

  constructor(about, description, address, teachers) {
    //this.type = about.type;
    this.title = about.title;
    this.phone= about.phone;
    this.email= about.email;
    this.minAge= about.ageFrom;
    this.maxAge= about.ageTo;
    this.daysPerWeek= about.classAmount;
    this.photos=description.photos;
    this.description=description.description;
    this.description=description.head;
    this.address=address;
    this.teachers=teachers;
    this.price=200;
  }
}