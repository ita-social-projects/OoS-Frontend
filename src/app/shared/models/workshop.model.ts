import { Address } from "./address.model";
import { Provider } from "./provider.model";
import { Teacher } from "./teacher.model";
import { DateTimeRanges } from "./workingHours.model";
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
  price: number;
  description: string;
  withDisabilityOptions?: boolean;
  disabilityOptionsDesc?: string;
  image?: File[];
  head: string;
  headDateOfBirth?: Date;
  keywords?: string[];
  address: Address;
  teachers: Teacher[];
  rating?: number;
  numberOfRatings?: number;
  directionId?: number;
  direction: string;
  departmentId?: number;
  classId?: number;
  providerId: number;
  providerTitle?: string;
  isPerMonth?: string;
  isCompetitiveSelection: boolean;
  competitiveSelectionDescription: string;
  logo: string;
  dateTimeRanges: DateTimeRanges[];

  constructor(about, description, address: Address, teachers: Teacher[], provider: Provider, id?: number) {
    this.id = id;
    this.title = about.title;
    this.phone = about.phone;
    this.email = about.email;
    this.minAge = about.minAge;
    this.maxAge = about.maxAge;
    this.price = about.price;
    this.head = description.head;
    this.description = description.description;
    this.address = address;
    this.teachers = teachers;
    this.website = about.website;
    this.facebook = about.facebook;
    this.instagram = about.instagram;
    this.withDisabilityOptions = Boolean(description.disabilityOptionsDesc);
    this.disabilityOptionsDesc = description.disabilityOptionsDesc;
    this.providerId = provider.id;
    this.providerTitle = provider.fullTitle;
    this.isPerMonth = about.isPerMonth;
    this.directionId = description.categories.directionId.id;
    this.departmentId = description.categories.departmentId.id;
    this.classId = description.categories.classId.id;
    this.keywords = description.keyWords;
    this.dateTimeRanges = about.workingHours;
  }
}

export interface WorkshopCard {
  address: Address;
  direction: string;
  isPerMonth: boolean;
  maxAge: number;
  minAge: number;
  photo?: string;
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
