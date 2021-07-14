import { City } from "../models/city.model";
export class GetDirections {
  static readonly type = '[meta-data] Get Directions';
}
export class GetDepartments {
  static readonly type = '[meta-data] Get Departments by Direction Id';
  constructor(public payload: number) { }
}
export class GetClasses {
  static readonly type = '[meta-data] Get Classes by Department Id ';
  constructor(public payload: number) { }
}
export class CityList {
  static readonly type = '[meta-data] Get list of cities';
  constructor(public payload: City[]) { }
}
export class GetSocialGroup {
  static readonly type = '[meta-data] Get GetSocialGroup';
  constructor() { }
}
export class ClearCategories {
  static readonly type = '[meta-data] clear categories state';
}
export class GetCities {
  static readonly type = '[meta-data] Get Cities';
  constructor(public payload: string) { }
}
export class ClearCities {
  static readonly type = '[meta-data] clear cities state';
}