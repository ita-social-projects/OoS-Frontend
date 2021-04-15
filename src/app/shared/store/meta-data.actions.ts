import { City } from "../models/city.model";
import { KeyWord } from "../models/keyWord,model";

export class CityList {
  static readonly type = '[meta-data] shows list of cities';
  constructor(public payload: City[]) {}
}
export class GetCategoriesIcons {
  static readonly type = '[meta-data] Get Categories Icons'
}
export class KeyWordsList {
  static readonly type = '[meta-data] shows list of key words';
  constructor(public payload: KeyWord[]) {}
}
