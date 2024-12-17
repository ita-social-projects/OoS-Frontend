import { HttpErrorResponse } from '@angular/common/http';

import { AdminRoles, AdminTabTypes } from 'shared/enum/admins';
import { BaseAdmin, BaseAdminBlockData, BaseAdminParameters } from 'shared/models/admin.model';
import { AreaAdmin, AreaAdminBlockData, AreaAdminParameters } from 'shared/models/area-admin.model';
import { Direction, DirectionParameters } from 'shared/models/category.model';
import { ChildrenParameters } from 'shared/models/child.model';
import { CompanyInformation } from 'shared/models/company-information.model';
import { FilterData } from 'shared/models/history-log.model';
import { MinistryAdmin, MinistryAdminBlockData, MinistryAdminParameters } from 'shared/models/ministry-admin.model';
import { ProviderBlock, ProviderParameters } from 'shared/models/provider.model';
import { RegionAdmin, RegionAdminBlockData, RegionAdminParameters } from 'shared/models/region-admin.model';
import { StatisticParameters } from 'shared/models/statistic.model';

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

  constructor(
    public payload: CompanyInformation,
    public type: AdminTabTypes
  ) {}
}

export class OnUpdatePlatformInfoFail {
  static readonly type = '[admin] Update Information Platform Info Fail';

  constructor(public payload: Error) {}
}

export class OnUpdatePlatformInfoSuccess {
  static readonly type = '[admin] Update Information Platform Info Success';

  constructor(
    public payload: CompanyInformation,
    public type: AdminTabTypes
  ) {}
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

  constructor(
    public payload: number,
    public directionParameters: DirectionParameters
  ) {}
}

export class OnDeleteDirectionFail {
  static readonly type = '[admin] Delete Direction Fail';

  constructor(public payload: Error) {}
}

export class OnDeleteDirectionSuccess {
  static readonly type = '[admin] Delete Direction Success';

  constructor(public directionParameters: DirectionParameters) {}
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

  constructor(
    public payload?: FilterData,
    public searchSting?: string
  ) {}
}

export class GetEmployeeHistory {
  static readonly type = '[admin] Get Employee History';

  constructor(
    public payload?: FilterData,
    public searchSting?: string
  ) {}
}

export class GetApplicationHistory {
  static readonly type = '[admin] Get Application History';

  constructor(
    public payload?: FilterData,
    public searchSting?: string
  ) {}
}

export class GetParentsBlockingByAdminHistory {
  static readonly type = '[admin] Get Parents Blocking By Admin History';

  constructor(
    public payload?: FilterData,
    public searchSting?: string
  ) {}
}

export class BlockProviderById {
  static readonly type = '[admin] Block Provider';

  constructor(
    public payload: ProviderBlock,
    public parameters: ProviderParameters
  ) {}
}

export class GetAllAdmins {
  static readonly type = '[admin] Get All Admins';

  constructor(
    public adminType: AdminRoles,
    public parameters?: BaseAdminParameters
  ) {}
}

export class GetAdminById {
  static readonly type = '[admin] Get Admin By Id';

  constructor(
    public payload: string,
    public adminType: AdminRoles
  ) {}
}

export class CreateAdmin {
  static readonly type = '[admin] Create Admin';

  constructor(
    public payload: BaseAdmin,
    public adminType: AdminRoles
  ) {}
}

export class UpdateAdmin {
  static readonly type = '[admin] Update Admin';

  constructor(
    public payload: BaseAdmin,
    public adminType: AdminRoles
  ) {}
}

export class DeleteAdminById {
  static readonly type = '[admin] Delete Admin';

  constructor(
    public payload: string,
    public adminType: AdminRoles
  ) {}
}

export class BlockAdminById {
  static readonly type = '[admin] Block Admin';

  constructor(
    public payload: BaseAdminBlockData,
    public adminType: AdminRoles
  ) {}
}

export class ReinviteAdminById {
  static readonly type = '[admin] Reinvite Admin';

  constructor(
    public adminId: string,
    public adminType: AdminRoles
  ) {}
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

export class ReinviteMinistryAdminById {
  static readonly type = '[admin] Reinvite Ministry Admin';

  constructor(public adminId: string) {}
}

export class ReinviteMinistryAdminSuccess {
  static readonly type = '[admin] Reinvite Ministry Admin Success';

  constructor() {}
}

export class ReinviteMinistryAdminFail {
  static readonly type = '[admin] Reinvite Ministry Admin Fail';

  constructor(public error: HttpErrorResponse) {}
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

export class ReinviteRegionAdminById {
  static readonly type = '[admin] Reinvite Region Admin';

  constructor(public adminId: string) {}
}

export class ReinviteRegionAdminSuccess {
  static readonly type = '[admin] Block Region Admin Success';

  constructor() {}
}

export class ReinviteRegionAdminFail {
  static readonly type = '[admin] Reinvite Region Admin Fail';

  constructor(public error: HttpErrorResponse) {}
}

export class GetAllAreaAdmins {
  static readonly type = '[admin] Get All Area Admins';

  constructor(public parameters?: AreaAdminParameters) {}
}

export class GetAreaAdminById {
  static readonly type = '[admin] Get Area Admin By Id';

  constructor(public payload: string) {}
}

export class GetAreaAdminProfile {
  static readonly type = '[admin] Get Area Admin Profile';

  constructor() {}
}

export class CreateAreaAdmin {
  static readonly type = '[admin] Create Area Admin';

  constructor(public payload: AreaAdmin) {}
}

export class OnCreateAreaAdminFail {
  static readonly type = '[admin] Create Area Admin Fail';

  constructor(public payload: HttpErrorResponse) {}
}

export class OnCreateAreaAdminSuccess {
  static readonly type = '[admin] Create Area Admin Success';

  constructor() {}
}

export class UpdateAreaAdmin {
  static readonly type = '[admin] Update Area Admin';

  constructor(public payload: AreaAdmin) {}
}

export class OnUpdateAreaAdminFail {
  static readonly type = '[admin] Update Area Admin Fail';

  constructor(public payload: HttpErrorResponse) {}
}

export class OnUpdateAreaAdminSuccess {
  static readonly type = '[admin] Update Area Admin Success';

  constructor(public payload: AreaAdmin) {}
}

export class DeleteAreaAdminById {
  static readonly type = '[admin] Delete Area Admin';

  constructor(public payload: string) {}
}

export class OnDeleteAreaAdminSuccess {
  static readonly type = '[admin] Delete Area Admin Success';

  constructor() {}
}

export class OnDeleteAreaAdminFail {
  static readonly type = '[admin] Delete Area Admin Fail';

  constructor(public payload: HttpErrorResponse) {}
}

export class BlockAreaAdminById {
  static readonly type = '[admin] Block Area Admin';

  constructor(public payload: AreaAdminBlockData) {}
}

export class OnBlockSuccess {
  static readonly type = '[admin] Block Success';

  constructor(public payload: MinistryAdminBlockData | ProviderBlock) {}
}

export class OnBlockFail {
  static readonly type = '[admin] Block Fail';

  constructor(public payload: HttpErrorResponse) {}
}

export class ReinviteAreaAdminById {
  static readonly type = '[admin] Reinvite Area Admin';

  constructor(public adminId: string) {}
}

export class ReinviteAreaAdminSuccess {
  static readonly type = '[admin] Reinvite Area Admin Success';

  constructor() {}
}

export class ReinviteAreaAdminFail {
  static readonly type = '[admin] Reinvite Area Admin Fail';

  constructor(public error: HttpErrorResponse) {}
}
