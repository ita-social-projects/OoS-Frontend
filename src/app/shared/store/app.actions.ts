export class ToggleLoading {
  static readonly type = '[app] toggle page loading';
  constructor(public payload: boolean) { }
}
export class SetLocation {
  static readonly type = '[app] set geolocation';
  constructor(public payload: { city: String, lng: Number, lat: Number }) { }
}
export class GetTeachersById {
  static readonly type = '[app] Get Teachers by Id';
  constructor(public payload: number) { }
}
export class MarkFormDirty {
  static readonly type = '[app] mark the form dirty';
  constructor(public payload: boolean) { }
}
export class ActivateEditMode {
  static readonly type = '[app] activate edit Mode';
  constructor(public payload: boolean) { }
}
export class ShowMessageBar {
  static readonly type = '[app] show message bar';
  constructor(public payload: { message: string, type: string }) { }
}

export class ToggleMobileScreen {
  static readonly type ='[app] isMobileScreen'
  constructor(public payload: boolean){ }
}
