import { InstitutionTypes, OwnershipTypes } from 'shared/enum/provider';
import { LicenseStatuses, ProviderStatuses } from 'shared/enum/statuses';
import { Institution } from './institution.model';
import { DataItem } from './item.model';
import { PaginationParameters } from './query-parameters.model';
import { SectionItem } from './section-item.model';
import { User } from './user.model';
import { Contacts } from './workshop.model';

export abstract class ProviderBase {
  id?: string;
  fullTitle: string;
  shortTitle: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  edrpou: string;
  typeId?: number;
  type?: DataItem;
  status: ProviderStatuses;
  statusReason?: string;
  license?: string;
  licenseStatus?: LicenseStatuses;
  coverImageId?: string;
  coverImage?: File;
  imageIds?: string[];
  imageFiles?: File[];
  userId: string; // TODO: Remove as soon as it will be removed from the backend
  contacts: Contacts[];
  institutionStatusId?: number;
  institutionId?: string;
  institution: Institution;
  institutionType: InstitutionTypes;
  providerSectionItems: ProviderSectionItem[];

  constructor(info: Partial<ProviderBase>, contacts: Contacts[], description: Partial<ProviderBase>, user: User, provider?: Provider) {
    this.fullTitle = info.fullTitle;
    this.shortTitle = info.shortTitle;
    this.website = description.website;
    this.facebook = description.facebook;
    this.instagram = description.instagram;
    this.edrpou = info.edrpou;
    this.typeId = info.typeId;
    this.userId = user.id;
    this.contacts = contacts;
    this.institutionId = info.institution.id;
    this.institution = info.institution;
    this.institutionType = info.institutionType;
    this.providerSectionItems = description.providerSectionItems;

    if (provider?.id) {
      this.id = provider.id;
    }
    if (info.license) {
      this.license = info.license;
    }
    if (description.imageIds?.length) {
      this.imageIds = description.imageIds;
    }
    if (description.imageFiles?.length) {
      this.imageFiles = description.imageFiles;
    }
    if (info.institutionStatusId) {
      this.institutionStatusId = info.institutionStatusId;
    }
  }

  static createFormData(provider: Provider): FormData {
    const formData = new FormData();
    const formNames = ['imageIds', 'providerSectionItems', 'contacts'];
    const imageFiles = ['imageFiles', 'coverImage'];

    Object.keys(provider).forEach((key: string) => {
      if (provider[key]) {
        if (imageFiles.includes(key)) {
          provider[key].forEach((file: File) => formData.append(key, file));
        } else if (formNames.includes(key)) {
          formData.append(key, JSON.stringify(provider[key]));
        } else {
          formData.append(key, provider[key]);
        }
      }
    });

    return formData;
  }
}

export class Provider extends ProviderBase {
  ownership: OwnershipTypes;
  isBlocked?: boolean;
  blockReason?: string;
  rating?: number;
  numberOfRatings?: number;
  blockPhoneNumber?: string;

  constructor(info: Partial<Provider>, contacts: Contacts[], description: Partial<Provider>, user: User, provider?: Provider) {
    super(info, contacts, description, user, provider);

    this.ownership = info.ownership;
    if (provider?.isBlocked) {
      this.isBlocked = provider.isBlocked;
    }
    if (provider?.blockReason) {
      this.blockReason = provider.blockReason;
    }
    if (provider?.blockPhoneNumber) {
      this.blockPhoneNumber = provider.blockPhoneNumber;
    }
    if (provider?.rating) {
      this.rating = provider.rating;
    }
    if (provider?.numberOfRatings) {
      this.numberOfRatings = provider.numberOfRatings;
    }
  }
}

export interface ProviderBlock {
  id: string;
  isBlocked: boolean;
  blockPhoneNumber?: string;
  blockReason?: string;
}

export class ProviderSectionItem extends SectionItem {
  providerId?: string;

  constructor(info: ProviderSectionItem) {
    super(info);

    if (info.providerId) {
      this.providerId = info.providerId;
    }
  }
}

export class ProviderWithStatus {
  providerId: string;
  status: ProviderStatuses;
  statusReason?: string;

  constructor(providerId: string, status: ProviderStatuses, statusReason?: string) {
    this.providerId = providerId;
    this.status = status;

    if (statusReason) {
      this.statusReason = statusReason;
    }
  }
}

export interface ProviderWithLicenseStatus {
  providerId: string;
  licenseStatus: LicenseStatuses;
}

export interface ProviderParameters extends PaginationParameters {
  searchString?: string;
  providerId?: string;
  excludedWorkshopId?: string;
  excludedCompetitionId?: string;
  institutionId?: string;
  catottgId?: string;
}
