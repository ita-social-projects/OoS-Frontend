export class SetLocation {
  static readonly type = '[user] set geolocation';
  constructor(public payload: {city: String, lng: Number, lat: Number}) {}
}

