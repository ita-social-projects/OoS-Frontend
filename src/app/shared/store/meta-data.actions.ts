export class CityList {
  static readonly type = '[meta-data] shows list of cities';
  constructor(public payload: string[]) {}
}