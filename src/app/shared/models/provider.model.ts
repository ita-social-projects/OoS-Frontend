import { Address } from './address.model';
import { User } from './user.model';
import { Workshop } from './workshop.model';

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
  image?: File[];
  imageIds?: string[];
  institutionStatusId?: number | null;
  providerSectionItems?: object[]

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
    this.directorDateOfBirth = info.directorDateOfBirth;
    this.founder = info.founder;
    this.legalAddress = legalAddress;
    this.actualAddress = actualAddress;
    this.description = description.description;
    this.institutionStatusId = description.institutionStatusId || null;
    this.userId = user.id;
    if (provider?.id) {
      this.id = provider.id;
    }
    this.providerSectionItems = description.sectionItems;

  }
}
