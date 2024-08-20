import { HttpErrorResponse } from '@angular/common/http';

import { Application, ApplicationFilterParameters, ApplicationUpdate } from '../models/application.model';
import { ProviderParameters } from '../models/provider.model';

export class GetWorkshopsByProviderId {
  static readonly type = '[user] get Workshops By Provider Id';
  constructor(public providerParameters: ProviderParameters) {}
}

export class GetWorkshopById {
  static readonly type = '[user] get Workshop By Workshop Id';
  constructor(public payload: string) {}
}

export class GetCompetitionById {
  static readonly type = '[user] get Competition By Competition Id';
  constructor(public payload: string) {}
}

export class GetAllApplications {
  static readonly type = '[admin] Get All Applications';
  constructor(public params: ApplicationFilterParameters) {}
}

export class OnGetWorkshopByIdFail {
  static readonly type = '[user] get Workshop By Workshop Id fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnGetCompetitionByIdFail {
  static readonly type = '[user] get Competition by Competition Id fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class GetProviderById {
  static readonly type = '[user] get Provider By Provider Id';
  constructor(public payload: string) {}
}

export class OnGetProviderByIdFail {
  static readonly type = '[user] get Provider By Id fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class GetApplicationsByPropertyId {
  static readonly type = '[user] get Applications By Property Id';
  constructor(
    public id: string,
    public parameters: ApplicationFilterParameters
  ) {}
}

export class GetApplicationsByStatus {
  static readonly type = '[user] get Applications By Status';
  constructor(public payload: number) {}
}

export class UpdateApplication {
  static readonly type = '[user] update Application';
  constructor(public payload: ApplicationUpdate) {}
}

export class OnUpdateApplicationFail {
  static readonly type = '[user] update Application fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnUpdateApplicationSuccess {
  static readonly type = '[user] update Application success';
  constructor(public payload: Application) {}
}

export class GetFilteredChildren {
  static readonly type = '[user] get Filtered Children';
  constructor() {}
}

export class ResetProviderWorkshopDetails {
  static readonly type = '[user] clear Provider And Workshop Details';
  constructor() {}
}
