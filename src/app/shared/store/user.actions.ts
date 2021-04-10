export class SetLocation {
    static readonly type = '[location] set geolocation';
    constructor(public payload: {city: String, lng: Number, lat: Number}) {}
  }

export class SetBreadCrumb {
  static readonly type = '[user state] set bread crumb';
  constructor(public payload: {breadCrumb: string, urlLink: string}) {}
}