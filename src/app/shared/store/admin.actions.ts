import { HttpErrorResponse } from '@angular/common/http';

import { BaseAdmin, BaseAdminBlockData, BaseAdminParameters } from 'shared/models/admin.model';
import {
  TerritorialCommunityAdmin,
  TerritorialCommunityAdminBlockData,
  TerritorialCommunityAdminParameters
} from 'shared/models/territorialCommunityAdmin.model';
import { AdminRoles, AdminTabTypes } from '../enum/admins';
import { Direction, DirectionParameters } from '../models/category.model';
import { ChildrenParameters } from '../models/child.model';
import { FilterData } from '../models/history-log.model';
import { BlockProviderData, ProviderParameters } from '../models/provider.model';
import { RegionAdmin, RegionAdminBlockData, RegionAdminParameters } from '../models/regionAdmin.model';
import { StatisticParameters } from '../models/statistic.model';
import { CompanyInformation } from '../models/сompanyInformation.model';
import { MinistryAdmin, MinistryAdminBlockData, MinistryAdminParameters } from './../models/ministryAdmin.model';

export class GetAboutPortal {
  static readonly type = '[admin] Get About Portal';

  constructor() {}
}

export class GetMainPageInformation {
  static readonly type = '[admin] Get Main Page Information';

  constructor() {}
}

export class GetSupportInformation {
  static readonly type = '[admin] Get Support Information';

  constructor() {}
}

export class GetLawsAndRegulations {
  static readonly type = '[admin] Get Laws And Regulations';

  constructor() {}
}

export class GetStatisticReports {
  static readonly type = '[admin] Get Statistic Reports';

  constructor(public parameters: StatisticParameters) {}
}

export class DownloadStatisticReport {
  static readonly type = '[admin] Download Statistic Report';

  constructor(public externalStorageId: string) {}
}

export class GetPlatformInfo {
  static readonly type = '[admin] Get Information Platform Info';

  constructor() {}
}

export class UpdatePlatformInfo {
  static readonly type = '[admin] Update Information Platform Info';

  constructor(public payload: CompanyInformation, public type: AdminTabTypes) {}
}

export class OnUpdatePlatformInfoFail {
  static readonly type = '[admin] Update Information Platform Info Fail';

  constructor(public payload: Error) {}
}

export class OnUpdatePlatformInfoSuccess {
  static readonly type = '[admin] Update Information Platform Info Success';

  constructor(public payload: CompanyInformation, public type: AdminTabTypes) {}
}

export class GetFilteredDirections {
  static readonly type = '[admin] Get Filtered Directions';

  constructor(public parameters: DirectionParameters) {}
}

export class GetDirectionById {
  static readonly type = '[admin] Get Direction By Direction Id';

  constructor(public payload: number) {}
}

export class CreateDirection {
  static readonly type = '[admin] Create Direction';

  constructor(public payload: Direction) {}
}

export class OnCreateDirectionFail {
  static readonly type = '[admin] Create Direction Fail';

  constructor(public payload: Error) {}
}

export class OnCreateDirectionSuccess {
  static readonly type = '[admin] Create Direction Success';

  constructor(public payload: Direction) {}
}

export class UpdateDirection {
  static readonly type = '[admin] Update Direction';

  constructor(public payload: Direction) {}
}

export class OnUpdateDirectionFail {
  static readonly type = '[admin] Update Direction Fail';

  constructor(public payload: Error) {}
}

export class OnUpdateDirectionSuccess {
  static readonly type = '[admin] Update Direction Success';

  constructor(public payload: Direction) {}
}

export class DeleteDirectionById {
  static readonly type = '[admin] Delete Direction';

  constructor(public payload: number, public directionParameters: DirectionParameters) {}
}

export class OnDeleteDirectionFail {
  static readonly type = '[admin] Delete Direction Fail';

  constructor(public payload: Error) {}
}

export class OnDeleteDirectionSuccess {
  static readonly type = '[admin] Delete Direction Success';

  constructor(public directionParameters: DirectionParameters) {}
}

export class GetApplicationHistory {
  static readonly type = '[admin] Get Application History';

  constructor(public payload?: FilterData, public searchSting?: string) {}
}

