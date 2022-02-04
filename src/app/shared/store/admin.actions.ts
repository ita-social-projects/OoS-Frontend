import { AboutPortal } from "../models/aboutPortal.model";

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