import { Institution } from './institution.model';
import { Address } from './address.model';
import { User } from './user.model';
import { SectionItem } from './sectionItem.model';
import { LicenseStatuses, ProviderStatuses } from '../enum/statuses';
import { DataItem } from './item.model';
import { InstitutionTypes, OwnershipTypes } from '../enum/provider';

export class Provider {
  id: string;
  fullTitle: string;
  shortTitle: string;
  website?: string;
  facebook?: string;
  instagram?: string;
  email: string;
  edrpouIpn: string;
  director: string;
  directorDateOfBirth: string | Date;
  phoneNumber: string;
  founder: string;
  ownership: OwnershipTypes;
  typeId?: number;
  type?: DataItem;
  status: ProviderStatuses;
  statusReason?: string;
  license?: string;
  licenseStatus?: LicenseStatuses;
  isBlocked?: boolean;
  blockReason?: string;
  imageFiles?: File[];
  imageIds?: string[];
  rating?: number;
  numberOfRatings?: number;
  userId: string;
  legalAddress: Address;
  actualAddress?: Address;
  institutionStatusId?: number;
  institutionId?: string;
  institution: Institution;
  institutionType: InstitutionTypes;
  providerSectionItems: ProviderSectionItem[];

  constructor(info, legalAddress: Address, actualAddress: Address, description, user: User, provider?: Provider) {
    this.shortTitle = info.shortTitle;
    this.ownership = info.ownership;
    this.typeId = info.typeId;
    this.fullTitle = info.fullTitle;
    this.email = info.email;
    this.phoneNumber = info.phoneNumber;
    this.edrpouIpn = info.edrpouIpn;
    this.director = info.director;
    this.directorDateOfBirth = new Date(info.directorDateOfBirth).toISOString();
    if (info.institutionStatusId) {
      this.institutionStatusId = info.institutionStatusId;
    }
    if (info.license) {
      this.license = info.license;
    }
    this.founder = info.founder;
    this.legalAddress = legalAddress;
    this.actualAddress = actualAddress;
    this.institutionType = info.institutionType;
    this.userId = user.id;
    this.institution = info.institution;
    this.institutionId = info.institution.id;
    this.website = description.website;
    this.instagram = description.instagram;
    this.facebook = description.facebook;
    if (provider?.id) {
      this.id = provider.id;
    }
    this.providerSectionItems = description.providerSectionItems;
    if (description.imageFiles?.length) {
      this.imageFiles = description.imageFiles;
    }
    if (description.imageIds?.length) {
      this.imageIds = description.imageIds;
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

export class ProviderSectionItem extends SectionItem {
  providerId?: string;

  constructor(info) {
    super(info);
    if (info.providerId) {
      this.providerId = info.providerId;
    }
  }
}

export class ProviderStatusUpdateData {
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
