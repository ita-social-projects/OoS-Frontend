import { Direction } from "@angular/cdk/bidi";
import { AboutPortal } from "../models/aboutPortal.model";
import { IClass } from "../models/category.model";
import { PaginationElement } from "../models/paginationElement.model";

export class GetInfoAboutPortal {
  static readonly type = '[admin] Get Information About Portal';
  constructor() { }
}
export class UpdateInfoAboutPortal {
  static readonly type = '[admin] Update Information About Portal';
  constructor(public payload: AboutPortal) { }
}
export class OnUpdateInfoAboutPortalFail {
  static readonly type = '[admin] update Information About Portal Fail';
  constructor(public payload: Error) { }
}
export class OnUpdateInfoAboutPortalSuccess {
  static readonly type = '[admin] update Information About Portal Success';
  constructor(public payload) { }
}
export class DeleteDirectionById {
  static readonly type = '[admin] delete Direction';
  constructor(public payload) { }
}
export class OnDeleteDirectionFail {
  static readonly type = '[admin] delete Direction fail';
  constructor(public payload: Error) { }
}
export class OnDeleteDirectionSuccess {
  static readonly type = '[admin] delete Direction success';
  constructor(public payload) { }
}
export class CreateDirection {
  static readonly type = '[admin] create Direction';
  constructor(public payload) { }
}
export class OnCreateDirectionFail {
  static readonly type = '[admin] create Direction fail';
  constructor(public payload: Error) { }
}
export class OnCreateDirectionSuccess {
  static readonly type = '[admin] create Direction success';
  constructor(public payload) { }
}
export class UpdateDirection {
  static readonly type = '[admin] update Direction';
  constructor(public payload) { }
}
export class OnUpdateDirectionFail {
  static readonly type = '[admin] update Direction fail';
  constructor(public payload: Error) { }
}
export class OnUpdateDirectionSuccess {
  static readonly type = '[admin] update Direction success';
  constructor(public payload) { }
}
export class CreateDepartment {
  static readonly type = '[admin] create Department';
  constructor(public payload) { }
}
export class OnCreateDepartmentFail {
  static readonly type = '[admin] create Department fail';
  constructor(public payload: Error) { }
}
export class OnCreateDepartmentSuccess {
  static readonly type = '[admin] create Department success';
  constructor(public payload) { }
}
export class GetDirectionById {
  static readonly type = '[admin] get Direction By Direction Id';
  constructor(public payload) { }
}
export class GetDepartmentByDirectionId {
  static readonly type = '[admin] get Department By Direction Id';
  constructor(public payload: number) { }
}
export class PageChange {
  static readonly type = '[admin] Change Page';
  constructor(public payload: PaginationElement) { }
}
export class FilterChange {
  static readonly type = '[admin] Filter Change';
  constructor() { }
}
export class SetSearchQueryValue {
  static readonly type = '[admin] Set Search Quesry Value';
  constructor(public payload: string) { }
}
export class GetFilteredDirections {
  static readonly type = '[admin] Get Filtered Directions';
  constructor() { }
}
export class FilterClear {
  static readonly type = '[filter] Filter Clear';
  constructor() { }
}
export class CreateClass {
  static readonly type = '[admin] create Children';
  constructor(public payload) { }
}
export class OnCreateClassFail {
  static readonly type = '[admin] create Children fail';
  constructor(public payload: Error) { }
}
export class OnCreateClassSuccess {
  static readonly type = '[admin] create Children success';
  constructor(public payload) { }
}


