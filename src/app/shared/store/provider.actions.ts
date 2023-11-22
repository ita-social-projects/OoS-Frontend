import { HttpErrorResponse } from '@angular/common/http';

import { ApplicationFilterParameters } from 'shared/models/application.model';
import { Achievement, AchievementParameters } from '../models/achievement.model';
import { BlockedParent, ProviderAdminBlockData } from '../models/block.model';
import { LicenseStatusData, Provider, ProviderParameters, ProviderStatusUpdateData } from '../models/provider.model';
import { ProviderAdmin, ProviderAdminParameters } from '../models/providerAdmin.model';
import { PaginationParameters } from '../models/queryParameters.model';
import { Workshop, WorkshopCardParameters, WorkshopProviderViewCard, WorkshopStatus } from '../models/workshop.model';

export class GetAchievementById {
  static readonly type = '[provider] get achievement By Id';
  constructor(public payload: string) {}
}

export class GetChildrenByWorkshopId {
  static readonly type = '[provider] get Children By Workshop Id';
  constructor(public payload: string) {}
}

export class GetAchievementsByWorkshopId {
  static readonly type = '[provider] get Achievements By Workshop Id';
  constructor(public payload: AchievementParameters) {}
}

export class UpdateAchievement {
  static readonly type = '[provider] update Achievement';
  constructor(public payload: Achievement) {}
}

export class OnUpdateAchievementFail {
  static readonly type = '[provider] update Achievement fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnUpdateAchievementSuccess {
  static readonly type = '[provider] update Achievement success';
  constructor(public payload: Achievement) {}
}

export class DeleteAchievementById {
  static readonly type = '[provider] delete Achievement';
  constructor(public payload: string) {}
}

export class CreateAchievement {
  static readonly type = '[provider] create Achievement';
  constructor(public payload: Achievement) {}
}

export class OnCreateAchievementFail {
  static readonly type = '[provider] create Achievement fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnCreateAchievementSuccess {
  static readonly type = '[provider] create Achievement success';
  constructor(public payload: Achievement) {}
}

export class OnDeleteAchievementSuccess {
  static readonly type = '[provider] delete Achievement success';
  constructor(public payload: string) {}
}

export class OnDeleteAchievementFail {
  static readonly type = '[provider] delete Achievement fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class GetProviderAdminWorkshops {
  static readonly type = '[provider] get Workshops for provider admin';
  constructor(public parameters: PaginationParameters) {}
}

export class GetProviderViewWorkshops {
  static readonly type = '[provider] get Workshops for provider cabinet';
  constructor(public workshopCardParameters: WorkshopCardParameters) {}
}

export class GetFilteredProviderAdmins {
  static readonly type = '[provider] get filtered provider admin users';
  constructor(public payload: ProviderAdminParameters) {}
}

export class GetWorkshopListByProviderId {
  static readonly type = '[user] get Workshop List By Provider Id';
  constructor(public payload: string) {}
}

export class GetWorkshopListByProviderAdminId {
  static readonly type = '[user] get Workshop List By Provider Admin Id';
  constructor(public id: string) {}
}

export class CreateWorkshop {
  static readonly type = '[provider] create Workshop';
  constructor(public payload: Workshop) {}
}

export class OnCreateWorkshopFail {
  static readonly type = '[provider] create Workshop fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnCreateWorkshopSuccess {
  static readonly type = '[provider] create Workshop success';
  constructor(public payload: Workshop) {}
}

export class UpdateWorkshop {
  static readonly type = '[provider] update Workshop';
  constructor(public payload: Workshop) {}
}

export class OnUpdateWorkshopFail {
  static readonly type = '[provider] update Workshop fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnUpdateWorkshopSuccess {
  static readonly type = '[provider] update Workshop success';
  constructor(public payload: Workshop) {}
}

export class DeleteWorkshopById {
  static readonly type = '[provider] delete Workshop';
  constructor(public payload: WorkshopProviderViewCard, public parameters: WorkshopCardParameters) {}
}

export class OnDeleteWorkshopSuccess {
  static readonly type = '[provider] delete Workshop success';
  constructor(public parameters: WorkshopCardParameters) {}
}

export class OnDeleteWorkshopFail {
  static readonly type = '[provider] delete Workshop fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class CreateProvider {
  static readonly type = '[provider] create Provider';
  constructor(public payload: Provider, public isImagesFeature: boolean) {}
}

export class OnCreateProviderFail {
  static readonly type = '[provider] create Provider fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnCreateProviderSuccess {
  static readonly type = '[provider] create Provider success';
  constructor(public payload: Provider) {}
}

export class UpdateProvider {
  static readonly type = '[provider] update Provider';
  constructor(public payload: Provider, public isImagesFeature: boolean) {}
}

export class OnUpdateProviderFail {
  static readonly type = '[provider] update Provider fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnUpdateProviderSuccess {
  static readonly type = '[provider] update Provider success';
  constructor() {}
}

