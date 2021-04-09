export class Address {
  id:number;
  city:string;
  street:string;
  buildingNumber:string;
    
  constructor(info) {
    this.id = 1;
    this.city = info.city;
    this.street= info.street;
    this.buildingNumber= info.buildingNumber;
  }
}