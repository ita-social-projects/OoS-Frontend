import { Location } from '@angular/common';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { AreaAdmin } from 'shared/models/areaAdmin.model';
import { AreaAdminService } from 'shared/services/area-admin/area-admin.service';
import { EMPTY_RESULT } from '../constants/constants';
import { AdminRoles, AdminTabTypes } from '../enum/admins';
import { SnackbarText } from '../enum/enumUA/messageBer';
import { BaseAdmin } from '../models/admin.model';
import { Direction } from '../models/category.model';
import { Child } from '../models/child.model';
import { ApplicationHistory, ParentsBlockingByAdminHistory, ProviderAdminHistory, ProviderHistory } from '../models/history-log.model';
import { MinistryAdmin } from '../models/ministryAdmin.model';
import { Parent } from '../models/parent.model';
import { Provider } from '../models/provider.model';
import { RegionAdmin } from '../models/regionAdmin.model';
import { SearchResponse } from '../models/search.model';
import { StatisticReport } from '../models/statistic.model';
import { CompanyInformation } from '../models/сompanyInformation.model';
import { ChildrenService } from '../services/children/children.service';
import { DirectionsService } from '../services/directions/directions.service';
import { HistoryLogService } from '../services/history-log/history-log.service';
import { MinistryAdminService } from '../services/ministry-admin/ministry-admin.service';
import { PlatformService } from '../services/platform/platform.service';
import { ProviderService } from '../services/provider/provider.service';
import { RegionAdminService } from '../services/region-admin/region-admin.service';
import { StatisticReportsService } from '../services/statistics-reports/statistic-reports.service';
import {
  BlockAdminById,
  BlockMinistryAdminById,
  BlockProviderById,
  BlockRegionAdminById,
  BlockAreaAdminById,
  CreateAdmin,
  CreateDirection,
  CreateMinistryAdmin,
  CreateRegionAdmin,
  CreateAreaAdmin,
  DeleteAdminById,
  DeleteDirectionById,
  DeleteMinistryAdminById,
  DeleteRegionAdminById,
  DeleteAreaAdminById,
  DownloadStatisticReport,
  GetAboutPortal,
  GetAdminById,
  GetAllAdmins,
  GetAllMinistryAdmins,
  GetAllRegionAdmins,
  GetAllAreaAdmins,
  GetApplicationHistory,
  GetChildrenForAdmin,
  GetDirectionById,
  GetFilteredDirections,
  GetFilteredProviders,
  GetLawsAndRegulations,
  GetMainPageInformation,
  GetMinistryAdminById,
  GetMinistryAdminProfile,
  GetPlatformInfo,
  GetProviderAdminHistory,
  GetProviderHistory,
  GetRegionAdminById,
  GetRegionAdminProfile,
  GetStatisticReports,
  GetSupportInformation,
  GetAreaAdminById,
  GetAreaAdminProfile,
  OnBlockFail,
  OnBlockSuccess,
  OnCreateDirectionFail,
  OnCreateDirectionSuccess,
  OnCreateMinistryAdminFail,
  OnCreateMinistryAdminSuccess,
  OnCreateRegionAdminFail,
  OnCreateRegionAdminSuccess,
  OnCreateAreaAdminFail,
  OnCreateAreaAdminSuccess,
  OnDeleteDirectionFail,
  OnDeleteDirectionSuccess,
  OnDeleteMinistryAdminFail,
  OnDeleteMinistryAdminSuccess,
  OnDeleteRegionAdminFail,
  OnDeleteRegionAdminSuccess,
  OnDeleteAreaAdminFail,
  OnDeleteAreaAdminSuccess,
  OnUpdateDirectionFail,
  OnUpdateDirectionSuccess,
  OnUpdateMinistryAdminFail,
  OnUpdateMinistryAdminSuccess,
  OnUpdatePlatformInfoFail,
  OnUpdatePlatformInfoSuccess,
  OnUpdateRegionAdminFail,
  OnUpdateRegionAdminSuccess,
  OnUpdateAreaAdminFail,
  OnUpdateAreaAdminSuccess,
  UpdateAdmin,
  UpdateDirection,
  UpdateMinistryAdmin,
  UpdatePlatformInfo,
  UpdateRegionAdmin,
  UpdateAreaAdmin,
  GetParentsBlockingByAdminHistory,
  ReinviteAdminById,
  ReinviteMinistryAdminById,
  OnReinviteMinistryAdminSuccess,
  OnReinviteMinistryAdminFail,
  ReinviteRegionAdminById,
  OnReinviteRegionAdminSuccess,
  OnReinviteRegionAdminFail
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
  providerAdminHistory: SearchResponse<ProviderAdminHistory[]>;
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
    providerAdminHistory: null,
    applicationHistory: null,
    parentsBlockingByAdminHistory: null,
    admins: null,
    selectedAdmin: null,
    isLoading: false
  }
})
@Injectable()
export class AdminState {
  @Selector()
  static AboutPortal(state: AdminStateModel): CompanyInformation {
    return state.aboutPortal;
  }

