import { Department, Direction, IClass } from "../models/category.model";
import { CompanyInformation } from "../models/сompanyInformation.model";
import { AdminTabsTitle } from '../enum/enumUA/tech-admin/admin-tabs';

export class GetPlatformInfo {
  static readonly type = '[admin] Get Information Platform Info';
  constructor() { }
}

export class GetAboutPortal {
  static readonly type = '[admin] Get AboutPortal';
  constructor() { }
}
export class GetSupportInformation {
  static readonly type = '[admin] Get SupportInformation';
  constructor() { }
}
export class GetAllProviders {
  static readonly type = '[admin] Get all providers';
  constructor() {}
}
export class GetLawsAndRegulations {
  static readonly type = '[admin] Get LawsAndRegulations';
  constructor() { }
}
export class UpdatePlatformInfo {
  static readonly type = '[admin] Update Information Platform Info';
  constructor(public payload: CompanyInformation, public type: AdminTabsTitle) { }
}
export class OnUpdatePlatformInfoFail {
  static readonly type = '[admin] update Information Platform Info Fail';
  constructor(public payload: Error) { }
}
export class OnUpdatePlatformInfoSuccess {
  static readonly type = '[admin] update Information Platform Info Success';
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
  constructor(public payload: Direction) { }
}
export class OnUpdateDirectionFail {
  static readonly type = '[admin] update Direction fail';
  constructor(public payload: Error) { }
}
export class OnUpdateDirectionSuccess {
  static readonly type = '[admin] update Direction success';
  constructor(public payload) { }
}
export class UpdateDepartment {
  static readonly type = '[admin] update Department';
  constructor(public payload: Department) { }
}
export class OnUpdateDepartmentFail {
  static readonly type = '[admin] update Ddepartment fail';
  constructor(public payload: Error) { }
}
export class OnUpdateDepartmentSuccess {
  static readonly type = '[admin] update Department success';
  constructor(public payload: Department) { }
}
export class UpdateClass {
  static readonly type = '[admin] update Class';
  constructor(public payload: IClass) { }
}
export class OnUpdateClassFail {
  static readonly type = '[admin] update Class fail';
  constructor(public payload: Error) { }
}
export class OnUpdateClassSuccess {
  static readonly type = '[admin] update Class success';
  constructor(public payload: IClass) { }
}
export class CreateDepartment {
  static readonly type = '[admin] create Department';
  constructor(public payload: Department) { }
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
export class GetDepartmentById {
  static readonly type = '[admin] get Department By Department Id';
  constructor(public payload) { }
}
export class GetDepartmentByDirectionId {
  static readonly type = '[admin] get Department By Direction Id';
  constructor(public payload: number) { }
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
  static readonly type = '[admin] create Class';
  constructor(public payload: IClass[]) { }
}
export class OnCreateClassFail {
  static readonly type = '[admin] create Class fail';
  constructor(public payload: Error) { }
}
export class OnCreateClassSuccess {
  static readonly type = '[admin] create Class success';
  constructor(public payload) { }
}
export class DeleteDepartmentById {
  static readonly type = '[admin] delete department';
  constructor(public payload: Department) { }
}
export class OnDeleteDepartmentFail {
  static readonly type = '[admin] delete department fail';
  constructor(public payload: Error) { }
}
export class OnDeleteDepartmentSuccess {
  static readonly type = '[admin] delete department success';
  constructor(public payload) { }
}
export class DeleteClassById {
  static readonly type = '[admin] delete Class';
  constructor(public payload: IClass) { }
}
export class OnDeleteClassFail {
  static readonly type = '[admin] delete Class fail';
  constructor(public payload: Error) { }
}
export class OnDeleteClassSuccess {
  static readonly type = '[admin] delete Class success';
  constructor(public payload: IClass) { }
}
export class OnClearCategories {
  static readonly type = '[admin] clear department, direction, class state';
  constructor( ) { }
}
export class OnClearDepartment {
  static readonly type = '[admin] clear department state';
  constructor( ) { }
}

export class GetParents {
  static readonly type = '[admin] Get Parents';
  constructor() { }
}

export class GetChildren {
  static readonly type = '[admin] Get Children';
  constructor() { }
}
