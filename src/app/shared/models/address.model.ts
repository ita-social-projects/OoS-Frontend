import { Codeficator } from './codeficator.model';

export class Address {
  id = 0;
  street: string;
  buildingNumber: string;
  latitude: number;
  longitude: number;
  catottgId: number;
  codeficatorAddressDto?: Codeficator;

  constructor(info: Address, address?: Address) {
    this.street = info.street;
    this.buildingNumber = info.buildingNumber;
    this.latitude = info.latitude;
    this.longitude = info.longitude;
    this.catottgId = info.catottgId ?? address.catottgId;

    if (address) {
      this.id = address.id;
    }
  }
}
