import { Direction } from 'src/app/shared/models/category.model';
import { Address } from './address.model';
import { Provider } from './provider.model';
import { SectionItem } from './sectionItem.model';
import { Teacher } from './teacher.model';
import { DateTimeRanges } from './workingHours.model';
export class Workshop {
  id?: string;
  title: string;
  phone: string;
  email: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  minAge: number;
  maxAge: number;
  price: number;
  withDisabilityOptions?: boolean;
  disabilityOptionsDesc?: string;
  keywords?: string[];
  address: Address;
  teachers: Teacher[];
  rating?: number;
  numberOfRatings?: number;
  directionId?: number;//TODO: remove
  direction: string;
  directions: Direction[];
  departmentId?: number;//TODO: remove
  classId?: number;//TODO: remove
  providerId: string;
  providerTitle?: string;
  payRate?: string;
  isCompetitiveSelection: boolean;
  competitiveSelectionDescription: string;
  logo: string;
  dateTimeRanges: DateTimeRanges[];
  imageFiles?: File[];
  imageIds?: string[];
  coverImage?: File[];
  coverImageId?: string[];
  institutionHierarchyId: string;
  institutionId: string;
  workshopDescriptionItems: WorkshopSectionItem[];

  constructor(about, description, address: Address, teachers: Teacher[], provider: Provider, id?: string) {
    this.title = about.title;
    this.phone = about.phone;
    this.email = about.email;
    this.minAge = about.minAge;
    this.maxAge = about.maxAge;
    this.price = about.price;
    this.address = address;
    this.teachers = teachers;
    this.withDisabilityOptions = Boolean(description.disabilityOptionsDesc);
    this.providerId = provider.id;
    this.providerTitle = provider.fullTitle;
    this.payRate = about.payRate;
    this.directionId = 1;//TODO: remove
    this.departmentId = 1;//TODO: remove
    this.classId = 1;//TODO: remove
    this.keywords = description.keyWords;
    this.dateTimeRanges = about.workingHours;
    this.institutionHierarchyId = description.institutionHierarchyId;
    this.institutionId = description.institutionId;
    if (id) {
      this.id = id;
    }
    if (about.facebook) {
      this.facebook = about.facebook;
    }
    if (about.website) {
      this.website = about.website;
    }
    if (about.instagram) {
      this.instagram = about.instagram;
    }
    if (description.disabilityOptionsDesc) {
      this.disabilityOptionsDesc = description.disabilityOptionsDesc;
    }
    if (description.imageFiles?.length) {
      this.imageFiles = description.imageFiles;
    }
    if (description.imageIds?.length) {
      this.imageIds = description.imageIds;
    }
    if (about.coverImage?.length) {
      this.coverImage = about.coverImage;
    }
    if (about.coverImageId?.length) {
      this.coverImageId = about.coverImageId[0];
    }
    this.workshopDescriptionItems = description.workshopDescriptionItems;
  }
}

export class WorkshopSectionItem extends SectionItem {
  workshopId?: string;

  constructor(info) {
    super(info);

    if (info.workshopId) {
      this.workshopId = info.workshopId;
    }
  }
}
export interface WorkshopCard {
  address: Address;
  payRate: string;
  maxAge: number;
  minAge: number;
  photo?: string;
  price: number;
  providerId: string;
  providerTitle: string;
  providerOwnership: string;
  rating: number;
  title: string;
  workshopId: string;
  coverImageId?: string;
  directionsId: number[];
}
export interface WorkshopFilterCard {
  totalAmount: number;
  entities: WorkshopCard[];
}