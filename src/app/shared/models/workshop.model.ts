import { Address } from "./address.model";
import { Teacher } from "./teacher.model";

export class Workshop {
  id: number;
  title: string;
  phone: string;
  email: string;
  website: string;
  facebook: string;
  instagram: string;
  minAge: number;
  maxAge: number;
  daysPerWeek: number;
  price: number;
  priceType: string;
  description: string;
  withDisabilityOptions: boolean;
  disabilityOptionsDesc: string;
  image: File[];
  head: string;
  headBirthDate: Date;
  category: {
    id: number;
    title: string;
    subcategories: [
      {
        id: number;
        title: string;
      }
    ]
  };
  type: string;
  keyWords: string;
  address: Address;
  teachers: Teacher[];
  ownership: string;
  rate: string;
  votes: string;

  constructor(about, description, address, teachers) {
    this.title = about.title;
    this.image = about.image;
    this.phone = about.phone;
    this.email = about.email;
    this.minAge = about.minAge;
    this.maxAge = about.maxAge;
    this.price = about.price;
    this.head = description.head;
    this.daysPerWeek = about.daysPerWeek;
    this.description = description.description;
    this.address = address;
    this.teachers = teachers;
    this.website = about.website;
    this.facebook = about.facebook;
    this.instagram = about.instagram;
    this.withDisabilityOptions = description.withDisabilityOptions;
    this.disabilityOptionsDesc = description.disabilityOptionsDesc;
    this.category = description.category;
  }
}