  @Selector()
  static MainInformation(state: AdminStateModel): CompanyInformation {
    return state.mainPageInformation;
  }

  @Selector()
  static SupportInformation(state: AdminStateModel): CompanyInformation {
    return state.supportInformation;
  }

  @Selector()
  static LawsAndRegulations(state: AdminStateModel): CompanyInformation {
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
  static providerAdminHistory(state: AdminStateModel): SearchResponse<ProviderAdminHistory[]> | [] {
    return state.providerAdminHistory;
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

  constructor(
    private platformService: PlatformService,
    private categoriesService: DirectionsService,
    private historyLogService: HistoryLogService,
    private statisticService: StatisticReportsService,
    private childrenService: ChildrenService,
    private providerService: ProviderService,
    private ministryAdminService: MinistryAdminService,
    private regionAdminService: RegionAdminService,
    private areaAdminService: AreaAdminService,
    private router: Router,
    private location: Location,
    private store: Store
  ) {}

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
  getPlatformInfo({ dispatch }: StateContext<AdminStateModel>, {}: GetPlatformInfo): void {
    dispatch([new GetAboutPortal(), new GetMainPageInformation(), new GetSupportInformation(), new GetLawsAndRegulations()]);
  }

  @Action(UpdatePlatformInfo)
  updatePlatformInfo(
    { dispatch }: StateContext<AdminStateModel>,
    { payload, type }: UpdatePlatformInfo
  ): Observable<CompanyInformation | Observable<void>> {
    return this.platformService.updatePlatformInfo(payload, type).pipe(
      tap((res: CompanyInformation) => dispatch(new OnUpdatePlatformInfoSuccess(res, type))),
      catchError((error: Error) => of(dispatch(new OnUpdatePlatformInfoFail(error))))
    );
  }

  @Action(OnUpdatePlatformInfoFail)
  onUpdatePlatformInfoFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdatePlatformInfoFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
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
    if (type == AdminTabTypes.MainPage) {
      this.store.dispatch(new GetMainPageInfo());
      this.router.navigate(['/']);
      return;
    }
    this.router.navigate(['/admin-tools/platform'], {
      queryParams: { page: type }
    });
  }

  @Action(GetFilteredDirections)
  getFilteredDirections(
    { patchState }: StateContext<AdminStateModel>,
    { parameters }: GetFilteredDirections
  ): Observable<SearchResponse<Direction[]>> {
    patchState({ isLoading: true });
    return this.categoriesService.getFilteredDirections(parameters).pipe(
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
    return this.categoriesService
      .getDirectionById(payload)
      .pipe(tap((direction: Direction) => patchState({ direction, isLoading: false })));
  }

  @Action(CreateDirection)
  createDirection({ dispatch }: StateContext<AdminStateModel>, { payload }: CreateDirection): Observable<Observable<void> | Direction> {
    return this.categoriesService.createDirection(payload).pipe(
      tap((res: Direction) => dispatch(new OnCreateDirectionSuccess(res))),
      catchError((error: Error) => of(dispatch(new OnCreateDirectionFail(error))))
    );
  }

  @Action(OnCreateDirectionFail)
  onCreateDirectionFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnCreateDirectionFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
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

  @Action(UpdateDirection)
  updateDirection({ dispatch }: StateContext<AdminStateModel>, { payload }: UpdateDirection): Observable<Direction | Observable<void>> {
    return this.categoriesService.updateDirection(payload).pipe(
      tap((res: Direction) => dispatch(new OnUpdateDirectionSuccess(res))),
      catchError((error: Error) => of(dispatch(new OnUpdateDirectionFail(error))))
    );
  }

  @Action(OnUpdateDirectionFail)
  onUpdateDirectionFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateDirectionFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
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

  @Action(DeleteDirectionById)
  deleteDirectionById(
    { dispatch }: StateContext<AdminStateModel>,
    { payload, directionParameters }: DeleteDirectionById
  ): Observable<void | Observable<void>> {
    return this.categoriesService.deleteDirection(payload).pipe(
      tap(() => dispatch(new OnDeleteDirectionSuccess(directionParameters))),
      catchError((error: Error) => of(dispatch(new OnDeleteDirectionFail(error))))
    );
  }

  @Action(OnDeleteDirectionFail)
  onDeleteDirectionFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnDeleteDirectionFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
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
    return this.providerService.getFilteredProviders(providerParameters).pipe(
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

  @Action(GetProviderAdminHistory)
  getProviderAdminHistory(
    { patchState }: StateContext<AdminStateModel>,
    { payload, searchSting }: GetProviderAdminHistory
  ): Observable<SearchResponse<ProviderAdminHistory[]>> {
    patchState({ isLoading: true });
    return this.historyLogService.getProviderAdminHistory(payload, searchSting).pipe(
      tap((providerAdminHistory: SearchResponse<ProviderAdminHistory[]>) =>
        patchState({
          providerAdminHistory: providerAdminHistory ?? EMPTY_RESULT,
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
  blockProviderById(
    { dispatch }: StateContext<AdminStateModel>,
    { payload, parameters }: BlockProviderById
  ): Observable<void | Observable<void>> {
    return this.providerService.blockProvider(payload).pipe(
      tap(() => dispatch([new OnBlockSuccess(payload), new GetFilteredProviders(parameters)])),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnBlockFail(error))))
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
      default: {
        dispatch(new GetAllMinistryAdmins(parameters));
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
      default: {
        dispatch(new GetMinistryAdminById(payload));
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
      default: {
        dispatch(new CreateMinistryAdmin(payload));
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
      default: {
        dispatch(new UpdateMinistryAdmin(payload));
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
      default: {
        dispatch(new DeleteMinistryAdminById(payload));
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
      default: {
        dispatch(new BlockMinistryAdminById(payload));
      }
    }
  }

  @Action(ReinviteAdminById)
  reinvite({ dispatch }: StateContext<AdminStateModel>, { payload, adminType }: ReinviteAdminById): void {
    switch (adminType) {
      case AdminRoles.ministryAdmin: {
        dispatch(new ReinviteMinistryAdminById(payload));
        break;
      }
      case AdminRoles.regionAdmin: {
        dispatch(new ReinviteRegionAdminById(payload));
        break;
      }
      case AdminRoles.areaAdmin: {
        // dispatch();
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
    return this.ministryAdminService.getAllAdmin(parameters).pipe(
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
  createMinistryAdmin(
    { dispatch }: StateContext<AdminState>,
    { payload }: CreateMinistryAdmin
  ): Observable<MinistryAdmin | Observable<void>> {
    return this.ministryAdminService.createAdmin(payload).pipe(
      tap(() => dispatch(new OnCreateMinistryAdminSuccess())),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnCreateMinistryAdminFail(error))))
    );
  }

  @Action(OnCreateMinistryAdminFail)
  onCreateMinistryAdminFail({ dispatch }: StateContext<AdminState>, { payload }: OnCreateMinistryAdminFail): void {
    const message = payload.status === 500 ? SnackbarText.errorEmail : SnackbarText.error;
    dispatch(
      new ShowMessageBar({
        message,
        type: 'error'
      })
    );
  }

  @Action(OnCreateMinistryAdminSuccess)
  onCreateMinistryAdminSuccess({ dispatch }: StateContext<AdminState>): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.createAdminSuccess,
        type: 'success'
      }),
      new MarkFormDirty(false)
    ]);
    this.router.navigate(['/admin-tools/data/admins']);
  }

  @Action(UpdateMinistryAdmin)
  updateMinistryAdmin(
    { dispatch }: StateContext<AdminStateModel>,
    { payload }: UpdateMinistryAdmin
  ): Observable<MinistryAdmin | Observable<void>> {
    return this.ministryAdminService.updateAdmin(payload).pipe(
      tap((res: MinistryAdmin) => dispatch(new OnUpdateMinistryAdminSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnUpdateMinistryAdminFail(error))))
    );
  }

  @Action(OnUpdateMinistryAdminFail)
  onUpdateMinistryAdminFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateMinistryAdminFail): void {
    dispatch(
      new ShowMessageBar({
        message: SnackbarText.error,
        type: 'error'
      })
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

  @Action(DeleteMinistryAdminById)
  deleteMinistryAdminById(
    { dispatch }: StateContext<AdminStateModel>,
    { payload }: DeleteMinistryAdminById
  ): Observable<void | Observable<void>> {
    return this.ministryAdminService.deleteAdmin(payload).pipe(
      tap(() => dispatch(new OnDeleteMinistryAdminSuccess())),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnDeleteMinistryAdminFail(error))))
    );
  }

  @Action(OnDeleteMinistryAdminFail)
  onDeleteMinistryAdminFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnDeleteMinistryAdminFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
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

  @Action(BlockMinistryAdminById)
  blockMinistryAdmin(
    { dispatch }: StateContext<AdminStateModel>,
    { payload }: BlockMinistryAdminById
  ): Observable<void | Observable<void>> {
    return this.ministryAdminService.blockAdmin(payload.adminId, payload.isBlocked).pipe(
      tap(() => dispatch([new OnBlockSuccess(payload), new GetAllMinistryAdmins()])),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnBlockFail(error))))
    );
  }

