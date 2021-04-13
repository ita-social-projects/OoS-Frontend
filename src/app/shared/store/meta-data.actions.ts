export class CityList {
  static readonly type = '[meta-data] shows list of cities';
  constructor(public payload: string[]) {}
}
export class GetCategoriesIcons {
  static readonly type = '[meta-data] Get Categories Icons'
}
export class KeyWordsList {
  static readonly type = '[meta-data] shows list of key words';
  constructor(public payload: string[]) {}
}
