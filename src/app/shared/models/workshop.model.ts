import { OwnershipTypes } from 'shared/enum/provider';
import { LicenseStatuses, ProviderStatuses } from 'shared/enum/statuses';
import { FormOfLearning, PayRateType, WorkshopOpenStatus } from 'shared/enum/workshop';
import { DateTimeRanges } from 'shared/models/working-hours.model';
import { Address } from './address.model';
import { Provider } from './provider.model';
import { PaginationParameters } from './query-parameters.model';
import { SectionItem } from './section-item.model';
import { Teacher } from './teacher.model';

export abstract class WorkshopBase {
  id?: string;
  title: string;
  phone: string;
  email: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  minAge: number;
  maxAge: number;
  dateTimeRanges: DateTimeRanges[];
  price: number;
  payRate: PayRateType;
  formOfLearning: FormOfLearning;
  availableSeats: number;
  competitiveSelection: boolean;
  competitiveSelectionDescription: string;
  workshopDescriptionItems: WorkshopDescriptionItem[];
  withDisabilityOptions: boolean;
  disabilityOptionsDesc: string;
  institutionId: string;
  institution: string;
  institutionHierarchyId: string;
  institutionHierarchy: string;
  directionIds: number[];
  keywords: string[];
  addressId: number;
  address: Address;
  teachers: Teacher[];
  providerId: string;
  providerTitle: string;
  providerLicenseStatus: LicenseStatuses;

  constructor(about: About, description: Description, address: Address, teachers: Teacher[], provider: Provider, id?: string) {
    this.title = about.title;
    this.phone = about.phone;
    this.email = about.email;
    this.minAge = about.minAge;
    this.maxAge = about.maxAge;
    this.dateTimeRanges = about.workingHours;
    this.price = about.price;
    this.payRate = about.payRate;
    this.formOfLearning = about.formOfLearning;
    this.availableSeats = about.availableSeats;
    this.competitiveSelection = about.competitiveSelection;
    this.competitiveSelectionDescription = about.competitiveSelectionDescription;
    this.workshopDescriptionItems = description.workshopDescriptionItems;
    this.withDisabilityOptions = Boolean(description.disabilityOptionsDesc);
    this.institutionId = description.institutionId;
    this.institutionHierarchyId = description.institutionHierarchyId;
    this.keywords = description.keyWords;
    this.addressId = address.id;
    this.address = address;
    this.teachers = teachers;
    this.providerId = provider.id;
    this.providerTitle = provider.fullTitle;

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
  }
}

export class Workshop extends WorkshopBase {
  takenSeats: number;
  rating: number;
  numberOfRatings: number;
  status: WorkshopOpenStatus;
  isBlocked: boolean;
  providerOwnership: OwnershipTypes;
  providerStatus: ProviderStatuses;
  coverImageId?: string;
  coverImage?: File;
  imageIds?: string[];
  imageFiles?: File[];

  constructor(about: About, description: Description, address: Address, teachers: Teacher[], provider: Provider, id?: string) {
    super(about, description, address, teachers, provider, id);

    if (about.coverImageId) {
      this.coverImageId = about.coverImageId[0];
    }
    if (about.coverImage) {
      this.coverImage = about.coverImage;
    }
    if (description.imageIds?.length) {
      this.imageIds = description.imageIds;
    }
    if (description.imageFiles?.length) {
      this.imageFiles = description.imageFiles;
    }
  }
}

export interface WorkshopTruncated {
  id?: string;
  title: string;
  providerTitle?: string;
  providerId: string;
}

export class WorkshopDescriptionItem extends SectionItem {
  workshopId?: string;

  constructor(info: { id?: string; sectionName: string; description: string; workshopId?: string }) {
    super(info);

    if (info.workshopId) {
      this.workshopId = info.workshopId;
    }
  }
}

export interface WorkshopBaseCard {
  workshopId: string;
  providerTitle: string;
  providerOwnership: OwnershipTypes;
  title: string;
  payRate: PayRateType;
  formOfLearning: FormOfLearning;
  coverImageId?: string;
  minAge: number;
  maxAge: number;
  competitiveSelection: boolean;
  price: number;
  directionIds: number[];
  providerId: string;
  address: Address;
  withDisabilityOptions: boolean;
  rating: number;
  numberOfRatings: number;
  providerLicenseStatus: LicenseStatuses;
}

export interface WorkshopCard extends WorkshopBaseCard {
  institutionHierarchyId: string;
  institutionId: string;
  institution: string;
  availableSeats: number;
  takenSeats: number;
  amountOfPendingApplications: number;
  status: WorkshopOpenStatus;
}

export interface WorkshopProviderViewCard extends WorkshopBaseCard {
  availableSeats: number;
  takenSeats: number;
  amountOfPendingApplications: number;
  status: WorkshopOpenStatus;
  unreadMessages: number;
}

export interface WorkshopStatus {
  workshopId: string;
  status: string;
}

export interface WorkshopStatusWithTitle extends WorkshopStatus {
  title: string;
}

export interface WorkshopCardParameters extends PaginationParameters {
  providerId: string;
}

interface About {
  title: string;
  phone: string;
  email: string;
  minAge: number;
  maxAge: number;
  workingHours: DateTimeRanges[];
  price: number;
  website?: string;
  facebook?: string;
  instagram?: string;
  payRate: PayRateType;
  formOfLearning: FormOfLearning;
  availableSeats: number;
  competitiveSelection: boolean;
  competitiveSelectionDescription: string;
  coverImageId?: string;
  coverImage?: File;
}

interface Description {
  workshopDescriptionItems: WorkshopDescriptionItem[];
  disabilityOptionsDesc?: string;
  institutionId: string;
  institutionHierarchyId: string;
  keyWords: string[];
  imageIds?: string[];
  imageFiles?: File[];
}
