import { Address } from "./address.model";
import { Category, Subcategory, Subsubcategory } from "./category.model";
import { Teacher } from "./teacher.model";

export class Workshop {
  id?: number;
  title: string;
  phone: string;
  email: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  minAge: number;
  maxAge: number;
  daysPerWeek: number;
  price: number;
  priceType?: string;
  description: string;
  withDisabilityOptions?: boolean;
  disabilityOptionsDesc?: string;
  image?: File[];
  head: string;
  headBirthDate?: Date;
  type?: string;
  keyWords?: string;
  address: Address;
  teachers: Teacher[];
  ownership?: string;
  rate?: string;
  votes?: string;
  placeAmount?: number;
  categoryId?: number;
  subcategoryId?: number;
  subsubcategoryId?: number;
  category?: Category;
  subcategory?: Subcategory;
  subsubcategory?: Subsubcategory;

  constructor(about, description, addr, tchrs) {
    this.title = about.title;
    this.phone = about.phone;
    this.email = about.email;
    this.minAge = about.minAge;
    this.maxAge = about.maxAge;
    this.price = about.price;
    this.head = description.head;
    this.daysPerWeek = about.daysPerWeek;
    this.description = description.description;
    this.address = addr;
    this.teachers = tchrs;
    this.website = about.website;
    this.facebook = about.facebook;
    this.instagram = about.instagram;
    this.withDisabilityOptions = description.withDisabilityOptions;
    this.disabilityOptionsDesc = description.disabilityOptionsDesc;
    this.category = description.category;
    this.categoryId = description.category.id;

    this.subcategory = description.subcategory;
    this.subcategoryId = description.subcategoryId;

    this.subsubcategory = description.subcategory;
    this.subsubcategoryId = description.subsubcategory.id;
  }
}
