import { MinistryAdmin } from './../models/ministryAdmin.model';
import { Direction } from "../models/category.model";
import { AdminTabsTitle } from '../enum/enumUA/tech-admin/admin-tabs';
import { CompanyInformation } from "../models/сompanyInformation.model";
import { HttpErrorResponse } from '@angular/common/http';

export class GetPlatformInfo {
  static readonly type = '[admin] Get Information Platform Info';
  constructor() {}
}

export class GetAboutPortal {
  static readonly type = '[admin] Get AboutPortal';
  constructor() {}
}
export class GetSupportInformation {
  static readonly type = '[admin] Get SupportInformation';
  constructor() {}
}
export class GetAllProviders {
  static readonly type = '[admin] Get all providers';
  constructor() {}
}
export class GetFilteredProviders {
  static readonly type = '[admin] Get filtered Providers';
  constructor(public payload?: string) {}
} 

export class GetLawsAndRegulations {
  static readonly type = '[admin] Get LawsAndRegulations';
  constructor() {}
}
export class UpdatePlatformInfo {
  static readonly type = '[admin] Update Information Platform Info';
  constructor(public payload: CompanyInformation, public type: AdminTabsTitle) {}
}
export class OnUpdatePlatformInfoFail {
  static readonly type = '[admin] update Information Platform Info Fail';
  constructor(public payload: Error) {}
}
export class OnUpdatePlatformInfoSuccess {
  static readonly type = '[admin] update Information Platform Info Success';
  constructor(public payload: CompanyInformation, public type: AdminTabsTitle) {}
}
export class DeleteDirectionById {
  static readonly type = '[admin] delete Direction';
  constructor(public payload) {}
}
export class OnDeleteDirectionFail {
  static readonly type = '[admin] delete Direction fail';
  constructor(public payload: Error) {}
}
export class OnDeleteDirectionSuccess {
  static readonly type = '[admin] delete Direction success';
  constructor(public payload) {}
}
export class CreateDirection {
  static readonly type = '[admin] create Direction';
  constructor(public payload) {}
}
export class OnCreateDirectionFail {
  static readonly type = '[admin] create Direction fail';
  constructor(public payload: Error) {}
}
export class OnCreateDirectionSuccess {
  static readonly type = '[admin] create Direction success';
  constructor(public payload) {}
}
export class UpdateDirection {
  static readonly type = '[admin] update Direction';
  constructor(public payload: Direction) {}
}
export class OnUpdateDirectionFail {
  static readonly type = '[admin] update Direction fail';
  constructor(public payload: Error) {}
}
export class OnUpdateDirectionSuccess {
  static readonly type = '[admin] update Direction success';
  constructor(public payload) {}
}
export class GetDirectionById {
  static readonly type = '[admin] get Direction By Direction Id';
  constructor(public payload) {}
}

export class GetFilteredDirections {
  static readonly type = '[admin] Get Filtered Directions';
  constructor(public payload?: string) {}
}

export class GetParents {
  static readonly type = '[admin] Get Parents';
  constructor() {}
}

export class GetChildrenForAdmin {
  static readonly type = '[admin] Get Children';
  constructor(public payload?: string) {}
}

export class GetProviderHistory {
  static readonly type = '[admin] Get Provider History';
  constructor(public payload?: string) {}
}

export class GetProviderAdminHistory {
  static readonly type = '[admin] Get Provider Admin History';
  constructor(public payload?: string) {}
}

export class GetApplicationHistory {
  static readonly type = '[admin] Get Application History';
  constructor(public payload?: string) {}
}

export class GetMinistryAdminProfile {
  static readonly type = '[admin] Get Ministry Admin Profile';
  constructor() { }
}

export class CreateMinistryAdmin {
  static readonly type = '[user] create Ministry Admin';
  constructor(public payload: MinistryAdmin) { }
}
export class OnCreateMinistryAdminFail {
  static readonly type = '[user] create Ministry Admin fail';
  constructor(public payload: HttpErrorResponse) { }
}
export class OnCreateMinistryAdminSuccess {
  static readonly type = '[user] create Ministry Admin success';
  constructor(public payload) { }
}
