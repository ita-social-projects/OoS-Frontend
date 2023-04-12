import { HttpErrorResponse } from '@angular/common/http';
import { BaseAdmin, BaseAdminBlockData, BaseAdminParameters } from 'shared/models/admin.model';
import { AdminRoles, AdminTabTypes } from '../enum/admins';
import { Direction, DirectionParameters } from '../models/category.model';
import { ChildrenParameters } from '../models/child.model';
import { FilterData } from '../models/history-log.model';
import { BlockProviderData } from '../models/provider.model';
import { ProviderParameters } from '../models/provider.model';
import { RegionAdmin, RegionAdminBlockData, RegionAdminParameters } from '../models/regionAdmin.model';
import { StatisticParameters } from '../models/statistic.model';
import { CompanyInformation } from '../models/сompanyInformation.model';
import { MinistryAdmin, MinistryAdminParameters, MinistryAdminBlockData } from './../models/ministryAdmin.model';

export class GetPlatformInfo {
  static readonly type = '[admin] Get Information Platform Info';
  constructor() {}
}

export class GetAboutPortal {
  static readonly type = '[admin] Get AboutPortal';
  constructor() {}
}
export class GetMainPageInformation {
  static readonly type = '[admin] Get Main Page Information';
  constructor() {}
}
export class GetSupportInformation {
  static readonly type = '[admin] Get SupportInformation';
  constructor() {}
}
export class GetFilteredProviders {
  static readonly type = '[admin] Get filtered Providers';
  constructor(public providerParameters: ProviderParameters) {}
}

