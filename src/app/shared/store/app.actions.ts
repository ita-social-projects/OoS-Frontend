export class ToggleLoading {
  static readonly type = '[app] toggle page loading';
  constructor(public payload: boolean) {}
}
export class ChangeAuthorization {
  static readonly type = '[app] changes authorization satus';
  constructor(public payload: boolean) {}
}