import { StateContext, Store } from "@ngxs/store";
import { RegistrationState, RegistrationStateModel } from "../store/registration.state";
import { Address } from "./address.model";
import { Workshop } from "./workshop.model";

export class Provider {
  id: string;
  userId?: string;
  fullTitle?: string;
  shortTitle?: string;
  website?: string;
  email?: string;
  facebook?: string;
  instagram?: string;
  description?: string;
  edrpouIpn?: string;
  director?: string;
  directorBirthDay?: string | Date;
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

  constructor(id, info, legalAddress, actualAddress, photo) {
    this.userId = id;
    this.shortTitle = info.shortTitle;
    this.fullTitle = info.fullTitle;
    this.website = info.website;
    this.instagram = info.instagram;
    this.facebook = info.facebook;
    this.email = info.email;
    this.phoneNumber = info.phoneNumber;
    this.edrpouIpn = info.edrpouIpn;
    this.director = info.director;
    this.directorBirthDay = info.directorBirthDay;
    this.founder = info.founder;
    this.type = 0;
    this.ownership = 0;
    this.legalAddress = legalAddress;
    this.actualAddress = actualAddress;
    this.description = photo.description;
  }
}
