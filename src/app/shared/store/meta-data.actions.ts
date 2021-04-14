import { City } from "../services/filters-services/city-filter/city-filter.service";
import { keyWord } from "../services/key-words/key-words.service";

export class CityList {
  static readonly type = '[meta-data] shows list of cities';
  constructor(public payload: City[]) {}
}
export class GetCategoriesIcons {
  static readonly type = '[meta-data] Get Categories Icons'
}
export class KeyWordsList {
  static readonly type = '[meta-data] shows list of key words';
  constructor(public payload: keyWord[]) {}
}
