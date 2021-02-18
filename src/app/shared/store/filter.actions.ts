export class setMinAge {
  static readonly type = '[filter] set min age';
  constructor(public payload: number) {}
}
export class setMaxAge {
  static readonly type = '[filter] set max age';
  constructor(public payload: number) {}
}
export class SelectCity {
  static readonly type = '[app] selects city';
  constructor(public payload: string) {}
}
export class SetOrder {
  static readonly type = '[filter] Set Order';
  constructor(public payload: string) {}
}
