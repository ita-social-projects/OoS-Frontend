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
  faculty:string;
  study:string;
  keyWords:string;
  price:number;
  address:Address;
  teachers:Teacher[];

  constructor(about, description, select, address, teachers) {
    this.type = about.type;
    this.title = about.title;
    this.phone= about.phone;
    this.email= about.email;
    this.minAge = about.ageFrom;
    this.maxAge = about.ageTo;
    this.price = 200;
    this.head = description.head;
    this.daysPerWeek = about.classAmount;
    this.photos = description.photos;
    this.description = description.description;
    this.direction = select.direction;
    this.faculty = select.faculty;
    this.study = select.study;
    this.head = description.head;
    this.address = address;
    this.teachers = teachers;
  }
}