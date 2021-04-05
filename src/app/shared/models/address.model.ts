export class Address {
  city:string;
  street:string;
  buildingNumber:string;
    
  constructor(info) {
    this.city = info.city;
    this.street= info.street;
    this.buildingNumber= info.buildingNumber;
  }
}