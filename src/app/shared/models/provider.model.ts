import { InstitutionTypes, OwnershipTypes } from '../enum/provider';
import { LicenseStatuses, ProviderStatuses } from '../enum/statuses';
import { Address } from './address.model';
import { Institution } from './institution.model';
import { DataItem } from './item.model';
import { PaginationParameters } from './queryParameters.model';
import { SectionItem } from './sectionItem.model';
import { User } from './user.model';

export abstract class ProviderBase {
  id?: string;
  fullTitle: string;
  shortTitle: string;
  email: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  edrpouIpn: string;
  director: string;
  directorDateOfBirth: string | Date;
  phoneNumber: string;
  founder: string;
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
  legalAddress: Address;
  actualAddress?: Address;
  institutionStatusId?: number;
  institutionId?: string;
  institution: Institution;
  institutionType: InstitutionTypes;
  providerSectionItems: ProviderSectionItem[];

  constructor(info, legalAddress: Address, actualAddress: Address, description, user: User, provider?: Provider) {
    this.fullTitle = info.fullTitle;
    this.shortTitle = info.shortTitle;
    this.email = info.email;
    this.website = description.website;
    this.facebook = description.facebook;
    this.instagram = description.instagram;
    this.edrpouIpn = info.edrpouIpn;
    this.director = info.director;
    this.directorDateOfBirth = new Date(info.directorDateOfBirth).toISOString();
    this.phoneNumber = info.phoneNumber;
    this.founder = info.founder;
    this.typeId = info.typeId;
    this.userId = user.id;
    this.legalAddress = legalAddress;
    this.actualAddress = actualAddress;
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
    const formNames = ['legalAddress', 'actualAddress', 'imageIds', 'providerSectionItems'];
    const imageFiles = ['imageFiles', 'coverImage'];

    Object.keys(provider).forEach((key: string) => {
      if (imageFiles.includes(key)) {
        provider[key].forEach((file: File) => formData.append(key, file));
      } else if (formNames.includes(key)) {
        formData.append(key, JSON.stringify(provider[key]));
      } else {
        formData.append(key, provider[key]);
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

  constructor(info, legalAddress: Address, actualAddress: Address, description, user: User, provider?: Provider) {
    super(info, legalAddress, actualAddress, description, user, provider);

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

  constructor(info) {
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
  institutionId?: string;
  catottgId?: string;
}
