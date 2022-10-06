import { HttpErrorResponse } from '@angular/common/http';
import { Application, ApplicationParameters, ApplicationUpdate } from '../models/application.model';

export class GetWorkshopsByProviderId {
  static readonly type = '[user] get Workshops By Provider Id';
  constructor(public payload: string, public excludedWorkshopId?: string) { }
}

export class GetWorkshopById {
  static readonly type = '[user] get Workshop By Wokrshop Id';
  constructor(public payload: string) { }
}

export class OnGetWorkshopByIdFail {
  static readonly type = '[user] get Workshop By Workshop Id fail';
  constructor(public payload: HttpErrorResponse) { }
}

export class GetProviderById {
  static readonly type = '[user] get Provider By Provider Id';
  constructor(public payload: string) { }
}

export class OnGetProviderByIdFail {
  static readonly type = '[user] get Provider By Id fail';
  constructor(public payload: HttpErrorResponse) { }
}

export class GetApplicationsByParentId {
  static readonly type = '[user] get Applications By Parent Id';
  constructor(public id: string, public parameters: ApplicationParameters) { }
}

export class GetApplicationsByProviderId {
  static readonly type = '[user] get Applications By Provider Id';
  constructor(public id: string, public parameters: ApplicationParameters) { }
}

export class GetApplicationsByStatus {
  static readonly type = '[user] get Applications By Status';
  constructor(public payload: number) { }
}

export class UpdateApplication {
  static readonly type = '[user] update Application';
  constructor(public payload: ApplicationUpdate) { }
}

export class OnUpdateApplicationFail {
  static readonly type = '[user] update Application fail';
  constructor(public payload: HttpErrorResponse) { }
}

export class OnUpdateApplicationSuccess {
  static readonly type = '[user] update Application success';
  constructor(public payload: Application) { }
}

export class GetFilteredChildrens {
  static readonly type = '[user] Get Filtered Childrens';
  constructor() { }
}

export class ResetProviderWorkshopDetails {
  static readonly type = '[user] clear provider and workshop details';
  constructor() { }
}
