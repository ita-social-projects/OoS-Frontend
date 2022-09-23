import { Codeficator } from './codeficator.model';

export class Address {
  id?: number;
  street: string;
  buildingNumber: string;
  // Codeficator
  catottgId?: number;
  codeficatorAddressDto?: Codeficator;
  latitude?: number;
  longitude?: number;

  constructor(info, address?: Address) {
    this.street = info.street;
    this.buildingNumber = info.buildingNumber;
    this.catottgId = info.catottgId ?? address.catottgId;
    if (address) {
      this.id = address.id;
    }
    if (info.latitude) {
      this.latitude = info.latitude;
    }
    if (info.longitude) {
      this.longitude = info.longitude;
    }
  }
}
