export class ToggleLoading {
  static readonly type = '[app] toggle page loading';
  constructor(public payload: boolean) { }
}
export class ChangePage {
  static readonly type = '[app] changes the view of the page';
  constructor(public payload: boolean) { }
}
export class SetLocation {
  static readonly type = '[location] set geolocation';
  constructor(public payload: { city: String, lng: Number, lat: Number }) { }
}