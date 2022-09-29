import { HttpErrorResponse } from '@angular/common/http';
import { Application } from '../models/application.model';
import { Child } from '../models/child.model';
import { Favorite } from '../models/favorite.model';
import { RequestParams } from '../models/child.model';

export class GetStatusIsAllowToApply {
  static readonly type = '[parent] get child status By child and workshop ids';
  constructor(public childId: string, public workshopId: string) {}
}

export class GetStatusAllowedToReview {
  static readonly type = '[parent] get parent status By parent id';
  constructor(public parentId: string, public workshopId: string) {}
}

export class GetReviewedApplications {
  static readonly type = '[parent] get reviewed applications By parent id';
  constructor(public parentId: string, public workshopId: string) {}
}

export class GetFavoriteWorkshops {
  static readonly type = '[parent] get favorite parents workshops';
  constructor() {}
}

export class GetFavoriteWorkshopsByUserId {
  static readonly type = '[parent] get favorite workshops by UserId';
  constructor() {}
}

export class CreateFavoriteWorkshop {
  static readonly type = '[parent] create favorite workshop';
  constructor(public payload: Favorite) {}
}

export class DeleteFavoriteWorkshop {
  static readonly type = '[parent] delete favorite workshop';
  constructor(public payload: string) {}
}

export class GetUsersChildren {
  static readonly type = '[parent] get users Children';
  constructor() {}
}

export class GetUsersChildById {
  static readonly type = '[parent] get users Children by Id';
  constructor(public payload: string) {}
}

export class GetAllUsersChildren {
  static readonly type = '[parent] get all users Children';
  constructor() {}
}

export class GetAllUsersChildrenByParentId{
  static readonly type = '[parent] get all users Children by Parent Id';
  constructor(public payload: RequestParams) {}
}

export class CreateChildren {
  static readonly type = '[parent] create Children';
  constructor(public payload: Child) {}
}

export class OnCreateChildrenFail {
  static readonly type = '[parent] create Children fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnCreateChildrenSuccess {
  static readonly type = '[parent] create Children success';
  constructor(public payload) {}
}

export class DeleteChildById {
  static readonly type = '[parent] delete Children';
  constructor(public payload: string) {}
}

export class OnDeleteChildSuccess {
  static readonly type = '[parent] delete Children success';
  constructor(public payload) {}
}

export class OnDeleteChildFail {
  static readonly type = '[parent] delete Children fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class UpdateChild {
  static readonly type = '[parent] update Child';
  constructor(public payload: Child) {}
}

export class OnUpdateChildFail {
  static readonly type = '[parent] update Child fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnUpdateChildSuccess {
  static readonly type = '[parent] update Child success';
  constructor(public payload) {}
}

export class ResetSelectedChild {
  static readonly type = '[parent] reset selected child';
  constructor() {}
}

export class CreateRating {
  static readonly type = '[parent] create Rating';
  constructor(public payload: any) {}
}

export class OnCreateRatingFail {
  static readonly type = '[parent] create Rating fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnCreateRatingSuccess {
  static readonly type = '[parent] create Rating success';
  constructor(public payload) {}
}

export class CreateApplication {
  static readonly type = '[parent] create Application';
  constructor(public payload: Application) {}
}

export class OnCreateApplicationFail {
  static readonly type = '[parent] create Application fail';
  constructor(public payload) {}
}

export class OnCreateApplicationSuccess {
  static readonly type = '[parent] create Application success';
  constructor(public payload) {}
}
