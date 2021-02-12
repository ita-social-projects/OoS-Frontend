export class ToggleLoading {
  static readonly type = '[app] toggle page loading';
  constructor(public payload: boolean) {}
}