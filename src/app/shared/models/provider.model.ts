import { StateContext, Store } from "@ngxs/store";
import { RegistrationState, RegistrationStateModel } from "../store/registration.state";
import { Address } from "./address.model";
import { User } from "./user.model";
import { Workshop } from "./workshop.model";

export class Provider {
  id: number;
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
  ownership?: number;
  type?: number;
  status?: boolean;
  legalAddressId?: number;
  legalAddress?: Address;
  actualAddressId?: number;
  actualAddress?: Address;
  workshop?: Workshop;
  image?: File[];

  constructor(info, legalAddress: Address, actualAddress: Address, photo, user: User, provider?: Provider) {
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
    if (provider.legalAddressId) {
      this.legalAddressId = provider.legalAddressId;
    };
    if (provider.actualAddressId) {
      this.actualAddressId = provider.actualAddressId;
    };
    this.legalAddress = legalAddress;
    this.actualAddress = actualAddress;
    this.description = photo.description;
    this.userId = user.id;
    this.id = provider.id;
  }
}
