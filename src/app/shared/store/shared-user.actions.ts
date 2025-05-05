import { HttpErrorResponse } from '@angular/common/http';

import { Workshop, WorkshopDraft } from 'shared/models/workshop.model';
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

export class OnGetWorkshopByIdSuccess {
  static readonly type = '[user] get Workshop By Workshop Id success';
  constructor(public workshop: Workshop) {}
}

export class OnGetWorkshopByIdFail {
  static readonly type = '[user] get Workshop By Workshop Id fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class GetWorkshopDraftById {
  static readonly type = '[user] get Workshop Draft By Draft Id';
  constructor(public payload: string) {}
}

export class OnGetWorkshopDraftByIdSuccess {
  static readonly type = '[user] get Workshop Draft By Draft Id success';
  constructor(public payload: WorkshopDraft) {}
}

export class OnGetWorkshopDraftByIdFail {
  static readonly type = '[user] get Workshop Draft By Draft Id fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class GetCompetitionById {
  static readonly type = '[user] get Competition By Competition Id';
  constructor(public payload: string) {}
}

export class GetAllApplications {
  static readonly type = '[admin] Get All Applications';
  constructor(public params: ApplicationFilterParameters) {}
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

export class ResetProviderWorkshopAndCompetitionDetails {
  static readonly type = '[user] clear Provider, Workshop, Competition Details';
  constructor() {}
}