  @Action(OnBlockFail)
  onBlockMinistryAdminFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnBlockFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnBlockSuccess)
  onBlockMinistryAdminSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: BlockMinistryAdminById): void {
    dispatch([
      new ShowMessageBar({
        message: payload.isBlocked ? SnackbarText.blockPerson : SnackbarText.unblockPerson,
        type: 'success'
      })
    ]);
  }

  @Action(ReinviteMinistryAdminById)
  reinviteMinistryAdminById({ dispatch }: StateContext<AdminStateModel>, { payload }: ReinviteMinistryAdminById): Observable<void> {
    return this.ministryAdminService.reinviteAdmin(payload).pipe(
      tap(() => dispatch(new OnReinviteMinistryAdminSuccess())),
      catchError((error: HttpErrorResponse) => dispatch(new OnReinviteMinistryAdminFail(error)))
    );
  }

  @Action(OnReinviteMinistryAdminSuccess)
  onReinviteMinistryAdminSuccess({ dispatch }: StateContext<AdminStateModel>): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.sendInvitation, type: 'success' }));
  }

  @Action(OnReinviteMinistryAdminFail)
  OnReinviteMinistryAdminFail({ dispatch }: StateContext<AdminStateModel>): void {
    dispatch([new ShowMessageBar({ message: SnackbarText.error, type: 'error' })]);
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
  createRegionAdmin({ dispatch }: StateContext<AdminState>, { payload }: CreateRegionAdmin): Observable<RegionAdmin | Observable<void>> {
    return this.regionAdminService.createAdmin(payload).pipe(
      tap(() => dispatch(new OnCreateRegionAdminSuccess())),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnCreateRegionAdminFail(error))))
    );
  }

  @Action(OnCreateRegionAdminFail)
  onCreateRegionAdminFail({ dispatch }: StateContext<AdminState>, { payload }: OnCreateRegionAdminFail): void {
    const message = payload.status === 500 ? SnackbarText.errorEmail : SnackbarText.error;
    dispatch(
      new ShowMessageBar({
        message,
        type: 'error'
      })
    );
  }

  @Action(OnCreateRegionAdminSuccess)
  onCreateRegionAdminSuccess({ dispatch }: StateContext<AdminState>): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.createAdminSuccess,
        type: 'success'
      }),
      new MarkFormDirty(false)
    ]);
    this.router.navigate(['/admin-tools/data/admins']);
  }

  @Action(UpdateRegionAdmin)
  updateRegionAdmin(
    { dispatch }: StateContext<AdminStateModel>,
    { payload }: UpdateRegionAdmin
  ): Observable<RegionAdmin | Observable<void>> {
    return this.regionAdminService.updateAdmin(payload).pipe(
      tap((res: RegionAdmin) => dispatch(new OnUpdateRegionAdminSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnUpdateRegionAdminFail(error))))
    );
  }

  @Action(OnUpdateRegionAdminFail)
  onUpdateRegionAdminFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateRegionAdminFail): void {
    dispatch(
      new ShowMessageBar({
        message: SnackbarText.error,
        type: 'error'
      })
    );
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
  deleteRegionAdminById(
    { dispatch }: StateContext<AdminStateModel>,
    { payload }: DeleteMinistryAdminById
  ): Observable<void | Observable<void>> {
    return this.regionAdminService.deleteAdmin(payload).pipe(
      tap(() => dispatch(new OnDeleteRegionAdminSuccess())),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnDeleteRegionAdminFail(error))))
    );
  }

  @Action(OnDeleteRegionAdminFail)
  onDeleteRegionAdminFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnDeleteRegionAdminFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
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

  @Action(BlockRegionAdminById)
  blockRegionAdmin({ dispatch }: StateContext<AdminStateModel>, { payload }: BlockRegionAdminById): Observable<void | Observable<void>> {
    return this.regionAdminService.blockAdmin(payload.adminId, payload.isBlocked).pipe(
      tap(() => dispatch([new OnBlockSuccess(payload), new GetAllRegionAdmins()])),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnBlockFail(error))))
    );
  }

  @Action(OnBlockFail)
  onBlockRegionAdminFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnBlockFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnBlockSuccess)
  onBlockRegionAdminSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: BlockRegionAdminById): void {
    dispatch([
      new ShowMessageBar({
        message: payload.isBlocked ? SnackbarText.blockPerson : SnackbarText.unblockPerson,
        type: 'success'
      })
    ]);
  }

  @Action(ReinviteRegionAdminById)
  reinviteRegionAdminById({ dispatch }: StateContext<AdminState>, { payload }: ReinviteRegionAdminById): Observable<void> {
    return this.regionAdminService.reinviteAdmin(payload).pipe(
      tap(() => dispatch(new OnReinviteRegionAdminSuccess())),
      catchError((error: HttpErrorResponse) => dispatch(new OnReinviteRegionAdminFail(error)))
    );
  }

  @Action(OnReinviteRegionAdminSuccess)
  onReinviteRegionAdminSuccess({ dispatch }: StateContext<AdminState>): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.sendInvitation, type: 'success' }));
  }

  @Action(OnReinviteRegionAdminFail)
  onReinviteRegionAdminFail({ dispatch }: StateContext<AdminState>): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
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
  createAreaAdmin({ dispatch }: StateContext<AdminState>, { payload }: CreateAreaAdmin): Observable<AreaAdmin | Observable<void>> {
    return this.areaAdminService.createAdmin(payload).pipe(
      tap(() => dispatch(new OnCreateAreaAdminSuccess())),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnCreateAreaAdminFail(error))))
    );
  }

  @Action(OnCreateAreaAdminFail)
  onCreateAreaAdminFail({ dispatch }: StateContext<AdminState>, { payload }: OnCreateAreaAdminFail): void {
    const message = payload.status === 500 ? SnackbarText.errorEmail : SnackbarText.error;
    dispatch(
      new ShowMessageBar({
        message,
        type: 'error'
      })
    );
  }

  @Action(OnCreateAreaAdminSuccess)
  onCreateAreaAdminSuccess({ dispatch }: StateContext<AdminState>): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.createAdminSuccess,
        type: 'success'
      }),
      new MarkFormDirty(false)
    ]);
    this.router.navigate(['/admin-tools/data/admins']);
  }

  @Action(UpdateAreaAdmin)
  updateAreaAdmin({ dispatch }: StateContext<AdminStateModel>, { payload }: UpdateAreaAdmin): Observable<AreaAdmin | Observable<void>> {
    return this.areaAdminService.updateAdmin(payload).pipe(
      tap((res: AreaAdmin) => dispatch(new OnUpdateAreaAdminSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnUpdateAreaAdminFail(error))))
    );
  }

  @Action(OnUpdateAreaAdminFail)
  onUpdateAreaAdminFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateAreaAdminFail): void {
    dispatch(
      new ShowMessageBar({
        message: SnackbarText.error,
        type: 'error'
      })
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

  @Action(DeleteAreaAdminById)
  deleteAreaAdminById(
    { dispatch }: StateContext<AdminStateModel>,
    { payload }: DeleteMinistryAdminById
  ): Observable<void | Observable<void>> {
    return this.areaAdminService.deleteAdmin(payload).pipe(
      tap(() => dispatch(new OnDeleteAreaAdminSuccess())),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnDeleteAreaAdminFail(error))))
    );
  }

  @Action(OnDeleteAreaAdminFail)
  onDeleteAreaAdminFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnDeleteAreaAdminFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
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

  @Action(BlockAreaAdminById)
  blockAreaAdmin({ dispatch }: StateContext<AdminStateModel>, { payload }: BlockAreaAdminById): Observable<void | Observable<void>> {
    return this.areaAdminService.blockAdmin(payload.adminId, payload.isBlocked).pipe(
      tap(() => dispatch([new OnBlockSuccess(payload), new GetAllAreaAdmins()])),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnBlockFail(error))))
    );
  }

  @Action(OnBlockFail)
  onBlockAreaAdminFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnBlockFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnBlockSuccess)
  onBlockAreaAdminSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: BlockAreaAdminById): void {
    dispatch([
      new ShowMessageBar({
        message: payload.isBlocked ? SnackbarText.blockPerson : SnackbarText.unblockPerson,
        type: 'success'
      })
    ]);
  }
}
