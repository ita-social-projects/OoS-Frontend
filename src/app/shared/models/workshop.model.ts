export class Workshop {
  type:string;
  title:string;
  phone:number;
  email:string;
  website:string;
  Minage:number;
  MaxAge:number;
  classAmount:number;
  photos:string;
  description:string;
  resources:string;
  direction:string;
  keyWords:string;
  city:string;
  street:string;
  building:number;


  constructor(about, description, contacts) {
    this.type = about.type;
    this.title = about.title;
    this.phone= about.phone;
    this.email= about.email;
    this.Minage= about.ageFrom;
    this.MaxAge= about.ageTo;
    this.classAmount= about.classAmount;
    this.photos=description.photos;
    this.description=description.description;
    this.keyWords=description.keyWords;
    this.city=contacts.city;
    this.street=contacts.street;
    this.building=contacts.building;
  }
}