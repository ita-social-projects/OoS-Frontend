import { Institution } from './institution.model';
import { Address } from './address.model';
import { User } from './user.model';
import { Workshop } from './workshop.model';
import { SectionItem } from './sectionItem.model';
import { ApplicationStatus } from '../enum/applications';

export class Provider {
  id: string;
  userId: string;
  fullTitle?: string;
  shortTitle: string;
  website?: string;
  email: string;
  facebook?: string;
  instagram?: string;
  description?: string;
  edrpouIpn?: string;
  director?: string;
  directorDateOfBirth?: string | Date;
  phoneNumber?: string;
  founder?: string;
  ownership?: string;
  type?: number;
  status?: boolean;
  legalAddress?: Address;
  actualAddress?: Address;
  workshop?: Workshop;
  imageFiles?: File[];
  imageIds?: string[];
  coverImage?: File[];
  coverImageId?: string[];
  institutionStatusId?: number | null;
  providerSectionItems: ProviderSectionItem[];
  institutionType: string;
  institution: Institution;
  institutionId: string;

  constructor(info, legalAddress: Address, actualAddress: Address, description, user: User, provider?: Provider) {
    this.shortTitle = info.shortTitle;
    this.ownership = info.ownership;
    this.type = info.type;
    this.fullTitle = info.fullTitle;
    this.website = info.website;
    this.instagram = info.instagram;
    this.facebook = info.facebook;
    this.email = info.email;
    this.phoneNumber = info.phoneNumber;
    this.edrpouIpn = info.edrpouIpn;
    this.director = info.director;
    this.directorDateOfBirth = new Date(info.directorDateOfBirth).toISOString();
    this.founder = description.founder;
    this.legalAddress = legalAddress;
    this.actualAddress = actualAddress;
    if (description?.institutionStatusId) {
      this.institutionStatusId = description.institutionStatusId;
    }
    this.institutionType = description.institutionType;
    this.userId = user.id;
    this.institution = description.institution;
    this.institutionId = info.institution.id;
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
    if (info.coverImage?.length) {
      this.coverImage = info.coverImage;
    }
    if (info.coverImageId?.length) {
      this.coverImageId = info.coverImageId[0];
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

export interface  ProviderStatusUpdateData {
  providerId: string,
  status: string
}
