export class SetLocation {
    static readonly type = '[location] set geolocation';
    constructor(public payload: {city: String, lng: Number, lat: Number}) {}
  }
export class getCards {
  static readonly type = '[user] gets child cards';
  constructor(){}
}