export class Workshop {
  type:string;
  title:string;
  phone:string;
  email:string;
  website:string;
  minAge:number;
  maxAge:number;
  daysPerWeek:number;
  photos:string;
  description:string;
  head:string;
  resources:string;
  direction:string;
  keyWords:string;
  price:number;
  address:{
    id:number;
    city:string;
    street:string;
    buildingNumber:number;
  }


  constructor(about, description) {
    //this.type = about.type;
    this.title = about.title;
    this.phone= about.phone;
    this.email= about.email;
    this.minAge= about.ageFrom;
    this.maxAge= about.ageTo;
    this.daysPerWeek= about.classAmount;
    this.photos=description.photos;
    this.description=description.description;
    this.description=description.head;
    //this.keyWords=description.keyWords;
   
    //this.address.city=contacts.city;
    //this.address.street=contacts.street;
    //this.address.buildingNumber=contacts.building;

    
    
    //this.address.id=1;
    this.price=200;
  }
}