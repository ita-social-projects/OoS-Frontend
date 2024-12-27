import { Location } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { EMPTY_RESULT } from 'shared/constants/constants';
import { AdminRoles, AdminTabTypes } from 'shared/enum/admins';
import { SnackbarText } from 'shared/enum/enumUA/message-bar';
import { BaseAdmin, BaseAdminBlockData } from 'shared/models/admin.model';
import { AreaAdmin } from 'shared/models/area-admin.model';
import { Direction } from 'shared/models/category.model';
import { Child } from 'shared/models/child.model';
import { CompanyInformation } from 'shared/models/company-information.model';
import { ApplicationHistory, ParentsBlockingByAdminHistory, EmployeeHistory, ProviderHistory } from 'shared/models/history-log.model';
import { MinistryAdmin } from 'shared/models/ministry-admin.model';
import { Parent } from 'shared/models/parent.model';
import { Provider } from 'shared/models/provider.model';
import { RegionAdmin } from 'shared/models/region-admin.model';
import { SearchResponse } from 'shared/models/search.model';
import { StatisticReport } from 'shared/models/statistic.model';
import { AdminService } from 'shared/services/admin/admin.service';
import { AreaAdminService } from 'shared/services/area-admin/area-admin.service';
import { ChildrenService } from 'shared/services/children/children.service';
import { DirectionsService } from 'shared/services/directions/directions.service';
import { HistoryLogService } from 'shared/services/history-log/history-log.service';
import { MinistryAdminService } from 'shared/services/ministry-admin/ministry-admin.service';
import { PlatformService } from 'shared/services/platform/platform.service';
import { RegionAdminService } from 'shared/services/region-admin/region-admin.service';
import { StatisticReportsService } from 'shared/services/statistics-reports/statistic-reports.service';
import {
  BlockAdminById,
  BlockAreaAdminById,
  BlockMinistryAdminById,
  BlockProviderById,
  BlockRegionAdminById,
  CreateAdmin,
  CreateAreaAdmin,
  CreateDirection,
  CreateMinistryAdmin,
  CreateRegionAdmin,
  DeleteAdminById,
  DeleteAreaAdminById,
  DeleteDirectionById,
  DeleteMinistryAdminById,
  DeleteRegionAdminById,
  DownloadStatisticReport,
  GetAboutPortal,
  GetAdminById,
  GetAllAdmins,
  GetAllAreaAdmins,
  GetAllMinistryAdmins,
  GetAllRegionAdmins,
  GetApplicationHistory,
  GetAreaAdminById,
  GetAreaAdminProfile,
  GetChildrenForAdmin,
  GetDirectionById,
  GetFilteredDirections,
  GetFilteredProviders,
  GetLawsAndRegulations,
  GetMainPageInformation,
  GetMinistryAdminById,
  GetMinistryAdminProfile,
  GetParentsBlockingByAdminHistory,
  GetPlatformInfo,
  GetEmployeeHistory,
  GetProviderHistory,
  GetRegionAdminById,
  GetRegionAdminProfile,
  GetStatisticReports,
  GetSupportInformation,
  OnBlockFail,
  OnBlockSuccess,
  OnCreateAreaAdminFail,
  OnCreateAreaAdminSuccess,
  OnCreateDirectionFail,
  OnCreateDirectionSuccess,
  OnCreateMinistryAdminFail,
  OnCreateMinistryAdminSuccess,
  OnCreateRegionAdminFail,
  OnCreateRegionAdminSuccess,
  OnDeleteAreaAdminFail,
  OnDeleteAreaAdminSuccess,
  OnDeleteDirectionFail,
  OnDeleteDirectionSuccess,
  OnDeleteMinistryAdminFail,
  OnDeleteMinistryAdminSuccess,
  OnDeleteRegionAdminFail,
  OnDeleteRegionAdminSuccess,
  OnUpdateAreaAdminFail,
  OnUpdateAreaAdminSuccess,
  OnUpdateDirectionFail,
  OnUpdateDirectionSuccess,
  OnUpdateMinistryAdminFail,
  OnUpdateMinistryAdminSuccess,
  OnUpdatePlatformInfoFail,
  OnUpdatePlatformInfoSuccess,
  OnUpdateRegionAdminFail,
  OnUpdateRegionAdminSuccess,
  ReinviteAdminById,
  ReinviteAreaAdminById,
  ReinviteAreaAdminFail,
  ReinviteAreaAdminSuccess,
  ReinviteMinistryAdminById,
  ReinviteMinistryAdminFail,
  ReinviteMinistryAdminSuccess,
  ReinviteRegionAdminById,
  ReinviteRegionAdminFail,
  ReinviteRegionAdminSuccess,
  UpdateAdmin,
  UpdateAreaAdmin,
  UpdateDirection,
  UpdateMinistryAdmin,
  UpdatePlatformInfo,
  UpdateRegionAdmin
} from './admin.actions';
import { MarkFormDirty, ShowMessageBar } from './app.actions';
import { GetMainPageInfo } from './main-page.actions';

