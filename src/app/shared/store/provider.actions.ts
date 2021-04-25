import { Workshop } from "../models/workshop.model";
export class GetWorkshop {
  static readonly type = '[provider] gets Workshop';
  constructor() {}
}
export class GetApplications {
  static readonly type = '[provider] gets applications';
  constructor() { }
}
export class CreateWorkshop {
  static readonly type = '[provider] create Workshop';
  constructor(public payload: Workshop) { }
}
export class OnCreateWorkshopFail {
  static readonly type = '[provider] create Workshop failed';
  constructor(public payload: Error) { }
}
export class OnCreateWorkshopSuccess {
  static readonly type = '[provider] create Workshop failed';
  constructor(public payload) { }
}