export class GetChildrenForAdmin {
  static readonly type = '[admin] Get Children';

  constructor(public parameters: ChildrenParameters) {}
}

export class GetFilteredProviders {
  static readonly type = '[admin] Get Filtered Providers';

  constructor(public providerParameters: ProviderParameters) {}
}

export class GetProviderHistory {
  static readonly type = '[admin] Get Provider History';

  constructor(public payload?: FilterData, public searchSting?: string) {}
}

export class GetProviderAdminHistory {
  static readonly type = '[admin] Get Provider Admin History';

  constructor(public payload?: FilterData, public searchSting?: string) {}
}

export class BlockProviderById {
  static readonly type = '[admin] Block Provider';

  constructor(public payload: BlockProviderData, public parameters: MinistryAdminParameters) {}
}

export class GetAllAdmins {
  static readonly type = '[admin] Get All Admins';

  constructor(public adminType: AdminRoles, public parameters?: BaseAdminParameters) {}
}

export class GetAdminById {
  static readonly type = '[admin] Get Admin By Id';

  constructor(public payload: string, public adminType: AdminRoles) {}
}

export class CreateAdmin {
  static readonly type = '[admin] Create Admin';

  constructor(public payload: BaseAdmin, public adminType: AdminRoles) {}
}

export class UpdateAdmin {
  static readonly type = '[admin] Update Admin';

  constructor(public payload: BaseAdmin, public adminType: AdminRoles) {}
}

export class DeleteAdminById {
  static readonly type = '[admin] Delete Admin';

  constructor(public payload: string, public adminType: AdminRoles) {}
}

export class BlockAdminById {
  static readonly type = '[admin] Block Admin';

  constructor(public payload: BaseAdminBlockData, public adminType: AdminRoles) {}
}

export class GetAllMinistryAdmins {
  static readonly type = '[admin] Get All Ministry Admins';

  constructor(public parameters?: MinistryAdminParameters) {}
}

export class GetMinistryAdminById {
  static readonly type = '[admin] Get Ministry Admin By Id';

  constructor(public payload: string) {}
}

export class GetMinistryAdminProfile {
  static readonly type = '[admin] Get Ministry Admin Profile';

  constructor() {}
}

export class CreateMinistryAdmin {
  static readonly type = '[admin] Create Ministry Admin';

  constructor(public payload: MinistryAdmin) {}
}

export class OnCreateMinistryAdminFail {
  static readonly type = '[admin] Create Ministry Admin Fail';

  constructor(public payload: HttpErrorResponse) {}
}

export class OnCreateMinistryAdminSuccess {
  static readonly type = '[admin] Create Ministry Admin Success';

  constructor() {}
}

export class UpdateMinistryAdmin {
  static readonly type = '[admin] Update Ministry Admin';

  constructor(public payload: MinistryAdmin) {}
}

export class OnUpdateMinistryAdminFail {
  static readonly type = '[admin] Update Ministry Admin Fail';

  constructor(public payload: HttpErrorResponse) {}
}

export class OnUpdateMinistryAdminSuccess {
  static readonly type = '[admin] Update Ministry Admin Success';

  constructor(public payload: MinistryAdmin) {}
}

export class DeleteMinistryAdminById {
  static readonly type = '[admin] Delete Ministry Admin';

  constructor(public payload: string) {}
}

export class OnDeleteMinistryAdminSuccess {
  static readonly type = '[admin] Delete Ministry Admin Success';

  constructor() {}
}

export class OnDeleteMinistryAdminFail {
  static readonly type = '[admin] Delete Ministry Admin Fail';

  constructor(public payload: HttpErrorResponse) {}
}

export class BlockMinistryAdminById {
  static readonly type = '[admin] Block Ministry Admin';

  constructor(public payload: MinistryAdminBlockData) {}
}

export class GetAllRegionAdmins {
  static readonly type = '[admin] Get All Region Admins';

  constructor(public parameters?: RegionAdminParameters) {}
}

export class GetRegionAdminById {
  static readonly type = '[admin] Get Region Admin By Id';

  constructor(public payload: string) {}
}

export class GetRegionAdminProfile {
  static readonly type = '[admin] Get Region Admin Profile';

