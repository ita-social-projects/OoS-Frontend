import { HttpErrorResponse } from '@angular/common/http';
import { ApplicationParameters } from 'src/app/shared/models/application.model';
import { Achievement } from '../models/achievement.model';
import { Application, ApplicationUpdate } from '../models/application.model';
import { BlockedParent } from '../models/block.model';
import { Child } from '../models/child.model';
import { Provider } from '../models/provider.model';
import { ProviderAdmin } from '../models/providerAdmin.model';
import { Workshop, WorkshopCard, WorkshopStatus } from '../models/workshop.model';
import { Favorite } from './../models/favorite.model';

export class GetWorkshopsByProviderId {
  static readonly type = '[user] get Workshops By Provider Id';
  constructor(public payload: string, public excludedWorkshopId?: string) { }
}
export class GetProviderAdminWorkshops {
  static readonly type = '[user] get Workshops for provider admin';
  constructor() { }
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
export class GetStatusIsAllowToApply {
  static readonly type = '[user] get child status By child and workshop ids';
  constructor(public childId: string, public workshopId: string) { }
}
export class GetStatusAllowedToReview {
  static readonly type = '[user] get parent status By parent id';
  constructor(public parentId: string, public workshopId: string) { }
}
export class GetReviewedApplications {
  static readonly type = '[user] get reviewed applications By parent id';
  constructor(public parentId: string, public workshopId: string) { }
}
export class GetApplicationsByProviderId {
  static readonly type = '[user] get Applications By Provider Id';
  constructor(public id: string, public parameters: ApplicationParameters) { }
}
export class GetApplicationsByStatus {
  static readonly type = '[user] get Applications By Status';
  constructor(public payload: number) { }
}
export class GetUsersChildren {
  static readonly type = '[user] get users Children';
  constructor() { }
}
export class GetUsersChildById {
  static readonly type = '[user] get users Children by Id';
  constructor(public payload: string) { }
}
export class GetAllUsersChildren {
  static readonly type = '[user] get all users Children';
  constructor() { }
}
export class CreateWorkshop {
  static readonly type = '[user] create Workshop';
  constructor(public payload: Workshop) { }
}
export class OnCreateWorkshopFail {
  static readonly type = '[user] create Workshop fail';
  constructor(public payload: HttpErrorResponse) { }
}
export class OnCreateWorkshopSuccess {
  static readonly type = '[user] create Workshop success';
  constructor(public payload) { }
}
export class DeleteWorkshopById {
  static readonly type = '[user] delete Workshop';
  constructor(public payload: WorkshopCard) { }
}
export class OnDeleteWorkshopSuccess {
  static readonly type = '[user] delete Workshop success';
  constructor(public payload: WorkshopCard) { }
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
  constructor(public payload: HttpErrorResponse) { }
}
export class OnCreateChildrenSuccess {
  static readonly type = '[user] create Children success';
  constructor(public payload) { }
}
export class DeleteChildById {
  static readonly type = '[user] delete Children';
  constructor(public payload: string) { }
}
export class OnDeleteChildSuccess {
  static readonly type = '[user] delete Children success';
  constructor(public payload) { }
}
export class OnDeleteChildFail {
  static readonly type = '[user] delete Children fail';
  constructor(public payload: HttpErrorResponse) { }
}
export class CreateProvider {
  static readonly type = '[parent] create Provider';
  constructor(public payload: Provider, public isRelease3: boolean) { }
}
export class OnCreateProviderFail {
  static readonly type = '[user] create Provider fail';
  constructor(public payload: HttpErrorResponse) { }
}
export class OnCreateProviderSuccess {
  static readonly type = '[user] create Provider success';
  constructor(public payload) { }
}
export class CreateProviderAdmin {
  static readonly type = '[user] create Provider Admin';
  constructor(public payload: ProviderAdmin) { }
}
export class OnCreateProviderAdminFail {
  static readonly type = '[user] create Provider Admin fail';
  constructor(public payload: HttpErrorResponse) { }
}
export class OnCreateProviderAdminSuccess {
  static readonly type = '[user] create Provider Admin success';
  constructor(public payload) { }
}
export class BlockProviderAdminById {
  static readonly type = '[user] block Provider Admin';
  constructor(public payload) { }
}
export class OnBlockProviderAdminSuccess {
  static readonly type = '[user] block Provider Admin success';
  constructor(public payload) { }
}
export class OnBlockProviderAdminFail {
  static readonly type = '[user] block Provider Admin fail';
  constructor(public payload) { }
}
export class DeleteProviderAdminById {
  static readonly type = '[user] delete Provider Admin';
  constructor(public payload) { }
}
export class OnDeleteProviderAdminSuccess {
  static readonly type = '[user] delete Provider Admin success';
  constructor(public payload) { }
}
export class OnDeleteProviderAdminFail {
  static readonly type = '[user] delete Provider Admin fail';
  constructor(public payload) { }
}

export class CreateApplication {
  static readonly type = '[user] create Application';
  constructor(public payload: Application) { }
}
export class OnCreateApplicationFail {
  static readonly type = '[user] create Application fail';
  constructor(public payload) { }
}
export class OnCreateApplicationSuccess {
  static readonly type = '[user] create Application success';
  constructor(public payload) { }
}
export class UpdateWorkshop {
  static readonly type = '[user] update Workshop';
  constructor(public payload: Workshop) { }
}
export class OnUpdateWorkshopFail {
  static readonly type = '[user] update Workshop fail';
  constructor(public payload: HttpErrorResponse) { }
}
export class OnUpdateWorkshopSuccess {
  static readonly type = '[user] update Workshop success';
  constructor(public payload) { }
}
export class UpdateStatus {
  static readonly type = '[user] update Status';
  constructor(public payload: WorkshopStatus, public providerId: string) { }
}
export class OnUpdateStatusSuccess {
  static readonly type = '[user] update Status success';
  constructor(public payload: string) { }
}
export class OnUpdateStatusFail {
  static readonly type = '[user] update Status fail';
  constructor(public payload: HttpErrorResponse) { }
}
export class UpdateChild {
  static readonly type = '[user] update Child';
  constructor(public payload: Child) { }
}
export class OnUpdateChildFail {
  static readonly type = '[user] update Child fail';
  constructor(public payload: HttpErrorResponse) { }
}
export class OnUpdateChildSuccess {
  static readonly type = '[user] update Child success';
  constructor(public payload) { }
}
export class UpdateProvider {
  static readonly type = '[user] update Provider';
  constructor(public payload: Provider, public isRelease3: boolean) { }
}
export class OnUpdateProviderFail {
  static readonly type = '[user] update Provider fail';
  constructor(public payload: HttpErrorResponse) { }
}
export class OnUpdateProviderSuccess {
  static readonly type = '[user] update Provider success';
  constructor(public payload) { }
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
  constructor(public payload) { }
}
export class CreateRating {
  static readonly type = '[parent] create Rating';
  constructor(public payload: any) { }
}
export class OnCreateRatingFail {
  static readonly type = '[user] create Rating fail';
  constructor(public payload: HttpErrorResponse) { }
}
export class OnCreateRatingSuccess {
  static readonly type = '[user] create Rating success';
  constructor(public payload) { }
}
export class GetFavoriteWorkshops {
  static readonly type = '[favorite] get favorite parents workshops';
  constructor() { }
}
export class GetFavoriteWorkshopsByUserId {
  static readonly type = '[favorite] get favorite workshops by UserId';
  constructor() { }
}
export class CreateFavoriteWorkshop {
  static readonly type = '[favorite] create favorite workshop';
  constructor(public payload: Favorite) { }
}
export class DeleteFavoriteWorkshop {
  static readonly type = '[favorite] delete favorite workshop';
  constructor(public payload: string) { }
}
export class GetAllProviderAdmins {
  static readonly type = '[user] get all users ProviderAdmins';
  constructor() { }
}
export class GetFilteredChildrens {
  static readonly type = '[user] Get Filtered Childrens';
  constructor() { }
}
export class ResetProviderWorkshopDetails {
  static readonly type = '[user] clear provider and workshop details';
  constructor() { }
}
export class ResetSelectedChild  {
  static readonly type = '[user] reset selected child';
  constructor() { }
}
export class BlockParent {
  static readonly type = '[user] block parent';
  constructor(public payload: BlockedParent) { }
}

export class BlockParentFail {
  static readonly type = '[user] block parent fail';
  constructor(public payload: Error) { }
}
export class BlockParentSuccess {
  static readonly type = '[user] block parent success';
  constructor(public payload: BlockedParent) { }
}

export class UnBlockParent {
  static readonly type = '[user] unblock parent';
  constructor(public payload: BlockedParent) { }
}

export class UnBlockParentFail {
  static readonly type = '[user] unblock parent fail';
  constructor(public payload: Error) { }
}
export class UnBlockParentSuccess {
  static readonly type = '[user] unblock parent success';
  constructor(public payload: BlockedParent) { }
}
export class GetBlockedParents {
  static readonly type = '[user] get block parent';
  constructor(public providerId: string, public parentId: string) { }
}
export class OnClearBlockedParents {
  static readonly type = '[user] clear blockedParents state';
  constructor( ) { }
}