export interface AdminStateModel {
  aboutPortal: CompanyInformation;
  mainPageInformation: CompanyInformation;
  supportInformation: CompanyInformation;
  lawsAndRegulations: CompanyInformation;
  statisticsReports: SearchResponse<StatisticReport[]>;
  downloadedReport: HttpResponse<Blob>;
  filteredDirections: SearchResponse<Direction[]>;
  selectedDirection: Direction;
  direction: Direction;
  parents: Parent[];
  children: SearchResponse<Child[]>;
  providers: SearchResponse<Provider[]>;
  providerHistory: SearchResponse<ProviderHistory[]>;
  employeeHistory: SearchResponse<EmployeeHistory[]>;
  applicationHistory: SearchResponse<ApplicationHistory[]>;
  parentsBlockingByAdminHistory: SearchResponse<ParentsBlockingByAdminHistory[]>;
  admins: SearchResponse<BaseAdmin[]>;
  selectedAdmin: BaseAdmin;
  isLoading: boolean;
}

@State<AdminStateModel>({
  name: 'admin',
  defaults: {
    aboutPortal: null,
    mainPageInformation: null,
    supportInformation: null,
    lawsAndRegulations: null,
    statisticsReports: null,
    downloadedReport: null,
    filteredDirections: null,
    selectedDirection: null,
    direction: null,
    parents: null,
    children: null,
    providers: null,
    providerHistory: null,
    employeeHistory: null,
    applicationHistory: null,
    parentsBlockingByAdminHistory: null,
    admins: null,
    selectedAdmin: null,
    isLoading: false
  }
})
@Injectable()
export class AdminState {
  constructor(
    private platformService: PlatformService,
    private directionsService: DirectionsService,
    private historyLogService: HistoryLogService,
    private statisticService: StatisticReportsService,
    private childrenService: ChildrenService,
    private adminService: AdminService,
    private ministryAdminService: MinistryAdminService,
    private regionAdminService: RegionAdminService,
    private areaAdminService: AreaAdminService,
    private router: Router,
    private location: Location,
    private store: Store
  ) {}

  @Selector()
  static aboutPortal(state: AdminStateModel): CompanyInformation {
    return state.aboutPortal;
  }

  @Selector()
  static mainInformation(state: AdminStateModel): CompanyInformation {
    return state.mainPageInformation;
  }

  @Selector()
  static supportInformation(state: AdminStateModel): CompanyInformation {
    return state.supportInformation;
  }

  @Selector()
  static lawsAndRegulations(state: AdminStateModel): CompanyInformation {
    return state.lawsAndRegulations;
  }

  @Selector()
  static statisticsReports(state: AdminStateModel): SearchResponse<StatisticReport[]> {
    return state.statisticsReports;
  }

  @Selector()
  static downloadedReport(state: AdminStateModel): HttpResponse<Blob> {
    return state.downloadedReport;
  }

  @Selector()
  static filteredDirections(state: AdminStateModel): SearchResponse<Direction[]> {
    return state.filteredDirections;
  }

  @Selector()
  static direction(state: AdminStateModel): Direction {
    return state.direction;
  }

  @Selector()
  static parents(state: AdminStateModel): Parent[] {
    return state.parents;
  }

  @Selector()
  static children(state: AdminStateModel): SearchResponse<Child[]> {
    return state.children;
  }

  @Selector()
  static providers(state: AdminStateModel): SearchResponse<Provider[]> {
    return state.providers;
  }

  @Selector()
  static providerHistory(state: AdminStateModel): SearchResponse<ProviderHistory[]> | [] {
    return state.providerHistory;
  }

  @Selector()
  static employeeHistory(state: AdminStateModel): SearchResponse<EmployeeHistory[]> | [] {
    return state.employeeHistory;
  }

  @Selector()
  static applicationHistory(state: AdminStateModel): SearchResponse<ApplicationHistory[]> | [] {
    return state.applicationHistory;
  }

  @Selector()
  static parentsBlockingByAdminHistory(state: AdminStateModel): SearchResponse<ParentsBlockingByAdminHistory[]> | [] {
    return state.parentsBlockingByAdminHistory;
  }

  @Selector()
  static admins(state: AdminStateModel): SearchResponse<BaseAdmin[]> {
    return state.admins;
  }

  @Selector()
  static selectedAdmin(state: AdminStateModel): BaseAdmin {
    return state.selectedAdmin;
  }

  @Selector()
  static isLoading(state: AdminStateModel): boolean {
    return state.isLoading;
  }

  @Action(GetAboutPortal)
  getAboutPortal({ patchState }: StateContext<AdminStateModel>): Observable<CompanyInformation> {
    patchState({ isLoading: true });
    return this.platformService
      .getPlatformInfo(AdminTabTypes.AboutPortal)
      .pipe(tap((aboutPortal: CompanyInformation) => patchState({ aboutPortal, isLoading: false })));
  }

  @Action(GetMainPageInformation)
  getMainPageInformation({ patchState }: StateContext<AdminStateModel>): Observable<CompanyInformation> {
    patchState({ isLoading: true });
    return this.platformService
      .getPlatformInfo(AdminTabTypes.MainPage)
      .pipe(tap((mainPageInformation: CompanyInformation) => patchState({ mainPageInformation, isLoading: false })));
  }

  @Action(GetSupportInformation)
  getSupportInformation({ patchState }: StateContext<AdminStateModel>): Observable<CompanyInformation> {
    patchState({ isLoading: true });
    return this.platformService
      .getPlatformInfo(AdminTabTypes.SupportInformation)
      .pipe(tap((supportInformation: CompanyInformation) => patchState({ supportInformation, isLoading: false })));
  }