  constructor() {}
}

export class CreateRegionAdmin {
  static readonly type = '[admin] Create Region Admin';

  constructor(public payload: RegionAdmin) {}
}

export class OnCreateRegionAdminFail {
  static readonly type = '[admin] Create Region Admin Fail';

  constructor(public payload: HttpErrorResponse) {}
}

export class OnCreateRegionAdminSuccess {
  static readonly type = '[admin] Create Region Admin Success';

  constructor() {}
}

export class UpdateRegionAdmin {
  static readonly type = '[admin] Update Region Admin';

  constructor(public payload: RegionAdmin) {}
}

export class OnUpdateRegionAdminFail {
  static readonly type = '[admin] Update Region Admin Fail';

  constructor(public payload: HttpErrorResponse) {}
}

export class OnUpdateRegionAdminSuccess {
  static readonly type = '[admin] Update Region Admin Success';

  constructor(public payload: RegionAdmin) {}
}

export class DeleteRegionAdminById {
  static readonly type = '[admin] Delete Region Admin';

  constructor(public payload: string) {}
}

export class OnDeleteRegionAdminSuccess {
  static readonly type = '[admin] Delete Region Admin Success';

  constructor() {}
}

export class OnDeleteRegionAdminFail {
  static readonly type = '[admin] Delete Region Admin Fail';

  constructor(public payload: HttpErrorResponse) {}
}

export class BlockRegionAdminById {
  static readonly type = '[admin] Block Region Admin';

  constructor(public payload: RegionAdminBlockData) {}
}

export class GetAllTerritorialCommunityAdmins {
  static readonly type = '[admin] Get All Territorial Community Admins';

  constructor(public parameters?: TerritorialCommunityAdminParameters) {}
}

export class GetTerritorialCommunityAdminById {
  static readonly type = '[admin] Get Territorial Community Admin By Id';

  constructor(public payload: string) {}
}

export class GetTerritorialCommunityAdminProfile {
  static readonly type = '[admin] Get Territorial Community Admin Profile';

  constructor() {}
}

export class CreateTerritorialCommunityAdmin {
  static readonly type = '[admin] Create Territorial Community Admin';

  constructor(public payload: TerritorialCommunityAdmin) {}
}

export class OnCreateTerritorialCommunityAdminFail {
  static readonly type = '[admin] Create Territorial Community Admin Fail';

  constructor(public payload: HttpErrorResponse) {}
}

export class OnCreateTerritorialCommunityAdminSuccess {
  static readonly type = '[admin] Create Territorial Community Admin Success';

  constructor() {}
}

export class UpdateTerritorialCommunityAdmin {
  static readonly type = '[admin] Update Territorial Community Admin';

  constructor(public payload: TerritorialCommunityAdmin) {}
}

export class OnUpdateTerritorialCommunityAdminFail {
  static readonly type = '[admin] Update Territorial Community Admin Fail';

  constructor(public payload: HttpErrorResponse) {}
}

export class OnUpdateTerritorialCommunityAdminSuccess {
  static readonly type = '[admin] Update Territorial Community Admin Success';

  constructor(public payload: TerritorialCommunityAdmin) {}
}

export class DeleteTerritorialCommunityAdminById {
  static readonly type = '[admin] Delete Territorial Community Admin';

  constructor(public payload: string) {}
}

export class OnDeleteTerritorialCommunityAdminSuccess {
  static readonly type = '[admin] Delete Territorial Community Admin Success';

  constructor() {}
}

export class OnDeleteTerritorialCommunityAdminFail {
  static readonly type = '[admin] Delete Territorial Community Admin Fail';

  constructor(public payload: HttpErrorResponse) {}
}

export class BlockTerritorialCommunityAdminById {
  static readonly type = '[admin] Block Territorial Community Admin';

  constructor(public payload: TerritorialCommunityAdminBlockData) {}
}

export class OnBlockSuccess {
  static readonly type = '[admin] Block Success';

  constructor(public payload: MinistryAdminBlockData | BlockProviderData) {}
}

export class OnBlockFail {
  static readonly type = '[admin] Block Fail';

  constructor(public payload: HttpErrorResponse) {}
}