export class UpdateProviderStatus {
  static readonly type = '[provider] update Provider status';
  constructor(public payload: ProviderStatusUpdateData, public providerParameters: ProviderParameters) {}
}

export class UpdateProviderLicenseStatus {
  static readonly type = '[provider] update provider license status';
  constructor(public payload: LicenseStatusData, public providerParameters: ProviderParameters) {}
}

export class OnUpdateProviderStatusFail {
  static readonly type = '[provider] update Provider status fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnUpdateProviderStatusSuccess {
  static readonly type = '[provider] update Provider status success';
  constructor(public payload: ProviderStatusUpdateData, public providerParameters: ProviderParameters) {}
}

export class CreateProviderAdmin {
  static readonly type = '[provider] create Provider Admin';
  constructor(public payload: ProviderAdmin) {}
}

export class OnCreateProviderAdminFail {
  static readonly type = '[provider] create Provider Admin fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnCreateProviderAdminSuccess {
  static readonly type = '[provider] create Provider Admin success';
  constructor(public payload: ProviderAdmin) {}
}

export class BlockProviderAdminById {
  static readonly type = '[provider] block Provider Admin';
  constructor(public payload: ProviderAdminBlockData, public filterParams: ProviderAdminParameters) {}
}

export class OnBlockProviderAdminSuccess {
  static readonly type = '[provider] block Provider Admin success';
  constructor(public payload: ProviderAdminBlockData, public filterParams: ProviderAdminParameters) {}
}

export class OnBlockProviderAdminFail {
  static readonly type = '[provider] block Provider Admin fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class DeleteProviderAdminById {
  static readonly type = '[provider] delete Provider Admin';
  constructor(public payload: ProviderAdminBlockData, public filterParams: ProviderAdminParameters) {}
}

export class OnDeleteProviderAdminSuccess {
  static readonly type = '[provider] delete Provider Admin success';
  constructor(public filterParams: ProviderAdminParameters) {}
}

export class OnDeleteProviderAdminFail {
  static readonly type = '[provider] delete Provider Admin fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class UpdateProviderAdmin {
  static readonly type = '[provider] update Provider Admin';
  constructor(public providerId: string, public providerAdmin: ProviderAdmin) {}
}

export class OnUpdateProviderAdminFail {
  static readonly type = '[provider] update Provider Admin fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnUpdateProviderAdminSuccess {
  static readonly type = '[provider] update Provider Admin success';
  constructor(public payload: ProviderAdmin) {}
}

export class UpdateWorkshopStatus {
  static readonly type = '[provider] update Status';
  constructor(public payload: WorkshopStatus, public providerId: string) {}
}

export class OnUpdateWorkshopStatusSuccess {
  static readonly type = '[provider] update Status success';
  constructor(public payload: string) {}
}

export class OnUpdateWorkshopStatusFail {
  static readonly type = '[provider] update Status fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class BlockParent {
  static readonly type = '[provider] block parent';
  constructor(public payload: BlockedParent, public parameters: ApplicationFilterParameters) {}
}

export class BlockParentFail {
  static readonly type = '[provider] block parent fail';
  constructor(public payload: Error) {}
}

export class BlockParentSuccess {
  static readonly type = '[provider] block parent success';
  constructor(public payload: BlockedParent, public parameters: ApplicationFilterParameters) {}
}

export class UnBlockParent {
  static readonly type = '[provider] unblock parent';
  constructor(public payload: BlockedParent, public parameters: ApplicationFilterParameters) {}
}

export class UnBlockParentFail {
  static readonly type = '[provider] unblock parent fail';
  constructor(public payload: Error) {}
}

export class UnBlockParentSuccess {
  static readonly type = '[provider] unblock parent success';
  constructor(public payload: BlockedParent, public parameters: ApplicationFilterParameters) {}
}

export class GetBlockedParents {
  static readonly type = '[provider] get block parent';
  constructor(public providerId: string, public parentId: string) {}
}

export class OnClearBlockedParents {
  static readonly type = '[provider] clear blockedParents state';
  constructor() {}
}

export class ResetAchievements {
  static readonly type = '[provider] reset achievements';
  constructor() {}
}

export class DeleteProviderById {
  static readonly type = '[provider] delete Provider By Id';
  constructor(public payload: string, public providerParameters: ProviderParameters) {}
}

export class OnDeleteProviderByIdSuccess {
  static readonly type = '[provider] delete Provider By Id success';
  constructor(public payload: string, public providerParameters: ProviderParameters) {}
}

export class OnDeleteProviderByIdFail {
  static readonly type = '[provider] delete Provider By Id fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class GetProviderAdminById {
  static readonly type = '[provider] get provider admin by id';
  constructor(public payload: string) {
  }
}

export class ReinviteProviderAdmin {
  static readonly type = '[provider] reinvites provider admin';
  constructor(public providerAdmin: ProviderAdmin) {
  }
}
