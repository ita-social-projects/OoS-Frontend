import { Department, Direction, IClass } from "../models/category.model";

import { AdminTabsTitle } from '../enum/enumUA/tech-admin/admin-tabs';
import { CompanyInformation } from "../models/сompanyInformation.model";

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
  constructor(public payload: CompanyInformation, public type: AdminTabsTitle) { }
}
export class GetParents {
  static readonly type = '[admin] Get Parents';
  constructor() { }
}

export class GetChildrenForAdmin {
  static readonly type = '[admin] Get Children';
  constructor(public payload?: string) { }
}

export class GetProviderHistory {
  static readonly type = '[admin] Get Provider History';
  constructor(public payload?: string) { }
}

export class GetProviderAdminHistory {
  static readonly type = '[admin] Get Provider Admin History';
  constructor(public payload?: string) { }
}

export class GetApplicationHistory {
  static readonly type = '[admin] Get Application History';
  constructor(public payload?: string) { }
}
