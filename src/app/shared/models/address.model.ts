export class Address {
  id?: number;
  region?: string;
  district?: string;
  city: string;
  street: string;
  buildingNumber: string;
  latitude?: number;
  longitude?: number;

  constructor(info) {
    this.city = info.city;
    this.street = info.street;
    this.buildingNumber = info.buildingNumber;
    this.region = info.region;
    this.district = info.district;
    this.buildingNumber = info.buildingNumber;

  }
}