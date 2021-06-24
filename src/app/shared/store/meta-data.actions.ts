import { Category, Subcategory, Subsubcategory } from "../models/category.model";
import { City } from "../models/city.model";
import { KeyWord } from "../models/keyWord,model";
export class GetCategories {
  static readonly type = '[meta-data] Get Categories';
}
export class GetSubcategories {
  static readonly type = '[meta-data] Get Subcategorries by Category Id';
  constructor(public payload: number) { }
}
export class GetSubsubcategories {
  static readonly type = '[meta-data] Get Subsubcategorries by Subcategory Id ';
  constructor(public payload: number) { }
}
export class CityList {
  static readonly type = '[meta-data] Get list of cities';
  constructor(public payload: City[]) { }
}

export class KeyWordsList {
  static readonly type = '[meta-data] Get list of key words';
  constructor(public payload: KeyWord[]) { }
}
export class GetSocialGroup {
  static readonly type = '[meta-data] Get GetSocialGroup';
  constructor() { }
}
export class GetCategoryById {
  static readonly type = '[meta-data] Get Category by category id';
  constructor(public payload: number) { }
}
export class GetSubcategoryById {
  static readonly type = '[meta-data] Get Subcategorry by subcategory Id';
  constructor(public payload: number) { }
}
export class GetSubsubcategoryById {
  static readonly type = '[meta-data] Get Subsubcategory by subsubcategory Id ';
  constructor(public payload: number) { }
}
export class OnGetCategoryByIdSuccess {
  static readonly type = '[meta-data] Get Category by category id success';
  constructor(public payload: Category) { }
}
export class OnGetSubcategoryByIdSuccess {
  static readonly type = '[meta-data] Get Subcategorry by subcategory Id success';
  constructor(public payload: Subcategory) { }
}
export class OnGetSubsubcategoryByIdSuccess {
  static readonly type = '[meta-data] Get Subsubcategory by subsubcategory Id success';
  constructor(public payload: Subsubcategory) { }
}