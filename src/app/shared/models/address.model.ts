export class Address {
  id?: number;
  city: string;
  street: string;
  buildingNumber: string;
  region?: string;
  district?: string;
  latitude?: number;
  longitude?: number;

  constructor(info, address?: Address) {
    this.city = info.city;
    this.street = info.street;
    this.buildingNumber = info.buildingNumber;
    this.region = info.region;
    this.district = info.district;
    this.buildingNumber = info.buildingNumber;
    if (address) {
      this.id = address.id;
    }
  }
}