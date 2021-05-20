import { Address } from "./address.model";
import { Workshop } from "./workshop.model";

export class Provider {
  userId: string;
  id: number;
  fullTitle: string;
  shortTitle: string;
  website: string;
  email: string;
  facebook: string;
  instagram: string;
  description: string;
  edrpouIpn: string;
  director: string;
  directorBirthDay: string | Date;
  phoneNumber: string;
  founder: string;
  ownership: number;
  type: number;
  status: boolean;
  legalAddressId: number;
  legalAddress: Address;
  actualAddressId: number;
  actualAddress: Address;
  workshop: Workshop

  constructor(info) {
    this.fullTitle = info.title;
  }
}
