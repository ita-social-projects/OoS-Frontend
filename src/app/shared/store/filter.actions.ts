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
export class getPopCards {
  static readonly type = '[filter] get 4 most popular organization cards';
}
export class SelectCity {
  static readonly type = '[app] selects city';
  constructor(public payload: string) {}
}
export class SetOrder {
  static readonly type = '[filter] Set Order';
  constructor(public payload: string) {}
}
export class GetTeachersCards {
  static readonly type = '[filter] get teachers cards';
  constructor(public payload: []) {}
}
