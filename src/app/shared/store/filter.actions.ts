export class setMinAge {
  static readonly type = '[filter] set min age';
  constructor(public payload: number) {}
}
export class setMaxAge {
  static readonly type = '[filter] set max age';
  constructor(public payload: number) {}
}
export class getCards {
  static readonly type = '[filter] get organization cards';
}
export class getActivities {
  static readonly type = '[user] gets activities cards';
}
export class SelectCity {
  static readonly type = '[app] selects city';
  constructor(public payload: string) {}
}
export class SetOrder {
  static readonly type = '[filter] Set Order';
  constructor(public payload: string) {}
}
