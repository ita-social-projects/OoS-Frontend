import { City } from "../services/filters-services/city-filter/city-filter.service";

export class setMinAge {
  static readonly type = '[filter] Set Min Age';
  constructor(public payload: number) {}
}
export class setMaxAge {
  static readonly type = '[filter] Set Max Age';
  constructor(public payload: number) {}
}
export class SelectCity {
  static readonly type = '[app] Select City';
  constructor(public payload: City) {}
}
export class SetOrder {
  static readonly type = '[filter] Set Order';
  constructor(public payload: string) {}
}
export class AddCategory {
  static readonly type = '[filter] Add Categoty';
  constructor(public payload: number) {}
}
export class SetCategory {
  static readonly type = '[filter] Set Categoty';
  constructor(public payload: number) {}
}
export class GetWorkshops {
  static readonly type = '[filter] Get Workshops';
}
export class GetPopWorkshops {
  static readonly type = '[filter] Get 4 Most Popular Organization Cards';
}
export class GetTeachersCards {
  static readonly type = '[filter] Get Teachers Cards';
}
export class GetCategories {
  static readonly type = '[filter] Get Categories';
}
