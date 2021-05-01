import { City } from "../models/city.model";
import { Workshop } from "../models/workshop.model";

export class setMinAge {
  static readonly type = '[filter] Set Min Age';
  constructor(public payload: number) { }
}
export class setMaxAge {
  static readonly type = '[filter] Set Max Age';
  constructor(public payload: number) { }
}
export class SelectCity {
  static readonly type = '[app] Select City';
  constructor(public payload: City) { }
}
export class SetOrder {
  static readonly type = '[filter] Set Order';
  constructor(public payload: string) { }
}
export class AddCategory {
  static readonly type = '[filter] Add Categoty';
  constructor(public payload: number) { }
}
export class SetCategory {
  static readonly type = '[filter] Set Categoty';
  constructor(public payload: number) { }
}
export class GetWorkshops {
  static readonly type = '[filter] Get Workshops';
}
export class SetFilteredWorkshops {
  static readonly type = '[filter] Set Filtered Workshops';
  constructor(public payload: Workshop[]) { }
}
export class GetPopWorkshops {
  static readonly type = '[filter] Get 4 Most Popular Workshop Cards';
}
export class GetTeachersCards {
  static readonly type = '[filter] Get Teachers Cards';
}
export class GetCategories {
  static readonly type = '[filter] Get Categories';
}