  @Action(GetLawsAndRegulations)
  getLawsAndRegulations({ patchState }: StateContext<AdminStateModel>): Observable<CompanyInformation> {
    patchState({ isLoading: true });
    return this.platformService
      .getPlatformInfo(AdminTabTypes.LawsAndRegulations)
      .pipe(tap((lawsAndRegulations: CompanyInformation) => patchState({ lawsAndRegulations, isLoading: false })));
  }

  @Action(GetStatisticReports)
  getStatisticReports(
    { patchState }: StateContext<AdminStateModel>,
    { parameters }: GetStatisticReports
  ): Observable<SearchResponse<StatisticReport[]>> {
    patchState({ isLoading: true });
    return this.statisticService
      .getReportsByFilter(parameters)
      .pipe(
        tap((statisticsReports: SearchResponse<StatisticReport[]>) =>
          patchState({ statisticsReports: statisticsReports ?? EMPTY_RESULT, isLoading: false })
        )
      );
  }

  @Action(DownloadStatisticReport)
  downloadStatisticReport(
    { patchState }: StateContext<AdminStateModel>,
    { externalStorageId: id }: DownloadStatisticReport
  ): Observable<HttpResponse<Blob>> {
    patchState({ isLoading: true });
    return this.statisticService.getReportById(id).pipe(
      tap((uploadedReport: HttpResponse<Blob>) =>
        patchState({
          downloadedReport: uploadedReport,
          isLoading: false
        })
      )
    );
  }

  @Action(GetPlatformInfo)
  getPlatformInfo({ dispatch }: StateContext<AdminStateModel>): void {
    dispatch([new GetAboutPortal(), new GetMainPageInformation(), new GetSupportInformation(), new GetLawsAndRegulations()]);
  }

  @Action(UpdatePlatformInfo)
  updatePlatformInfo(
    { dispatch }: StateContext<AdminStateModel>,
    { payload, type }: UpdatePlatformInfo
  ): Observable<CompanyInformation | void> {
    return this.platformService.updatePlatformInfo(payload, type).pipe(
      tap((res: CompanyInformation) => dispatch(new OnUpdatePlatformInfoSuccess(res, type))),
      catchError((error: Error) => dispatch(new OnUpdatePlatformInfoFail(error)))
    );
  }

