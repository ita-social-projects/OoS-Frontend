import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Direction } from '../models/category.model';
import { MarkFormDirty, ShowMessageBar } from './app.actions';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AdminTabTypes } from '../enum/enumUA/tech-admin/admin-tabs';
import { DirectionsService } from '../services/directions/directions.service';
import { Child } from '../models/child.model';
import { ChildrenService } from '../services/children/children.service';
import { CompanyInformation } from '../models/сompanyInformation.model';
import { Injectable } from '@angular/core';
import { Parent } from '../models/parent.model';
import { PlatformService } from '../services/platform/platform.service';
import { Provider } from '../models/provider.model';
import { ProviderService } from '../services/provider/provider.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  BlockMinistryAdminById,
  BlockProviderById,
  CreateDirection,
  CreateMinistryAdmin,
  DeleteDirectionById,
  DeleteMinistryAdminById,
  GetAboutPortal,
  GetAllMinistryAdmins,
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
  GetStatisticReports,
  GetSupportInformation,
  OnBlockFail,
  OnBlockSuccess,
  OnCreateDirectionFail,
  OnCreateDirectionSuccess,
  OnCreateMinistryAdminFail,
  OnCreateMinistryAdminSuccess,
  OnDeleteDirectionFail,
  OnDeleteDirectionSuccess,
  OnDeleteMinistryAdminFail,
  OnDeleteMinistryAdminSuccess,
  OnUpdateDirectionFail,
  OnUpdateDirectionSuccess,
  OnUpdateMinistryAdminFail,
  OnUpdateMinistryAdminSuccess,
  OnUpdatePlatformInfoFail,
  OnUpdatePlatformInfoSuccess,
  UpdateDirection,
  UpdateMinistryAdmin,
  UpdatePlatformInfo,
} from './admin.actions';
import { MinistryAdmin } from '../models/ministryAdmin.model';
import { MinistryAdminService } from '../services/ministry-admin/ministry-admin.service';
import { HttpErrorResponse } from '@angular/common/http';
import { ApplicationHistory, ProviderAdminHistory, ProviderHistory } from '../models/history-log.model';
import { OnPageChangeDirections } from './paginator.actions';
import { EMPTY_RESULT, PaginationConstants } from '../constants/constants';
import { HistoryLogService } from '../services/history-log/history-log.service';
import { SnackbarText } from '../enum/messageBar';
import { SearchResponse } from '../models/search.model';
import { GetMainPageInfo } from './main-page.actions';
import { StatisticReport } from '../models/statistic.model';
import { StatisticReportsService } from '../services/statistics-reports/statistic-reports.service';

export interface AdminStateModel {
  aboutPortal: CompanyInformation;
  mainPageInformation: CompanyInformation;
  supportInformation: CompanyInformation;
  lawsAndRegulations: CompanyInformation;
  isLoading: boolean;
  direction: Direction;
  selectedDirection: Direction;
  filteredDirections: SearchResponse<Direction[]>;
  parents: Parent[];
  children: SearchResponse<Child[]>;
  providers: SearchResponse<Provider[]>;
  selectedMinistryAdmin: MinistryAdmin;
  ministryAdmins: SearchResponse<MinistryAdmin[]>;
  providerHistory: SearchResponse<ProviderHistory[]>;
  providerAdminHistory: SearchResponse<ProviderAdminHistory[]>;
  applicationHistory: SearchResponse<ApplicationHistory[]>;
  statisticsReports: SearchResponse<StatisticReport[]>;
}
@State<AdminStateModel>({
  name: 'admin',
  defaults: {
    aboutPortal: null,
    mainPageInformation: null,
    supportInformation: null,
    lawsAndRegulations: null,
    direction: null,
    isLoading: false,
    filteredDirections: null,
    selectedDirection: null,
    children: null,
    providers: null,
    parents: null,
    selectedMinistryAdmin: null,
    ministryAdmins: null,
    providerHistory: null,
    providerAdminHistory: null,
    applicationHistory: null,
    statisticsReports: null,
  },
})
@Injectable()
export class AdminState {
  @Selector() static AboutPortal(state: AdminStateModel): CompanyInformation {
    return state.aboutPortal;
  }

  @Selector() static MainInformation(state: AdminStateModel): CompanyInformation {
    return state.mainPageInformation;
  }

  @Selector() static providers(state: AdminStateModel): SearchResponse<Provider[]> {
    return state.providers;
  }

  @Selector() static ministryAdmins(state: AdminStateModel): SearchResponse<MinistryAdmin[]> {
    return state.ministryAdmins;
  }

  @Selector() static selectedMinistryAdmin(state: AdminStateModel): MinistryAdmin {
    return state.selectedMinistryAdmin;
  }

