import { Direction } from "@angular/cdk/bidi";
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