  @Action(OnUpdatePlatformInfoSuccess)
  onUpdatePlatformInfoSuccess({ dispatch }: StateContext<AdminStateModel>, { type }: OnUpdatePlatformInfoSuccess): void {
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({
        message: SnackbarText.updatePortal,
        type: 'success'
      })
    ]);
    if (type === AdminTabTypes.MainPage) {
      this.store.dispatch(new GetMainPageInfo());
      this.router.navigate(['/']);
      return;
    }
    this.router.navigate(['/admin-tools/platform'], {
      queryParams: { page: type }
    });
  }

  @Action(OnUpdatePlatformInfoFail)
  onUpdatePlatformInfoFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdatePlatformInfoFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(GetFilteredDirections)
  getFilteredDirections(
    { patchState }: StateContext<AdminStateModel>,
    { parameters }: GetFilteredDirections
  ): Observable<SearchResponse<Direction[]>> {
    patchState({ isLoading: true });
    return this.directionsService.getFilteredDirections(parameters).pipe(
      tap((filteredDirections: SearchResponse<Direction[]>) =>
        patchState({
          filteredDirections: filteredDirections ?? EMPTY_RESULT,
          isLoading: false,
          direction: null
        })
      )
    );
  }

  @Action(GetDirectionById)
  getDirectionById({ patchState }: StateContext<AdminStateModel>, { payload }: GetDirectionById): Observable<Direction> {
    patchState({ isLoading: true });
    return this.directionsService
      .getDirectionById(payload)
      .pipe(tap((direction: Direction) => patchState({ direction, isLoading: false })));
  }

  @Action(CreateDirection)
  createDirection({ dispatch }: StateContext<AdminStateModel>, { payload }: CreateDirection): Observable<Direction | void> {
    return this.directionsService.createDirection(payload).pipe(
      tap((res: Direction) => dispatch(new OnCreateDirectionSuccess(res))),
      catchError((error: Error) => dispatch(new OnCreateDirectionFail(error)))
    );
  }

  @Action(OnCreateDirectionSuccess)
  onCreateDirectionSuccess({ dispatch, patchState }: StateContext<AdminStateModel>, { payload }: OnCreateDirectionSuccess): void {
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({
        message: SnackbarText.createDirection,
        type: 'success'
      })
    ]);
    patchState({ direction: payload });
    this.location.back();
  }

  @Action(OnCreateDirectionFail)
  onCreateDirectionFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnCreateDirectionFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(UpdateDirection)
  updateDirection({ dispatch }: StateContext<AdminStateModel>, { payload }: UpdateDirection): Observable<Direction | void> {
    return this.adminService.updateDirection(payload).pipe(
      tap((res: Direction) => dispatch(new OnUpdateDirectionSuccess(res))),
      catchError((error: Error) => dispatch(new OnUpdateDirectionFail(error)))
    );
  }

  @Action(OnUpdateDirectionSuccess)
  onUpdateDirectionSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateDirectionSuccess): void {
    dispatch([
      new MarkFormDirty(false),
      new GetDirectionById(payload.id),
      new ShowMessageBar({
        message: SnackbarText.updateDirection,
        type: 'success'
      })
    ]);
    this.location.back();
  }

  @Action(OnUpdateDirectionFail)
  onUpdateDirectionFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateDirectionFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(DeleteDirectionById)
  deleteDirectionById(
    { dispatch }: StateContext<AdminStateModel>,
    { payload, directionParameters }: DeleteDirectionById
  ): Observable<void> {
    return this.adminService.deleteDirection(payload).pipe(
      tap(() => dispatch(new OnDeleteDirectionSuccess(directionParameters))),
      catchError((error: Error) => dispatch(new OnDeleteDirectionFail(error)))
    );
  }

  @Action(OnDeleteDirectionSuccess)
  onDeleteDirectionSuccess({ dispatch }: StateContext<AdminStateModel>, { directionParameters }: OnDeleteDirectionSuccess): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.deleteDirection,
        type: 'success'
      }),
      new GetFilteredDirections(directionParameters)
    ]);
  }

  @Action(OnDeleteDirectionFail)
  onDeleteDirectionFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnDeleteDirectionFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(GetChildrenForAdmin)
  getChildrenForAdmin(
    { patchState }: StateContext<AdminStateModel>,
    { parameters }: GetChildrenForAdmin
  ): Observable<SearchResponse<Child[]>> {
    patchState({ isLoading: true });
    return this.childrenService.getChildrenForAdmin(parameters).pipe(
      tap((children: SearchResponse<Child[]>) =>
        patchState({
          children: children ?? EMPTY_RESULT,
          isLoading: false
        })
      )
    );
  }

  @Action(GetFilteredProviders)
  getFilteredProvider(
    { patchState }: StateContext<AdminStateModel>,
    { providerParameters }: GetFilteredProviders
  ): Observable<SearchResponse<Provider[]>> {
    patchState({ isLoading: true });
    return this.adminService.getAllProviders(providerParameters).pipe(
      tap((providers: SearchResponse<Provider[]>) =>
        patchState({
          providers: providers ?? EMPTY_RESULT,
          isLoading: false
        })
      )
    );
  }

  @Action(GetProviderHistory)
  getProviderHistory(
    { patchState }: StateContext<AdminStateModel>,
    { payload, searchSting }: GetProviderHistory
  ): Observable<SearchResponse<ProviderHistory[]>> {
    patchState({ isLoading: true });
    return this.historyLogService.getProviderHistory(payload, searchSting).pipe(
      tap((providerHistory: SearchResponse<ProviderHistory[]>) =>
        patchState({
          providerHistory: providerHistory ?? EMPTY_RESULT,
          isLoading: false
        })
      )
    );
  }

  @Action(GetEmployeeHistory)
  getEmployeeHistory(
    { patchState }: StateContext<AdminStateModel>,
    { payload, searchSting }: GetEmployeeHistory
  ): Observable<SearchResponse<EmployeeHistory[]>> {
    patchState({ isLoading: true });
    return this.historyLogService.getEmployeeHistory(payload, searchSting).pipe(
      tap((employeeHistory: SearchResponse<EmployeeHistory[]>) =>
        patchState({
          employeeHistory: employeeHistory ?? EMPTY_RESULT,
          isLoading: false
        })
      )
    );
  }

  @Action(GetApplicationHistory)
  getApplicationHistory(
    { patchState }: StateContext<AdminStateModel>,
    { payload, searchSting }: GetApplicationHistory
  ): Observable<SearchResponse<ApplicationHistory[]>> {
    patchState({ isLoading: true });
    return this.historyLogService.getApplicationHistory(payload, searchSting).pipe(
      tap((applicationHistory: SearchResponse<ApplicationHistory[]>) =>
        patchState({
          applicationHistory: applicationHistory ?? EMPTY_RESULT,
          isLoading: false
        })
      )
    );
  }

  @Action(GetParentsBlockingByAdminHistory)
  getParentsBlockingByAdminHistory(
    { patchState }: StateContext<AdminStateModel>,
    { payload, searchSting }: GetParentsBlockingByAdminHistory
  ): Observable<SearchResponse<ParentsBlockingByAdminHistory[]>> {
    patchState({ isLoading: true });
    return this.historyLogService.getParentsBlockingByAdminHistory(payload, searchSting).pipe(
      tap((parentsBlockingByAdminHistory: SearchResponse<ParentsBlockingByAdminHistory[]>) =>
        patchState({
          parentsBlockingByAdminHistory: parentsBlockingByAdminHistory ?? EMPTY_RESULT,
          isLoading: false
        })
      )
    );
  }

  @Action(BlockProviderById)
  blockProviderById({ dispatch }: StateContext<AdminStateModel>, { payload, parameters }: BlockProviderById): Observable<void> {
    return this.adminService.blockProvider(payload).pipe(
      tap(() => dispatch([new OnBlockSuccess(payload), new GetFilteredProviders(parameters)])),
      catchError((error: HttpErrorResponse) => dispatch(new OnBlockFail(error)))
    );
  }

  @Action(GetAllAdmins)
  getAllAdmins({ dispatch }: StateContext<AdminStateModel>, { adminType, parameters }: GetAllAdmins): void {
    switch (adminType) {
      case AdminRoles.ministryAdmin: {
        dispatch(new GetAllMinistryAdmins(parameters));
        break;
      }
      case AdminRoles.regionAdmin: {
        dispatch(new GetAllRegionAdmins(parameters));
        break;
      }
      case AdminRoles.areaAdmin: {
        dispatch(new GetAllAreaAdmins(parameters));
        break;
      }
    }
  }

  @Action(GetAdminById)
  getAdminById({ dispatch }: StateContext<AdminState>, { payload, adminType }: GetAdminById): void {
    switch (adminType) {
      case AdminRoles.ministryAdmin: {
        dispatch(new GetMinistryAdminById(payload));
        break;
      }
      case AdminRoles.regionAdmin: {
        dispatch(new GetRegionAdminById(payload));
        break;
      }
      case AdminRoles.areaAdmin: {
        dispatch(new GetAreaAdminById(payload));
        break;
      }
    }
  }

  @Action(CreateAdmin)
  createAdmin({ dispatch }: StateContext<AdminState>, { payload, adminType }: CreateAdmin): void {
    switch (adminType) {
      case AdminRoles.ministryAdmin: {
        dispatch(new CreateMinistryAdmin(payload));
        break;
      }
      case AdminRoles.regionAdmin: {
        dispatch(new CreateRegionAdmin(payload as RegionAdmin));
        break;
      }
      case AdminRoles.areaAdmin: {
        dispatch(new CreateAreaAdmin(payload as AreaAdmin));
        break;
      }
    }
  }

  @Action(UpdateAdmin)
  updateAdmin({ dispatch }: StateContext<AdminStateModel>, { payload, adminType }: UpdateAdmin): void {
    switch (adminType) {
      case AdminRoles.ministryAdmin: {
        dispatch(new UpdateMinistryAdmin(payload));
        break;
      }
      case AdminRoles.regionAdmin: {
        dispatch(new UpdateRegionAdmin(payload as RegionAdmin));
        break;
      }
      case AdminRoles.areaAdmin: {
        dispatch(new UpdateAreaAdmin(payload as AreaAdmin));
        break;
      }
    }
  }

  @Action(DeleteAdminById)
  deleteAdminById({ dispatch }: StateContext<AdminStateModel>, { payload, adminType }: DeleteAdminById): void {
    switch (adminType) {
      case AdminRoles.ministryAdmin: {
        dispatch(new DeleteMinistryAdminById(payload));
        break;
      }
      case AdminRoles.regionAdmin: {
        dispatch(new DeleteRegionAdminById(payload));
        break;
      }
      case AdminRoles.areaAdmin: {
        dispatch(new DeleteAreaAdminById(payload));
        break;
      }
    }
  }

  @Action(BlockAdminById)
  blockAdmin({ dispatch }: StateContext<AdminStateModel>, { payload, adminType }: BlockAdminById): void {
    switch (adminType) {
      case AdminRoles.ministryAdmin: {
        dispatch(new BlockMinistryAdminById(payload));
        break;
      }
      case AdminRoles.regionAdmin: {
        dispatch(new BlockRegionAdminById(payload));
        break;
      }
      case AdminRoles.areaAdmin: {
        dispatch(new BlockAreaAdminById(payload));
        break;
      }
    }
  }

  @Action(ReinviteAdminById)
  reinviteAdmin({ dispatch }: StateContext<AdminStateModel>, { adminId, adminType }: ReinviteAdminById): void {
    switch (adminType) {
      case AdminRoles.ministryAdmin: {
        dispatch(new ReinviteMinistryAdminById(adminId));
        break;
      }
      case AdminRoles.regionAdmin: {
        dispatch(new ReinviteRegionAdminById(adminId));
        break;
      }
      case AdminRoles.areaAdmin: {
        dispatch(new ReinviteAreaAdminById(adminId));
        break;
      }
    }
  }

  @Action(GetAllMinistryAdmins)
  getAllMinistryAdmins(
    { patchState }: StateContext<AdminStateModel>,
    { parameters }: GetAllMinistryAdmins
  ): Observable<SearchResponse<MinistryAdmin[]>> {
    patchState({ isLoading: true });
    return this.adminService.getAllMinistryAdmins(parameters).pipe(
      tap((admins: SearchResponse<MinistryAdmin[]>) =>
        patchState({
          admins: admins ?? EMPTY_RESULT,
          isLoading: false
        })
      )
    );
  }

  @Action(GetMinistryAdminById)
  getMinistryAdminById({ patchState }: StateContext<AdminStateModel>, { payload }: GetMinistryAdminById): Observable<MinistryAdmin> {
    patchState({ isLoading: true });
    return this.ministryAdminService
      .getAdminById(payload)
      .pipe(tap((selectedAdmin: MinistryAdmin) => patchState({ selectedAdmin, isLoading: false })));
  }

  @Action(GetMinistryAdminProfile)
  getMinistryAdminProfile({ patchState }: StateContext<AdminStateModel>): Observable<MinistryAdmin> {
    patchState({ isLoading: true });
    return this.ministryAdminService.getAdminProfile().pipe(
      tap((selectedAdmin: MinistryAdmin) =>
        patchState({
          selectedAdmin: selectedAdmin,
          isLoading: false
        })
      )
    );
  }

  @Action(CreateMinistryAdmin)
  createMinistryAdmin({ dispatch }: StateContext<AdminState>, { payload }: CreateMinistryAdmin): Observable<MinistryAdmin | void> {
    return this.ministryAdminService.createAdmin(payload).pipe(
      tap(() => dispatch(new OnCreateMinistryAdminSuccess())),
      catchError((error: HttpErrorResponse) => dispatch(new OnCreateMinistryAdminFail(error)))
    );
  }

  @Action(OnCreateMinistryAdminSuccess)
  onCreateMinistryAdminSuccess({ dispatch }: StateContext<AdminState>): void {
    this.onCreateAdminSuccess(dispatch);
  }

  @Action(OnCreateMinistryAdminFail)
  onCreateMinistryAdminFail({ dispatch }: StateContext<AdminState>, { payload }: OnCreateMinistryAdminFail): void {
    throwError(() => payload);
  }

  @Action(UpdateMinistryAdmin)
  updateMinistryAdmin({ dispatch }: StateContext<AdminStateModel>, { payload }: UpdateMinistryAdmin): Observable<MinistryAdmin | void> {
    return this.ministryAdminService.updateAdmin(payload).pipe(
      tap((res: MinistryAdmin) => dispatch(new OnUpdateMinistryAdminSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new OnUpdateMinistryAdminFail(error)))
    );
  }

  @Action(OnUpdateMinistryAdminSuccess)
  onUpdateMinistryAdminSuccess({ dispatch }: StateContext<AdminStateModel>): void {
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({
        message: SnackbarText.updateAdmin,
        type: 'success'
      })
    ]);
    this.router.navigate(['/admin-tools/data/admins']);
  }

  @Action(OnUpdateMinistryAdminFail)
  onUpdateMinistryAdminFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateMinistryAdminFail): void {
    this.onUpdateAdminFail(dispatch);
  }

  @Action(DeleteMinistryAdminById)
  deleteMinistryAdminById({ dispatch }: StateContext<AdminStateModel>, { payload }: DeleteMinistryAdminById): Observable<void> {
    return this.ministryAdminService.deleteAdmin(payload).pipe(
      tap(() => dispatch(new OnDeleteMinistryAdminSuccess())),
      catchError((error: HttpErrorResponse) => dispatch(new OnDeleteMinistryAdminFail(error)))
    );
  }

  @Action(OnDeleteMinistryAdminSuccess)
  onDeleteMinistryAdminSuccess({ dispatch }: StateContext<AdminStateModel>): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.deleteAdmin,
        type: 'success'
      }),
      new GetAllMinistryAdmins()
    ]);
  }

  @Action(OnDeleteMinistryAdminFail)
  onDeleteMinistryAdminFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnDeleteMinistryAdminFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(BlockMinistryAdminById)
  blockMinistryAdmin({ dispatch }: StateContext<AdminStateModel>, { payload }: BlockMinistryAdminById): Observable<void> {
    return this.ministryAdminService.blockAdmin(payload.adminId, payload.isBlocked).pipe(
      tap(() => dispatch([new OnBlockSuccess(payload), new GetAllMinistryAdmins()])),
      catchError((error: HttpErrorResponse) => dispatch(new OnBlockFail(error)))
    );
  }

  @Action(OnBlockSuccess)
  onBlockMinistryAdminSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: BlockMinistryAdminById): void {
    this.onBlockAdminSuccess(dispatch, payload);
  }

  @Action(OnBlockFail)
  onBlockMinistryAdminFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnBlockFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(ReinviteMinistryAdminById)
  reinviteMinistryAdminById({ dispatch }: StateContext<AdminStateModel>, { adminId }: ReinviteMinistryAdminById): Observable<void> {
    return this.ministryAdminService.reinviteAdmin(adminId).pipe(
      tap(() => dispatch(new ReinviteMinistryAdminSuccess())),
      catchError((error: HttpErrorResponse) => dispatch(new ReinviteMinistryAdminFail(error)))
    );
  }

  @Action(ReinviteMinistryAdminSuccess)
  reinviteMinistryAdminSuccess({ dispatch }: StateContext<AdminStateModel>): Observable<void> {
    return dispatch(new ShowMessageBar({ message: SnackbarText.sendInvitation, type: 'success' }));
  }

  @Action(ReinviteMinistryAdminFail)
  reinviteMinistryAdminFail({ dispatch }: StateContext<AdminStateModel>): Observable<void> {
    return dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(GetAllRegionAdmins)
  getAllRegionAdmins(
    { patchState }: StateContext<AdminStateModel>,
    { parameters }: GetAllRegionAdmins
  ): Observable<SearchResponse<RegionAdmin[]>> {
    patchState({ isLoading: true });
    return this.regionAdminService.getAllAdmin(parameters).pipe(
      tap((admins: SearchResponse<RegionAdmin[]>) =>
        patchState({
          admins: admins ?? EMPTY_RESULT,
          isLoading: false
        })
      )
    );
  }

  @Action(GetRegionAdminById)
  getRegionAdminById({ patchState }: StateContext<AdminStateModel>, { payload }: GetRegionAdminById): Observable<RegionAdmin> {
    patchState({ isLoading: true });
    return this.regionAdminService
      .getAdminById(payload)
      .pipe(tap((selectedAdmin: RegionAdmin) => patchState({ selectedAdmin, isLoading: false })));
  }

  @Action(GetRegionAdminProfile)
  getRegionAdminProfile({ patchState }: StateContext<AdminStateModel>): Observable<RegionAdmin> {
    patchState({ isLoading: true });
    return this.regionAdminService.getAdminProfile().pipe(
      tap((selectedRegionAdmin: RegionAdmin) =>
        patchState({
          selectedAdmin: selectedRegionAdmin,
          isLoading: false
        })
      )
    );
  }

  @Action(CreateRegionAdmin)
  createRegionAdmin({ dispatch }: StateContext<AdminState>, { payload }: CreateRegionAdmin): Observable<RegionAdmin | void> {
    return this.regionAdminService.createAdmin(payload).pipe(
      tap(() => dispatch(new OnCreateRegionAdminSuccess())),
      catchError((error: HttpErrorResponse) => dispatch(new OnCreateRegionAdminFail(error)))
    );
  }

  @Action(OnCreateRegionAdminSuccess)
  onCreateRegionAdminSuccess({ dispatch }: StateContext<AdminState>): void {
    this.onCreateAdminSuccess(dispatch);
  }

  @Action(OnCreateRegionAdminFail)
  onCreateRegionAdminFail({ dispatch }: StateContext<AdminState>, { payload }: OnCreateRegionAdminFail): void {
    throwError(() => payload);
  }

  @Action(UpdateRegionAdmin)
  updateRegionAdmin({ dispatch }: StateContext<AdminStateModel>, { payload }: UpdateRegionAdmin): Observable<RegionAdmin | void> {
    return this.regionAdminService.updateAdmin(payload).pipe(
      tap((res: RegionAdmin) => dispatch(new OnUpdateRegionAdminSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new OnUpdateRegionAdminFail(error)))
    );
  }

  @Action(OnUpdateRegionAdminFail)
  onUpdateRegionAdminFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateRegionAdminFail): void {
    this.onUpdateAdminFail(dispatch);
  }

  @Action(OnUpdateRegionAdminSuccess)
  onUpdateRegionAdminSuccess({ dispatch }: StateContext<AdminStateModel>): void {
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({
        message: SnackbarText.updateAdmin,
        type: 'success'
      })
    ]);
    this.router.navigate(['/admin-tools/data/admins'], { queryParams: { role: AdminRoles.regionAdmin } });
  }

  @Action(DeleteRegionAdminById)
  deleteRegionAdminById({ dispatch }: StateContext<AdminStateModel>, { payload }: DeleteMinistryAdminById): Observable<void> {
    return this.regionAdminService.deleteAdmin(payload).pipe(
      tap(() => dispatch(new OnDeleteRegionAdminSuccess())),
      catchError((error: HttpErrorResponse) => dispatch(new OnDeleteRegionAdminFail(error)))
    );
  }

  @Action(OnDeleteRegionAdminSuccess)
  onDeleteRegionAdminSuccess({ dispatch }: StateContext<AdminStateModel>): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.deleteAdmin,
        type: 'success'
      }),
      new GetAllRegionAdmins()
    ]);
  }

  @Action(OnDeleteRegionAdminFail)
  onDeleteRegionAdminFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnDeleteRegionAdminFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(BlockRegionAdminById)
  blockRegionAdmin({ dispatch }: StateContext<AdminStateModel>, { payload }: BlockRegionAdminById): Observable<void> {
    return this.regionAdminService.blockAdmin(payload.adminId, payload.isBlocked).pipe(
      tap(() => dispatch([new OnBlockSuccess(payload), new GetAllRegionAdmins()])),
      catchError((error: HttpErrorResponse) => dispatch(new OnBlockFail(error)))
    );
  }

  @Action(OnBlockSuccess)
  onBlockRegionAdminSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: BlockRegionAdminById): void {
    this.onBlockAdminSuccess(dispatch, payload);
  }

  @Action(OnBlockFail)
  onBlockRegionAdminFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnBlockFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(ReinviteRegionAdminById)
  reinviteRegionAdminById({ dispatch }: StateContext<AdminState>, { adminId }: ReinviteRegionAdminById): Observable<void> {
    return this.regionAdminService.reinviteAdmin(adminId).pipe(
      tap(() => dispatch(new ReinviteRegionAdminSuccess())),
      catchError((error: HttpErrorResponse) => dispatch(new ReinviteRegionAdminFail(error)))
    );
  }

  @Action(ReinviteRegionAdminSuccess)
  reinviteRegionAdminSuccess({ dispatch }: StateContext<AdminState>): Observable<void> {
    return dispatch(new ShowMessageBar({ message: SnackbarText.sendInvitation, type: 'success' }));
  }

  @Action(ReinviteRegionAdminFail)
  reinviteRegionAdminFail({ dispatch }: StateContext<AdminState>): Observable<void> {
    return dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(GetAllAreaAdmins)
  getAllAreaAdmins(
    { patchState }: StateContext<AdminStateModel>,
    { parameters }: GetAllAreaAdmins
  ): Observable<SearchResponse<AreaAdmin[]>> {
    patchState({ isLoading: true });
    return this.areaAdminService.getAllAdmin(parameters).pipe(
      tap((admins: SearchResponse<AreaAdmin[]>) =>
        patchState({
          admins: admins ?? EMPTY_RESULT,
          isLoading: false
        })
      )
    );
  }

  @Action(GetAreaAdminById)
  getAreaAdminById({ patchState }: StateContext<AdminStateModel>, { payload }: GetAreaAdminById): Observable<AreaAdmin> {
    patchState({ isLoading: true });
    return this.areaAdminService
      .getAdminById(payload)
      .pipe(tap((selectedAdmin: AreaAdmin) => patchState({ selectedAdmin, isLoading: false })));
  }

  @Action(GetAreaAdminProfile)
  getAreaAdminProfile({ patchState }: StateContext<AdminStateModel>): Observable<AreaAdmin> {
    patchState({ isLoading: true });
    return this.areaAdminService.getAdminProfile().pipe(
      tap((selectedAreaAdmin: AreaAdmin) =>
        patchState({
          selectedAdmin: selectedAreaAdmin,
          isLoading: false
        })
      )
    );
  }

  @Action(CreateAreaAdmin)
  createAreaAdmin({ dispatch }: StateContext<AdminState>, { payload }: CreateAreaAdmin): Observable<AreaAdmin | void> {
    return this.areaAdminService.createAdmin(payload).pipe(
      tap(() => dispatch(new OnCreateAreaAdminSuccess())),
      catchError((error: HttpErrorResponse) => dispatch(new OnCreateAreaAdminFail(error)))
    );
  }

  @Action(OnCreateAreaAdminSuccess)
  onCreateAreaAdminSuccess({ dispatch }: StateContext<AdminState>): void {
    this.onCreateAdminSuccess(dispatch);
  }

  @Action(OnCreateAreaAdminFail)
  onCreateAreaAdminFail({ dispatch }: StateContext<AdminState>, { payload }: OnCreateAreaAdminFail): void {
    throwError(() => payload);
  }

  @Action(UpdateAreaAdmin)
  updateAreaAdmin({ dispatch }: StateContext<AdminStateModel>, { payload }: UpdateAreaAdmin): Observable<AreaAdmin | void> {
    return this.areaAdminService.updateAdmin(payload).pipe(
      tap((res: AreaAdmin) => dispatch(new OnUpdateAreaAdminSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new OnUpdateAreaAdminFail(error)))
    );
  }

  @Action(OnUpdateAreaAdminSuccess)
  onUpdateAreaAdminSuccess({ dispatch }: StateContext<AdminStateModel>): void {
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({
        message: SnackbarText.updateAdmin,
        type: 'success'
      })
    ]);
    this.router.navigate(['/admin-tools/data/admins'], { queryParams: { role: AdminRoles.areaAdmin } });
  }

  @Action(OnUpdateAreaAdminFail)
  onUpdateAreaAdminFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateAreaAdminFail): void {
    this.onUpdateAdminFail(dispatch);
  }

  @Action(DeleteAreaAdminById)
  deleteAreaAdminById({ dispatch }: StateContext<AdminStateModel>, { payload }: DeleteMinistryAdminById): Observable<void> {
    return this.areaAdminService.deleteAdmin(payload).pipe(
      tap(() => dispatch(new OnDeleteAreaAdminSuccess())),
      catchError((error: HttpErrorResponse) => dispatch(new OnDeleteAreaAdminFail(error)))
    );
  }

  @Action(OnDeleteAreaAdminSuccess)
  onDeleteAreaAdminSuccess({ dispatch }: StateContext<AdminStateModel>): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.deleteAdmin,
        type: 'success'
      }),
      new GetAllAreaAdmins()
    ]);
  }

  @Action(OnDeleteAreaAdminFail)
  onDeleteAreaAdminFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnDeleteAreaAdminFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(BlockAreaAdminById)
  blockAreaAdmin({ dispatch }: StateContext<AdminStateModel>, { payload }: BlockAreaAdminById): Observable<void> {
    return this.areaAdminService.blockAdmin(payload.adminId, payload.isBlocked).pipe(
      tap(() => dispatch([new OnBlockSuccess(payload), new GetAllAreaAdmins()])),
      catchError((error: HttpErrorResponse) => dispatch(new OnBlockFail(error)))
    );
  }

  @Action(OnBlockSuccess)
  onBlockAreaAdminSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: BlockAreaAdminById): void {
    this.onBlockAdminSuccess(dispatch, payload);
  }

  @Action(OnBlockFail)
  onBlockAreaAdminFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnBlockFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(ReinviteAreaAdminById)
  reinviteAreaAdminById({ dispatch }: StateContext<AdminStateModel>, { adminId }: ReinviteAreaAdminById): Observable<void> {
    return this.areaAdminService.reinviteAdmin(adminId).pipe(
      tap(() => dispatch(new ReinviteAreaAdminSuccess())),
      catchError((error: HttpErrorResponse) => dispatch(new ReinviteAreaAdminFail(error)))
    );
  }

  @Action(ReinviteAreaAdminSuccess)
  reinviteAreaAdminSuccess({ dispatch }: StateContext<AdminStateModel>): Observable<void> {
    return dispatch(new ShowMessageBar({ message: SnackbarText.sendInvitation, type: 'success' }));
  }

  @Action(ReinviteAreaAdminFail)
  reinviteAreaAdminFail({ dispatch }: StateContext<AdminStateModel>): Observable<void> {
    return dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  private onCreateAdminSuccess(dispatch: (actions: any) => Observable<void>): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.createAdminSuccess,
        type: 'success'
      }),
      new MarkFormDirty(false)
    ]);
    this.router.navigate(['/admin-tools/data/admins']);
  }

  private onUpdateAdminFail(dispatch: (actions: any) => Observable<void>): void {
    dispatch(
      new ShowMessageBar({
        message: SnackbarText.error,
        type: 'error'
      })
    );
  }

  private onBlockAdminSuccess(dispatch: (actions: any) => Observable<void>, payload: BaseAdminBlockData): void {
    dispatch([
      new ShowMessageBar({
        message: payload.isBlocked ? SnackbarText.blockPerson : SnackbarText.unblockPerson,
        type: 'success'
      })
    ]);
  }
}
