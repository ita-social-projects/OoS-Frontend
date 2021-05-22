import { Child } from "../models/child.model";
import { Provider } from "../models/provider.model";
import { Workshop } from "../models/workshop.model";
export class GetWorkshopsById {
  static readonly type = '[user] get Workshop';
  constructor(public payload: number) { }
}
export class GetApplicationsById {
  static readonly type = '[user] get Applications';
  constructor(public payload: number) { }
}
export class GetChildrenById {
  static readonly type = '[user] get Children';
  constructor(public payload: number) { }
}
export class CreateWorkshop {
  static readonly type = '[user] create Workshop';
  constructor(public payload: Workshop) { }
}
export class OnCreateWorkshopFail {
  static readonly type = '[user] create Workshop fail';
  constructor(public payload: Error) { }
}
export class OnCreateWorkshopSuccess {
  static readonly type = '[user] create Workshop success';
  constructor(public payload) { }
}
export class DeleteWorkshopById {
  static readonly type = '[user] delete Workshop';
  constructor(public payload: number) { }
}
export class OnDeleteWorkshopSuccess {
  static readonly type = '[user] delete Workshop success';
  constructor(public payload) { }
}
export class OnDeleteWorkshopFail {
  static readonly type = '[user] delete Workshop fail';
  constructor(public payload) { }
}
export class CreateChildren {
  static readonly type = '[parent] create Children';
  constructor(public payload: Child) { }
}
export class OnCreateChildrenFail {
  static readonly type = '[user] create Children fail';
  constructor(public payload: Error) { }
}
export class OnCreateChildrenSuccess {
  static readonly type = '[user] create Children success';
  constructor(public payload) { }
}
export class DeleteChildrenById {
  static readonly type = '[user] delete Children';
  constructor(public payload: number) { }
}
export class OnDeleteChildrenSuccess {
  static readonly type = '[user] delete Children success';
  constructor(public payload) { }
}
export class OnDeleteChildrenFail {
  static readonly type = '[user] delete Children fail';
  constructor(public payload: Error) { }
}
export class CreateProvider {
  static readonly type = '[parent] create Provider';
  constructor(public payload: Provider) { }
}
export class OnCreateProviderFail {
  static readonly type = '[user] create Provider fail';
  constructor(public payload: Error) { }
}
export class OnCreateProviderSuccess {
  static readonly type = '[user] create Provider success';
  constructor(public payload) { }
}
