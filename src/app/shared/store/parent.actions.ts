import { HttpErrorResponse } from '@angular/common/http';

import { Application } from 'shared/models/application.model';
import { Child, ChildrenParameters, RequestParams } from 'shared/models/child.model';
import { Favorite } from 'shared/models/favorite.model';
import { ParentBlockedData } from 'shared/models/parent.model';
import { PaginationParameters } from 'shared/models/query-parameters.model';
import { Rate } from 'shared/models/rating';

export class GetStatusIsAllowToApply {
  static readonly type = '[parent] get child status By child and workshop ids';
  constructor(public childId: string, public workshopId: string) {}
}

export class GetStatusAllowedToReview {
  static readonly type = '[parent] get parent status By parent id';
  constructor(public parentId: string, public workshopId: string) {}
}

export class GetReviewedStatus {
  static readonly type = '[parent] get reviewed status for workshop by parent id';
  constructor(public parentId: string, public workshopId: string) {}
}

export class GetFavoriteWorkshops {
  static readonly type = '[parent] get favorite parents workshops';
  constructor() {}
}

export class GetFavoriteWorkshopsByUserId {
  static readonly type = '[parent] get favorite workshops by UserId';
  constructor(public paginationParameters: PaginationParameters) {}
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
  constructor(public parameters: ChildrenParameters) {}
}

export class GetUsersChildById {
  static readonly type = '[parent] get users Children by Id';
  constructor(public payload: string) {}
}

export class GetAllUsersChildren {
  static readonly type = '[parent] get all users Children';
  constructor() {}
}

export class GetAllUsersChildrenByParentId {
  static readonly type = '[parent] get all users Children by Parent Id';
  constructor(public payload: RequestParams) {}
}

export class CreateChild {
  static readonly type = '[parent] create Child';
  constructor(public payload: Child) {}
}

export class OnCreateChildFail {
  static readonly type = '[parent] create Child fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnCreateChildSuccess {
  static readonly type = '[parent] create Child success';
  constructor() {}
}

export class CreateChildren {
  static readonly type = '[parent] create Children';
  constructor(public payload: Child[]) {}
}

export class OnCreateChildrenFail {
  static readonly type = '[parent] create Children fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnCreateChildrenSuccess {
  static readonly type = '[parent] create Children success';
  constructor(public multipleChildren?: boolean) {}
}

export class DeleteChildById {
  static readonly type = '[parent] delete Children';
  constructor(public payload: string, public parameters: ChildrenParameters) {}
}

export class OnDeleteChildSuccess {
  static readonly type = '[parent] delete Children success';
  constructor(public parameters: ChildrenParameters) {}
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
  constructor() {}
}

export class ResetSelectedChild {
  static readonly type = '[parent] reset selected child';
  constructor() {}
}

export class CreateRating {
  static readonly type = '[parent] create Rating';
  constructor(public payload: Rate) {}
}

export class OnCreateRatingFail {
  static readonly type = '[parent] create Rating fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnCreateRatingSuccess {
  static readonly type = '[parent] create Rating success';
  constructor() {}
}

export class DeleteRatingById {
  static readonly type = '[parent] delete Rating';
  constructor(public payload: number) {}
}

export class OnDeleteRatingFail {
  static readonly type = '[parent] delete Rating fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnDeleteRatingSuccess {
  static readonly type = '[parent] delete Rating success';
  constructor(public payload: number) {}
}

export class CreateApplication {
  static readonly type = '[parent] create Application';
  constructor(public payload: Application) {}
}

export class OnCreateApplicationFail {
  static readonly type = '[parent] create Application fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnCreateApplicationSuccess {
  static readonly type = '[parent] create Application success';
  constructor() {}
}

export class OnBlockParent {
  static readonly type = '[parent] block Parent';
  constructor(public payload: ParentBlockedData) {}
}

export class OnBlockParentSuccess {
  static readonly type = '[parent] block Parent success';
  constructor() {}
}

export class OnBlockParentFail {
  static readonly type = '[parent] block Parent fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnUnblockParent {
  static readonly type = '[parent] unblock Parent';
  constructor(public payload: ParentBlockedData) {}
}

export class OnUnblockParentSuccess {
  static readonly type = '[parent] unblock Parent success';
  constructor() {}
}

export class OnUnblockParentFail {
  static readonly type = '[parent] unblock Parent fail';
  constructor(public payload: HttpErrorResponse) {}
}
