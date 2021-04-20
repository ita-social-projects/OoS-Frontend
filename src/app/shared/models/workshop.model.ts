import { Address } from './address.model';
import { Teacher } from './teacher.model';

export class Workshop {
  type: string;
  img: File[];
  title: string;
  phone: string;
  email: string;
  website: string;
  minAge: number;
  maxAge: number;
  daysPerWeek: number;
  photos: string;
  description: string;
  head: string;
  resources: string;
  direction: string;
  keyWords: string;
  price: number;
  address: Address;
  teachers: Teacher[];
  ownership: string;
  rate: string; //temp
  votes: string;


  constructor(about, description, address, teachers) {
    this.title = about.title;
    this.img = about.img;
    this.phone = about.phone;
    this.email = about.email;
    this.minAge = about.ageFrom;
    this.maxAge = about.ageTo;
    this.price = about.price;
    this.head = description.head;
    this.daysPerWeek = about.classAmount;
    this.photos = description.photos;
    this.description = description.description;
    this.description = description.head;
    this.address = address;
    this.teachers = teachers;
    this.price = about.price;
  }
}
