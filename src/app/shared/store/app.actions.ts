export class ToggleLoading {
  static readonly type = '[app] toggle page loading';
  constructor(public payload: boolean) { }
}
export class ChangePage {
  static readonly type = '[app] changes the view of the page';
  constructor(public payload: boolean) { }
}
export class SetLocation {
  static readonly type = '[app] set geolocation';
  constructor(public payload: { city: String, lng: Number, lat: Number }) { }
}
export class GetWorkshops {
  static readonly type = '[app] Get Workshops';
  constructor() { }

}
export class GetTeachersById {
  static readonly type = '[app] Get Teachers by Id';
  constructor(public payload: number) { }
}