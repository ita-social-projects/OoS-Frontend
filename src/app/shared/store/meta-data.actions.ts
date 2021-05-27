import { City } from "../models/city.model";
import { KeyWord } from "../models/keyWord,model";
export class GetCategories {
  static readonly type = '[meta-data] Get Categories';
}
export class GetSubcategorries {
  static readonly type = '[meta-data] Get Subcategorries by Category Id';
  constructor(public id: number) { }
}
export class getSubsubcategorries {
  static readonly type = '[meta-data] Get Subsubcategorries by Subcategory Id ';
  constructor(public id: number) { }
}
export class CityList {
  static readonly type = '[meta-data] Get list of cities';
  constructor(public payload: City[]) { }
}

export class KeyWordsList {
  static readonly type = '[meta-data] Get list of key words';
  constructor(public payload: KeyWord[]) { }
}
