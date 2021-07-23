import { Address } from "./address.model";
import { Provider } from "./provider.model";
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
  type?: number;
  keyWords?: string[];
  address: Address;
  teachers: Teacher[];
  ownership?: string;
  rating?: number;
  numberOfRatings?: number;
  votes?: string;
  placeAmount?: number;
  directionId?: number;
  departmentId?: number;
  classId?: number;
  providerId: number;
  providerTitle?: string;
  isPerMonth?: string;
  isCompetitiveSelection: boolean;
  competitiveSelectionDescription: string;

  constructor(about, description, address: Address, teachers: Teacher[], provider: Provider, id?: number) {
    this.id = id;
    this.title = about.title;
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
    this.withDisabilityOptions = Boolean(description.disabilityOptionsDesc);
    this.disabilityOptionsDesc = description.disabilityOptionsDesc;
    this.providerId = provider.id;
    this.type = about.type;
    this.providerTitle = provider.fullTitle;
    this.isPerMonth = about.isPerMonth;
    this.directionId = description.directionId;
    this.departmentId = description.departmentId;
    this.classId = description.classId;
    this.keyWords = description.keyWords;
  }
}

export interface WorkshopCard {
  address: Address;
  direction: string;
  isPerMonth: boolean;
  maxAge: number;
  minAge: number;
  //photo:
  price: number;
  providerId: number;
  providerTitle: string;
  rating: number;
  title: string;
  workshopId: number;
}
export interface WorkshopFilterCard {
  totalAmount: number,
  entities: WorkshopCard[]
}