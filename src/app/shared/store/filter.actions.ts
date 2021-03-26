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
export class AddCategory {
  static readonly type = '[filter] Add Categoty';
  constructor(public payload: string) {}
}
export class SetCategory {
  static readonly type = '[filter] Set Categoty';
  constructor(public payload: string) {}
}
export class GetWorkshops {
  static readonly type = '[filter] Get Workshops';
}
export class GetPopWorkshops {
  static readonly type = '[filter] get 4 most popular organization cards';
}