export class GetLawsAndRegulations {
  static readonly type = '[admin] Get LawsAndRegulations';
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

export class UpdatePlatformInfo {
  static readonly type = '[admin] Update Information Platform Info';
  constructor(public payload: CompanyInformation, public type: AdminTabTypes) {}
}
export class OnUpdatePlatformInfoFail {
  static readonly type = '[admin] update Information Platform Info Fail';
  constructor(public payload: Error) {}
}
export class OnUpdatePlatformInfoSuccess {
  static readonly type = '[admin] update Information Platform Info Success';
  constructor(public payload: CompanyInformation, public type: AdminTabTypes) {}
}
export class DeleteDirectionById {
  static readonly type = '[admin] delete Direction';
  constructor(public payload: number, public directionParameters: DirectionParameters) {}
}
export class OnDeleteDirectionFail {
  static readonly type = '[admin] delete Direction fail';
  constructor(public payload: Error) {}
}
export class OnDeleteDirectionSuccess {
  static readonly type = '[admin] delete Direction success';
  constructor(public directionParameters: DirectionParameters) {}
}
export class CreateDirection {
  static readonly type = '[admin] create Direction';
  constructor(public payload: Direction) {}
}
export class OnCreateDirectionFail {
  static readonly type = '[admin] create Direction fail';
  constructor(public payload: Error) {}
}
export class OnCreateDirectionSuccess {
  static readonly type = '[admin] create Direction success';
  constructor(public payload: Direction) {}
}
export class UpdateDirection {
  static readonly type = '[admin] update Direction';
  constructor(public payload: Direction) {}
}
export class OnUpdateDirectionFail {
  static readonly type = '[admin] update Direction fail';
  constructor(public payload: Error) {}
}
export class OnUpdateDirectionSuccess {
  static readonly type = '[admin] update Direction success';
  constructor(public payload: Direction) {}
}
export class GetDirectionById {
  static readonly type = '[admin] get Direction By Direction Id';
  constructor(public payload: number) {}
}

export class GetFilteredDirections {
  static readonly type = '[admin] Get Filtered Directions';
  constructor(public parameters: DirectionParameters) {}
}

export class GetChildrenForAdmin {
  static readonly type = '[admin] Get Children';
  constructor(public parameters: ChildrenParameters) {}
}

export class GetProviderHistory {
  static readonly type = '[admin] Get Provider History';
  constructor(public payload?: FilterData, public searchSting?: string) {}
}

export class GetProviderAdminHistory {
  static readonly type = '[admin] Get Provider Admin History';
  constructor(public payload?: FilterData, public searchSting?: string) {}
}

export class GetApplicationHistory {
  static readonly type = '[admin] Get Application History';
  constructor(public payload?: FilterData, public searchSting?: string) {}
}

export class GetMinistryAdminProfile {
  static readonly type = '[admin] Get Ministry Admin Profile';
  constructor() {}
}

export class CreateAdmin {
  static readonly type = '[admin] create Admin';
  constructor(public payload: BaseAdmin, public adminType: AdminRoles) {}
}

export class CreateMinistryAdmin {
  static readonly type = '[admin] create Ministry Admin';
  constructor(public payload: MinistryAdmin) {}
}

export class OnCreateMinistryAdminFail {
  static readonly type = '[admin] create Ministry Admin fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnCreateMinistryAdminSuccess {
  static readonly type = '[admin] create Ministry Admin success';
  constructor() {}
}

export class GetRegionAdminProfile {
  static readonly type = '[admin] Get Region Admin Profile';
  constructor() {}
}

export class CreateRegionAdmin {
  static readonly type = '[admin] create Region Admin';
  constructor(public payload: RegionAdmin) {}
}

export class OnCreateRegionAdminFail {
  static readonly type = '[admin] create Region Admin fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnCreateRegionAdminSuccess {
  static readonly type = '[admin] create Region Admin success';
  constructor() {}
}

export class GetAllMinistryAdmins {
  static readonly type = '[admin] Get All Ministry Admins';
  constructor(public parameters?: MinistryAdminParameters) {}
}

export class GetAllAdmins {
  static readonly type = '[admin] Get All Admins';
  constructor(public adminType: AdminRoles, public parameters?: BaseAdminParameters) {}
}

export class GetAdminById {
  static readonly type = '[admin] Get Admin By Id';
  constructor(public payload: string, public adminType: AdminRoles) {}
}

export class GetMinistryAdminById {
  static readonly type = '[admin] Get Ministry Admin By Id';
  constructor(public payload: string) {}
}

export class DeleteAdminById {
  static readonly type = '[admin] delete Admin';
  constructor(public payload: string, public adminType: AdminRoles) {}
}

export class DeleteMinistryAdminById {
  static readonly type = '[admin] delete Ministry Admin';
  constructor(public payload: string) {}
}

export class OnDeleteMinistryAdminSuccess {
  static readonly type = '[admin] delete Ministry Admin success';
  constructor() {}
}

export class OnDeleteMinistryAdminFail {
  static readonly type = '[admin] delete Ministry Admin fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class GetAllRegionAdmins {
  static readonly type = '[admin] Get All Region Admins';
  constructor(public parameters?: RegionAdminParameters) {}
}

export class GetRegionAdminById {
  static readonly type = '[admin] Get Region Admin By Id';
  constructor(public payload: string) {}
}

export class DeleteRegionAdminById {
  static readonly type = '[admin] delete Region Admin';
  constructor(public payload: string) {}
}

export class OnDeleteRegionAdminSuccess {
  static readonly type = '[admin] delete Region Admin success';
  constructor() {}
}

export class OnDeleteRegionAdminFail {
  static readonly type = '[admin] delete Region Admin fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class BlockAdminById {
  static readonly type = '[admin] block Admin';
  constructor(public payload: BaseAdminBlockData, public adminType: AdminRoles) {}
}

export class BlockMinistryAdminById {
  static readonly type = '[admin] block Ministry Admin';
  constructor(public payload: MinistryAdminBlockData) {}
}

export class BlockProviderById {
  static readonly type = '[admin] block Provider';
  constructor(public payload: BlockProviderData, public parameters: MinistryAdminParameters) {}
}

export class OnBlockSuccess {
  static readonly type = '[admin] block success';
  constructor(public payload: MinistryAdminBlockData | BlockProviderData) {}
}

export class OnBlockFail {
  static readonly type = '[admin] block Ministry Admin fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class UpdateAdmin {
  static readonly type = '[admin] update Admin';
  constructor(public payload: BaseAdmin, public adminType: AdminRoles) {}
}

export class UpdateMinistryAdmin {
  static readonly type = '[admin] update Ministry Admin';
  constructor(public payload: MinistryAdmin) {}
}

export class OnUpdateMinistryAdminFail {
  static readonly type = '[admin] update Ministry Admin fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnUpdateMinistryAdminSuccess {
  static readonly type = '[admin] update Ministry Admin success';
  constructor(public payload: MinistryAdmin) {}
}

export class BlockRegionAdminById {
  static readonly type = '[admin] block Region Admin';
  constructor(public payload: RegionAdminBlockData) {}
}

export class UpdateRegionAdmin {
  static readonly type = '[admin] update Region Admin';
  constructor(public payload: RegionAdmin) {}
}

export class OnUpdateRegionAdminFail {
  static readonly type = '[admin] update Region Admin fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnUpdateRegionAdminSuccess {
  static readonly type = '[admin] update Region Admin success';
  constructor(public payload: RegionAdmin) {}
}

export class OnInstitutionTabSelection {
  static readonly type = '[admin] select institution tab';
  constructor(public payload: string) {}
}