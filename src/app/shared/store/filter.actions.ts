export class setMinAge {
  static readonly type = '[filter] set min age';
  constructor(public payload: number) {}
}
export class setMaxAge {
  static readonly type = '[filter] set max age';
  constructor(public payload: number) {}
}
export class SetOrder {
  static readonly type = '[filter] Set Order';
  constructor(public payload: string) {}
}