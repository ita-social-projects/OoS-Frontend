import { Direction } from "../models/category.model";
import { City } from "../models/city.model";
import { WorkingHours } from "../models/workingHours.model";
export class SetCity {
  static readonly type = '[app] Set City';
  constructor(public payload: City) { }
}
export class SetOrder {
  static readonly type = '[filter] Set Order';
  constructor(public payload: string) { }
}
export class SetDirections {
  static readonly type = '[filter] Set Direction';
  constructor(public payload: Direction[]) { }
}
export class SetWorkingDays {
  static readonly type = '[filter] Set Working Days';
  constructor(public payload: WorkingHours[]) { }
}
export class SetWorkingHours {
  static readonly type = '[filter] Set Working Hours';
  constructor(public payload: WorkingHours[]) { }
}
export class SetIsFree {
  static readonly type = '[filter] Set Is Free type of payment';
  constructor(public payload: boolean) { }
}
export class SetMinPrice {
  static readonly type = '[filter] Set Min Price';
  constructor(public payload: number) { }
}
export class SetMaxPrice {
  static readonly type = '[filter] Set Max Price';
  constructor(public payload: number) { }
}
export class SetSearchQueryValue {
  static readonly type = '[filter] Set Search Quesry Value';
  constructor(public payload: string) { }
}
export class SetOpenRecruitment {
  static readonly type = '[filter] Set Open Recruitment';
  constructor(public payload: boolean) { }
}
export class SetClosedRecruitment {
  static readonly type = '[filter] Set Closed Recruitment';
  constructor(public payload: boolean) { }
}
export class GetFilteredWorkshops {
  static readonly type = '[filter] Get Filtered Workshops';
  constructor() { }
}
export class GetTopWorkshops {
  static readonly type = '[filter] Get 4 Most Popular Workshop Cards';
  constructor() { }
}
export class SetWithDisabilityOption {
  static readonly type = '[filter] Set with Disability option';
  constructor(public payload: boolean) { }
}

export class FilterChange {
  static readonly type = '[app] Filter Change';
  constructor() { }
}

export class SetMinAge {
  static readonly type = '[filter] Set Min Age';
  constructor(public payload: number) { }
}
export class SetMaxAge {
  static readonly type = '[filter] Set Max Age';
  constructor(public payload: number) { }
}