export class Address {
  city:string;
  street:string;
  buildingNumber:string;
    
  constructor(info, city) {
    this.city = city;
    this.street= info.street;
    this.buildingNumber= info.buildingNumber;
  }
}