  @Selector() static SupportInformation(state: AdminStateModel): CompanyInformation {
    return state.supportInformation;
  }

  @Selector() static LawsAndRegulations(state: AdminStateModel): CompanyInformation {
    return state.lawsAndRegulations;
  }

  @Selector() static direction(state: AdminStateModel): Direction {
    return state.direction;
  }

  @Selector() static filteredDirections(state: AdminStateModel): SearchResponse<Direction[]> {
    return state.filteredDirections;
  }

  @Selector() static isLoading(state: AdminStateModel): boolean {
    return state.isLoading;
  }

  @Selector() static parents(state: AdminStateModel): Parent[] {
    return state.parents;
  }

  @Selector() static children(state: AdminStateModel): SearchResponse<Child[]> {
    return state.children;
  }

  @Selector() static providerHistory(state: AdminStateModel): SearchResponse<ProviderHistory[]> | [] {
    return state.providerHistory;
  }

  @Selector() static providerAdminHistory(state: AdminStateModel): SearchResponse<ProviderAdminHistory[]> | [] {
    return state.providerAdminHistory;
  }

  @Selector() static applicationHistory(state: AdminStateModel): SearchResponse<ApplicationHistory[]> | [] {
    return state.applicationHistory;
  }

  @Selector() static statisticsReports(state: AdminStateModel): SearchResponse<StatisticReport[]> {
    return state.statisticsReports;
  }

  constructor(
    private platformService: PlatformService,
    private categoriesService: DirectionsService,
    private childrenService: ChildrenService,
    private router: Router,
    private providerService: ProviderService,
    private ministryAdminService: MinistryAdminService,
    private historyLogService: HistoryLogService,
    private statisticService: StatisticReportsService,
    private location: Location,
    private store: Store
  ) {}

  @Action(GetPlatformInfo)
  getPlatformInfo({ dispatch }: StateContext<AdminStateModel>, {}: GetPlatformInfo): void {
    dispatch([
      new GetAboutPortal(),
      new GetMainPageInformation(),
      new GetSupportInformation(),
      new GetLawsAndRegulations(),
    ]);
  }

