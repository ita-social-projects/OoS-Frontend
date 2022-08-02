import { Codeficator } from './codeficator.model';

export class Address {
  id?: number;
  city: string;
  street: string;
  buildingNumber: string;
  region?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  // Codeficator
  codeficatorId?: number;
  codeficatorAddressDto?: Codeficator;

  constructor(info, address?: Address) {
    this.city = info.city;
    this.street = info.street;
    this.buildingNumber = info.buildingNumber;
    this.region = info.region;
    this.district = info.district;
    this.buildingNumber = info.buildingNumber;
    this.longitude = info.longitude;
    this.latitude = info.latitude;
    this.codeficatorId = info.codeficatorId ?? address.codeficatorId;
    this.codeficatorAddressDto = info.codeficatorAddressDto ?? address.codeficatorAddressDto;
    if (address) {
      this.id = address.id;
    }
  }
}
