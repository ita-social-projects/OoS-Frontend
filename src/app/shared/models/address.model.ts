import { Codeficator } from './codeficator.model';

export class Address {
  id?: number;
  city?: string;
  street: string;
  buildingNumber: string;
  region?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  // Codeficator
  catottgId?: number;
  codeficatorAddressDto?: Codeficator;

  constructor(info, address?: Address) {
    this.street = info.street;
    this.buildingNumber = info.buildingNumber;
    this.longitude = info.longitude;
    this.latitude = info.latitude;
    this.catottgId = info.catottgId ?? address.catottgId;
    if (address) {
      this.id = address.id;
    }
    this.city = 'city' //TODO: temporary mock for testing, will be removed further
  }
}