  @Action(GetFilteredProviders)
  getFilteredProvider(
    { patchState }: StateContext<AdminStateModel>,
    { payload }: GetFilteredProviders
  ): Observable<SearchResponse<Provider[]>> {
    patchState({ isLoading: true });
    return this.providerService
      .getFilteredProviders(payload)
      .pipe(
        tap((providers: SearchResponse<Provider[]>) =>
          patchState({ providers: providers ?? EMPTY_RESULT, isLoading: false })
        )
      );
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
  onUpdatePlatformInfoSuccess(
    { dispatch }: StateContext<AdminStateModel>,
    { type }: OnUpdatePlatformInfoSuccess
  ): void {
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({
        message: SnackbarText.updatePortal,
        type: 'success',
      }),
    ]);
    if (type == AdminTabTypes.MainPage) {
      this.store.dispatch(new GetMainPageInfo());
      this.router.navigate(['/']);
      return;
    }
    this.router.navigate(['/admin-tools/platform'], {
      queryParams: { page: type },
    });
  }

  @Action(DeleteDirectionById)
  deleteDirectionById(
    { dispatch }: StateContext<AdminStateModel>,
    { payload }: DeleteDirectionById
  ): Observable<void | Observable<void>> {
    return this.categoriesService.deleteDirection(payload).pipe(
      tap(() => dispatch(new OnDeleteDirectionSuccess())),
      catchError((error: Error) => of(dispatch(new OnDeleteDirectionFail(error))))
    );
  }

  @Action(OnDeleteDirectionFail)
  onDeleteDirectionFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnDeleteDirectionFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnDeleteDirectionSuccess)
  onDeleteDirectionSuccess({ dispatch }: StateContext<AdminStateModel>): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.deleteDirection,
        type: 'success',
      }),
      new GetFilteredDirections(),
    ]);
  }

  @Action(CreateDirection)
  createDirection(
    { dispatch }: StateContext<AdminStateModel>,
    { payload }: CreateDirection
  ): Observable<Observable<void> | Direction> {
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
  onCreateDirectionSuccess(
    { dispatch, patchState }: StateContext<AdminStateModel>,
    { payload }: OnCreateDirectionSuccess
  ): void {
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({
        message: SnackbarText.createDirection,
        type: 'success',
      }),
    ]);
    patchState({ direction: payload });
    this.location.back();
  }

  @Action(UpdateDirection)
  updateDirection(
    { dispatch }: StateContext<AdminStateModel>,
    { payload }: UpdateDirection
  ): Observable<Direction | Observable<void>> {
    return this.categoriesService.updateDirection(payload).pipe(
      tap((res: Direction) => dispatch(new OnUpdateDirectionSuccess(res))),
      catchError((error: Error) => of(dispatch(new OnUpdateDirectionFail(error))))
    );
  }

  @Action(OnUpdateDirectionFail)
  onUpdateDirectionfail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateDirectionFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnUpdateDirectionSuccess)
  onUpdateDirectionSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateDirectionSuccess): void {
    dispatch([
      new MarkFormDirty(false),
      new GetDirectionById(payload.id),
      new ShowMessageBar({
        message: SnackbarText.updateDirection,
        type: 'success',
      }),
      new OnPageChangeDirections(PaginationConstants.firstPage),
      new GetFilteredDirections(),
    ]);
    this.location.back();
  }

  @Action(GetDirectionById)
  getDirectionById(
    { patchState }: StateContext<AdminStateModel>,
    { payload }: GetDirectionById
  ): Observable<Direction> {
    patchState({ isLoading: true });
    return this.categoriesService
      .getDirectionById(payload)
      .pipe(tap((direction: Direction) => patchState({ direction, isLoading: false })));
  }

  @Action(GetFilteredDirections)
  getFilteredDirections(
    { patchState }: StateContext<AdminStateModel>,
    { payload }: GetFilteredDirections
  ): Observable<SearchResponse<Direction[]>> {
    patchState({ isLoading: true });
    return this.categoriesService.getFilteredDirections(payload).pipe(
      tap((filteredDirections: SearchResponse<Direction[]>) =>
        patchState({
          filteredDirections: filteredDirections ?? EMPTY_RESULT,
          isLoading: false,
          direction: null,
        })
      )
    );
  }

  @Action(GetChildrenForAdmin)
  getChildrenForAdmin(
    { patchState }: StateContext<AdminStateModel>,
    { parameters }: GetChildrenForAdmin
  ): Observable<SearchResponse<Child[]>> {
    patchState({ isLoading: true });
    return this.childrenService
      .getChildrenForAdmin(parameters)
      .pipe(
        tap((children: SearchResponse<Child[]>) => patchState({ children: children ?? EMPTY_RESULT, isLoading: false }))
      );
  }

  @Action(GetProviderHistory)
  GetProviderHistory(
    { patchState }: StateContext<AdminStateModel>,
    { payload, searchSting }: GetProviderHistory
  ): Observable<SearchResponse<ProviderHistory[]>> {
    patchState({ isLoading: true });
    return this.historyLogService.getProviderHistory(payload, searchSting).pipe(
      tap((providerHistory: SearchResponse<ProviderHistory[]>) =>
        patchState({
          providerHistory: providerHistory ?? EMPTY_RESULT,
          isLoading: false,
        })
      )
    );
  }

  @Action(GetProviderAdminHistory)
  GetProviderAdminHistory(
    { patchState }: StateContext<AdminStateModel>,
    { payload, searchSting }: GetProviderAdminHistory
  ): Observable<SearchResponse<ProviderAdminHistory[]>> {
    patchState({ isLoading: true });
    return this.historyLogService.getProviderAdminHistory(payload, searchSting).pipe(
      tap((providerAdminHistory: SearchResponse<ProviderAdminHistory[]>) =>
        patchState({
          providerAdminHistory: providerAdminHistory ?? EMPTY_RESULT,
          isLoading: false,
        })
      )
    );
  }

  @Action(GetApplicationHistory)
  GetApplicationHistory(
    { patchState }: StateContext<AdminStateModel>,
    { payload, searchSting }: GetApplicationHistory
  ): Observable<SearchResponse<ApplicationHistory[]>> {
    patchState({ isLoading: true });
    return this.historyLogService.getApplicationHistory(payload, searchSting).pipe(
      tap((applicationHistory: SearchResponse<ApplicationHistory[]>) =>
        patchState({
          applicationHistory: applicationHistory ?? EMPTY_RESULT,
          isLoading: false,
        })
      )
    );
  }

  @Action(GetMinistryAdminProfile)
  getMinistryAdminProfile({ patchState }: StateContext<AdminStateModel>): Observable<MinistryAdmin> {
    patchState({ isLoading: true });
    return this.ministryAdminService.getMinistryAdminProfile().pipe(
      tap((selectedMinistryAdmin: MinistryAdmin) =>
        patchState({
          selectedMinistryAdmin: selectedMinistryAdmin,
          isLoading: false,
        })
      )
    );
  }

  @Action(CreateMinistryAdmin)
  createMinistryAdmin(
    { dispatch }: StateContext<AdminState>,
    { payload }: CreateMinistryAdmin
  ): Observable<MinistryAdmin | Observable<void>> {
    return this.ministryAdminService.createMinistryAdmin(payload).pipe(
      tap(() => dispatch(new OnCreateMinistryAdminSuccess())),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnCreateMinistryAdminFail(error))))
    );
  }

  @Action(OnCreateMinistryAdminFail)
  onCreateMinistryAdminFail({ dispatch }: StateContext<AdminState>, { payload }: OnCreateMinistryAdminFail): void {
    const message = payload.message === 'Internal Server Error' ? SnackbarText.errorEmail : SnackbarText.error;
    dispatch(
      new ShowMessageBar({
        message: message,
        type: 'error',
      })
    );
  }

  @Action(OnCreateMinistryAdminSuccess)
  onCreateMinistryAdminSuccess({ dispatch }: StateContext<AdminState>): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.createMinistryAdminSuccess,
        type: 'success',
      }),
      new MarkFormDirty(false),
    ]);
    this.router.navigate(['/admin-tools/data/admins']);
  }

  @Action(GetAllMinistryAdmins)
  getAllMinistryAdmin(
    { patchState }: StateContext<AdminStateModel>,
    { parameters }: GetAllMinistryAdmins
  ): Observable<SearchResponse<MinistryAdmin[]>> {
    patchState({ isLoading: true });
    return this.ministryAdminService
      .getAllMinistryAdmin(parameters)
      .pipe(
        tap((ministryAdmins: SearchResponse<MinistryAdmin[]>) =>
          patchState({ ministryAdmins: ministryAdmins ?? EMPTY_RESULT, isLoading: false })
        )
      );
  }

  @Action(GetMinistryAdminById)
  getMinistryAdminById(
    { patchState }: StateContext<AdminStateModel>,
    { payload }: GetMinistryAdminById
  ): Observable<MinistryAdmin> {
    patchState({ isLoading: true });
    return this.ministryAdminService
      .getMinistryAdminById(payload)
      .pipe(tap((selectedMinistryAdmin: MinistryAdmin) => patchState({ selectedMinistryAdmin, isLoading: false })));
  }

  @Action(DeleteMinistryAdminById)
  deleteMinistryAdminById(
    { dispatch }: StateContext<AdminStateModel>,
    { payload }: DeleteMinistryAdminById
  ): Observable<void | Observable<void>> {
    return this.ministryAdminService.deleteMinistryAdmin(payload).pipe(
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
        message: SnackbarText.deleteMinistryAdmin,
        type: 'success',
      }),
      new GetAllMinistryAdmins(),
    ]);
  }

  @Action(BlockMinistryAdminById)
  blockMinistryAdmin(
    { dispatch }: StateContext<AdminStateModel>,
    { payload }: BlockMinistryAdminById
  ): Observable<void | Observable<void>> {
    return this.ministryAdminService.blockMinistryAdmin(payload.ministryAdminId, payload.isBlocked).pipe(
      tap(() => dispatch([new OnBlockSuccess(payload), new GetAllMinistryAdmins()])),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnBlockFail(error))))
    );
  }

  @Action(BlockProviderById)
  blockProviderById(
    { dispatch }: StateContext<AdminStateModel>,
    { payload }: BlockProviderById
  ): Observable<void | Observable<void>> {
    return this.providerService.blockProvider(payload).pipe(
      tap(() => dispatch([new OnBlockSuccess(payload), new GetFilteredProviders()])),
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
        type: 'success',
      }),
    ]);
  }

  @Action(UpdateMinistryAdmin)
  updateMinistryAdmin(
    { dispatch }: StateContext<AdminStateModel>,
    { payload }: UpdateMinistryAdmin
  ): Observable<MinistryAdmin | Observable<void>> {
    return this.ministryAdminService.updateMinistryAdmin(payload).pipe(
      tap((res: MinistryAdmin) => dispatch(new OnUpdateMinistryAdminSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnUpdateMinistryAdminFail(error))))
    );
  }

  @Action(OnUpdateMinistryAdminFail)
  onUpdateMinistryAdminrfail(
    { dispatch }: StateContext<AdminStateModel>,
    { payload }: OnUpdateMinistryAdminFail
  ): void {
    dispatch(
      new ShowMessageBar({
        message: SnackbarText.error,
        type: 'error',
      })
    );
  }

  @Action(OnUpdateMinistryAdminSuccess)
  onUpdateMinistryAdminSuccess({ dispatch }: StateContext<AdminStateModel>): void {
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({
        message: SnackbarText.updateMinistryAdmin,
        type: 'success',
      }),
    ]);
    this.router.navigate(['/admin-tools/data/admins']);
  }
}
