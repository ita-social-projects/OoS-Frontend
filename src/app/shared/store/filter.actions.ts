import { City } from "../models/city.model";
import { Workshop } from "../models/workshop.model";
export class SetCity {
  static readonly type = '[app] Set City';
  constructor(public payload: City) { }
}
export class SetOrder {
  static readonly type = '[filter] Set Order';
  constructor(public payload: string) { }
}
export class SetCategory {
  static readonly type = '[filter] Set Categoty';
  constructor(public payload: number) { }
}
export class SetAgeRange {
  static readonly type = '[filter] Set Categoty';
  constructor(public payload: number) { }
}
export class GetCategories {
  static readonly type = '[filter] Get Categories';
}
export class GetWorkshops {
  static readonly type = '[filter] Get Workshops';
}
export class GetFilteredWorkshops {
  static readonly type = '[filter] Get Filtered Workshops';
  constructor(public payload) { }
}
export class GetTopWorkshops {
  static readonly type = '[filter] Get 4 Most Popular Workshop Cards';
  constructor() { }
}
