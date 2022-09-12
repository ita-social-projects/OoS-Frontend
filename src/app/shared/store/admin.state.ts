import { AllMinistryAdmins, MinistryAdminParameters } from './../models/ministryAdmin.model';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Direction, DirectionsFilter } from '../models/category.model';
import { MarkFormDirty, ShowMessageBar } from './app.actions';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { AdminTabsTitle } from '../enum/enumUA/tech-admin/admin-tabs';
import { DirectionsService } from '../services/directions/directions.service';
import { ChildCards } from '../models/child.model';
import { ChildrenService } from '../services/children/children.service';
import { CompanyInformation } from '../models/сompanyInformation.model';
import { Injectable } from '@angular/core';
import { Parent } from '../models/parent.model';
import { ParentService } from '../services/parent/parent.service';
import { PlatformService } from '../services/platform/platform.service';
import { Provider } from '../models/provider.model';
import { ProviderService } from '../services/provider/provider.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {
  BlockMinistryAdminById,
  CreateDirection,
  CreateMinistryAdmin,
  DeleteDirectionById,
  DeleteMinistryAdminById,
  GetAboutPortal,
  GetAllMinistryAdmins,
  GetAllProviders,
  GetApplicationHistory,
  GetChildrenForAdmin,
  GetDirectionById,
  GetFilteredDirections,
  GetFilteredProviders,
  GetLawsAndRegulations,
  GetMinistryAdminById,
  GetMinistryAdminProfile,
  GetParents,
  GetPlatformInfo,
  GetProviderAdminHistory,
  GetProviderHistory,
  GetSupportInformation,
  OnBlockMinistryAdminFail,
  OnBlockMinistryAdminSuccess,
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
} from "./admin.actions";
import { MinistryAdmin } from "../models/ministryAdmin.model";
import { MinistryAdminService } from "../services/ministry-admin/ministry-admin.service";
import { HttpErrorResponse } from "@angular/common/http";
import { ApplicationsHistory, ProviderAdminsHistory, ProvidersHistory } from '../models/history-log.model';
import { OnPageChangeDirections } from './paginator.actions';
import { PaginationConstants } from '../constants/constants';
import { HistoryLogService } from '../services/history-log/history-log.service';
import { GetProfile } from './registration.actions';

export interface AdminStateModel {
  aboutPortal: CompanyInformation;
  supportInformation: CompanyInformation;
  lawsAndRegulations: CompanyInformation;
  isLoading: boolean;
  direction: Direction;
  selectedDirection: Direction;
  filteredDirections: DirectionsFilter;
  parents: Parent[];
  children: ChildCards;
  providers: Provider[];
  selectedMinistryAdmin: MinistryAdmin;
  ministryAdmins: AllMinistryAdmins;
  providerHistory: ProvidersHistory | [];
  providerAdminHistory: ProviderAdminsHistory | [];
  applicationHistory: ApplicationsHistory | [];
}
@State<AdminStateModel>({
  name: 'admin',
  defaults: {
    aboutPortal: null,
    supportInformation: null,
    lawsAndRegulations: null,
    direction: null,
    isLoading: false,
    filteredDirections: undefined,
    selectedDirection: null,
    children: null,
    providers: null,
    parents: null,
    selectedMinistryAdmin: null,
    ministryAdmins: null,
    providerHistory: null,
    providerAdminHistory: null,
    applicationHistory: null,
  },
})
@Injectable()
export class AdminState {
  adminStateModel: any;

  @Selector() static AboutPortal(state: AdminStateModel): CompanyInformation {
    return state.aboutPortal;
  }

  @Selector() static providers(state: AdminStateModel): Provider[] {
    return state.providers;
  }

  @Selector() static ministryAdmins (state: AdminStateModel): AllMinistryAdmins {
    return state.ministryAdmins;
  }

  @Selector() static selectedMinistryAdmin (state: AdminStateModel): MinistryAdmin {
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

  @Selector() static filteredDirections(state: AdminStateModel): DirectionsFilter {
    return state.filteredDirections;
  }

  @Selector() static isLoading(state: AdminStateModel): boolean {
    return state.isLoading;
  }

  @Selector() static parents(state: AdminStateModel): Parent[] {
    return state.parents;
  }

  @Selector() static children(state: AdminStateModel): ChildCards {
    return state.children;
  }

  @Selector() static providerHistory(state: AdminStateModel): ProvidersHistory | [] {
    return state.providerHistory;
  }

  @Selector() static providerAdminHistory(state: AdminStateModel): ProviderAdminsHistory | [] {
    return state.providerAdminHistory;
  }

  @Selector() static applicationHistory(state: AdminStateModel): ApplicationsHistory | [] {
    return state.applicationHistory;
  }

  constructor(
    private platformService: PlatformService,
    private categoriesService: DirectionsService,
    private parentService: ParentService,
    private childrenService: ChildrenService,
    private router: Router,
    private providerService: ProviderService,
    private ministryAdminService: MinistryAdminService,
    private historyLogService: HistoryLogService,
    private location: Location
  ) {}

  @Action(GetPlatformInfo)
  getPlatformInfo({ dispatch }: StateContext<AdminStateModel>, {}: GetPlatformInfo): void {
    dispatch([new GetAboutPortal(), new GetSupportInformation(), new GetLawsAndRegulations()]);
  }

  @Action(GetAllProviders)
  getAllProviders({ patchState }: StateContext<AdminStateModel>): Observable<Provider[]> {
    patchState({ isLoading: true });
    return this.providerService.getAllProviders().pipe(
      tap((providers: Provider[]) => {
        return patchState({ providers: providers, isLoading: false });
      })
    );
  }

  @Action(GetFilteredProviders)
  getFilteredProvider(
    { patchState }: StateContext<AdminStateModel>,
    { payload }: GetFilteredProviders
  ): Observable<object> {
    patchState({ isLoading: true });
    return this.providerService.getFilteredProviders(payload).pipe(
      tap((filteredProviders: Provider[]) => patchState({ providers: filteredProviders, isLoading: false }))
    );
  }
  @Action(GetAboutPortal)
  getAboutPortal({ patchState }: StateContext<AdminStateModel>, {}: GetAboutPortal): Observable<CompanyInformation> {
    patchState({ isLoading: true });
    return this.platformService
      .getPlatformInfo(AdminTabsTitle.AboutPortal)
      .pipe(tap((aboutPortal: CompanyInformation) => patchState({ aboutPortal: aboutPortal, isLoading: false })));
  }

  @Action(GetSupportInformation)
  getSupportInformation(
    { patchState }: StateContext<AdminStateModel>,
    {}: GetSupportInformation
  ): Observable<CompanyInformation> {
    patchState({ isLoading: true });
    return this.platformService
      .getPlatformInfo(AdminTabsTitle.SupportInformation)
      .pipe(
        tap((supportInformation: CompanyInformation) =>
          patchState({ supportInformation: supportInformation, isLoading: false })
        )
      );
  }

  @Action(GetLawsAndRegulations)
  getLawsAndRegulations(
    { patchState }: StateContext<AdminStateModel>,
    {}: GetLawsAndRegulations
  ): Observable<CompanyInformation> {
    patchState({ isLoading: true });
    return this.platformService
      .getPlatformInfo(AdminTabsTitle.LawsAndRegulations)
      .pipe(
        tap((lawsAndRegulations: CompanyInformation) =>
          patchState({ lawsAndRegulations: lawsAndRegulations, isLoading: false })
        )
      );
  }

  @Action(UpdatePlatformInfo)
  updatePlatformInfo(
    { dispatch }: StateContext<AdminStateModel>,
    { payload, type }: UpdatePlatformInfo
  ): Observable<object> {
    return this.platformService.updatePlatformInfo(payload, type).pipe(
      tap(res => dispatch(new OnUpdatePlatformInfoSuccess(res, type))),
      catchError((error: Error) => of(dispatch(new OnUpdatePlatformInfoFail(error))))
    );
  }

  @Action(OnUpdatePlatformInfoFail)
  onUpdatePlatformInfoFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdatePlatformInfoFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnUpdatePlatformInfoSuccess)
  onUpdatePlatformInfoSuccess(
    { dispatch }: StateContext<AdminStateModel>,
    { payload, type }: OnUpdatePlatformInfoSuccess
  ): void {
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({ message: 'Інформація про портал успішно відредагована', type: 'success' }),
    ]);
    this.router.navigate([`/admin-tools/platform`], { queryParams: { page: type } });
  }

  @Action(DeleteDirectionById)
  deleteDirectionById(
    { dispatch }: StateContext<AdminStateModel>,
    { payload }: DeleteDirectionById
  ): Observable<object> {
    return this.categoriesService.deleteDirection(payload).pipe(
      tap(res => dispatch(new OnDeleteDirectionSuccess(res))),
      catchError((error: Error) => of(dispatch(new OnDeleteDirectionFail(error))))
    );
  }

  @Action(OnDeleteDirectionFail)
  onDeleteDirectionFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnDeleteDirectionFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnDeleteDirectionSuccess)
  onDeleteDirectionSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: OnDeleteDirectionSuccess): void {
    dispatch([new ShowMessageBar({ message: 'Напрямок видалено!', type: 'success' }), new GetFilteredDirections()]);
  }

  @Action(CreateDirection)
  createDirection({ dispatch }: StateContext<AdminStateModel>, { payload }: CreateDirection): Observable<object> {
    return this.categoriesService.createDirection(payload).pipe(
      tap(res => dispatch(new OnCreateDirectionSuccess(res))),
      catchError((error: Error) => of(dispatch(new OnCreateDirectionFail(error))))
    );
  }

  @Action(OnCreateDirectionFail)
  onCreateDirectionFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnCreateDirectionFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnCreateDirectionSuccess)
  onCreateDirectionSuccess(
    { dispatch, patchState }: StateContext<AdminStateModel>,
    { payload }: OnCreateDirectionSuccess
  ): void {
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({ message: 'Напрямок успішно створенний', type: 'success' }),
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
      tap(res => dispatch(new OnUpdateDirectionSuccess(res))),
      catchError((error: Error) => of(dispatch(new OnUpdateDirectionFail(error))))
    );
  }
  @Action(OnUpdateDirectionFail)
  onUpdateDirectionfail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateDirectionFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnUpdateDirectionSuccess)
  onUpdateDirectionSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateDirectionSuccess): void {
    dispatch([
      new MarkFormDirty(false),
      new GetDirectionById(payload.id),
      new ShowMessageBar({ message: 'Напрямок успішно відредагованний', type: 'success' }),
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
      .pipe(tap((direction: Direction) => patchState({ direction: direction, isLoading: false })));
  }

  @Action(GetFilteredDirections)
  getFilteredDirections({ patchState, getState }: StateContext<AdminStateModel>, { payload }: GetFilteredDirections) {
    patchState({ isLoading: true });
    return this.categoriesService.getFilteredDirections(payload).pipe(
      tap(
        (filterResult: DirectionsFilter) =>
          patchState(
            filterResult
              ? { filteredDirections: filterResult, isLoading: false }
              : { filteredDirections: undefined, isLoading: false }
          ),
        () => patchState({ isLoading: false, direction: null })
      )
    );
  }

  @Action(GetParents)
  getParents({ patchState }: StateContext<AdminStateModel>, {}: GetParents): Observable<Parent[]> {
    patchState({ isLoading: true });
    return this.parentService.getParents().pipe(
      tap((parents: Parent[]) => {
        return patchState({ parents: parents, isLoading: false });
      })
    );
  }

  @Action(GetChildrenForAdmin)
  getChildrenForAdmin(
    { patchState }: StateContext<AdminStateModel>,
    { parameters }: GetChildrenForAdmin
  ): Observable<ChildCards> {
    patchState({ isLoading: true });
    return this.childrenService.getChildrenForAdmin(parameters).pipe(
      tap((children: ChildCards) => {
        return patchState({ children: children, isLoading: false });
      })
    );
  }

  @Action(GetProviderHistory)
  GetProviderHistory(
    { patchState }: StateContext<AdminStateModel>,
    { payload, searchSting }: GetProviderHistory
    ): Observable<ProvidersHistory> {
    patchState({ isLoading: true });
    return this.historyLogService.getProviderHistory(payload, searchSting).pipe(
      tap((providers: ProvidersHistory) => {
        return patchState({ providerHistory: providers ? providers : [], isLoading: false });
      })
    );
  }

  @Action(GetProviderAdminHistory)
  GetProviderAdminHistory(
    { patchState }: StateContext<AdminStateModel>,
    { payload, searchSting }: GetProviderAdminHistory
    ): Observable<ProviderAdminsHistory> {
    patchState({ isLoading: true });
    return this.historyLogService.getProviderAdminHistory(payload, searchSting).pipe(
      tap((providerAdmin: ProviderAdminsHistory) => {
        return patchState({ providerAdminHistory: providerAdmin ? providerAdmin : [], isLoading: false });
      })
    );
  }

  @Action(GetApplicationHistory)
  GetApplicationHistory(
    { patchState }: StateContext<AdminStateModel>,
    { payload, searchSting }: GetApplicationHistory
    ): Observable<ApplicationsHistory> {
    patchState({ isLoading: true });
    return this.historyLogService.getApplicationHistory(payload, searchSting).pipe(
      tap((application: ApplicationsHistory) => {
        return patchState({ applicationHistory: application ? application : [], isLoading: false });
      })
    );
  }

  @Action(GetMinistryAdminProfile)
  getMinistryAdminProfile({ patchState }: StateContext<AdminStateModel>, {}: GetMinistryAdminProfile): Observable<MinistryAdmin>{
    patchState({ isLoading: true });
    return this.ministryAdminService
    .getMinistryAdminProfile()
    .pipe(
      tap((selectedMinistryAdmin: MinistryAdmin) => patchState({ selectedMinistryAdmin: selectedMinistryAdmin, isLoading: false})));
  }

  @Action(CreateMinistryAdmin)
  createMinistryAdmin(
    { dispatch }: StateContext<AdminState>,
    { payload }: CreateMinistryAdmin
  ): Observable<object> {
    return this.ministryAdminService.createMinistryAdmin(payload).pipe(
      tap((res: object) => dispatch(new OnCreateMinistryAdminSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnCreateMinistryAdminFail(error))))
    );
  }

  @Action(OnCreateMinistryAdminFail)
  onCreateMinistryAdminFail({ dispatch }: StateContext<AdminState>, { payload }: OnCreateMinistryAdminFail): void {
    throwError(payload);
    dispatch(
      new ShowMessageBar({
        message: 'На жаль виникла помилка при створенні адміністратора міністерства',
        type: 'error',
      })
    );
  }

  @Action(OnCreateMinistryAdminSuccess)
  onCreateMinistryAdminSuccess(
    { dispatch }: StateContext<AdminState>,
    { payload }: OnCreateMinistryAdminSuccess
  ): void {
    dispatch([
      new ShowMessageBar({
        message: 'Адміністратор міністерства успішно створено',
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
  ): Observable<AllMinistryAdmins> {
    patchState({ isLoading: true });
    return this.ministryAdminService.getAllMinistryAdmin(parameters).pipe(
      tap((ministryAdmins: AllMinistryAdmins) => patchState({ ministryAdmins: ministryAdmins, isLoading: false }))
    );
  }

  @Action(GetMinistryAdminById)
  getMinistryAdminById(
    { patchState }: StateContext<AdminStateModel>,
    { payload }: GetMinistryAdminById
  ): Observable<MinistryAdmin> {
    patchState({ isLoading: true });
    return this.ministryAdminService.getMinistryAdminById(payload).pipe(
      tap((selectedMinistryAdmin: MinistryAdmin) => patchState({ selectedMinistryAdmin: selectedMinistryAdmin, isLoading: false }))
    );
  }
  
  @Action(DeleteMinistryAdminById)
  deleteMinistryAdminById({ dispatch }: StateContext<AdminStateModel>, { payload }: DeleteMinistryAdminById): Observable<object> {
    return this.ministryAdminService.deleteMinistryAdmin(payload).pipe(
      tap((res: object) => dispatch(new OnDeleteMinistryAdminSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnDeleteMinistryAdminFail(error))))
    );
  }

  @Action(OnDeleteMinistryAdminFail)
  onDeleteMinistryAdminFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnDeleteMinistryAdminFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnDeleteMinistryAdminSuccess)
  onDeleteMinistryAdminSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: OnDeleteMinistryAdminSuccess): void {
    dispatch([new ShowMessageBar({ message: 'Адміна міністерства видалено!', type: 'success' }), new GetAllMinistryAdmins()]);
  }

  @Action(BlockMinistryAdminById)
  blockMinistryAdmin(
    { dispatch }: StateContext<AdminStateModel>,
    { payload }: BlockMinistryAdminById
  ): Observable<object> {
    return this.ministryAdminService.blockMinistryAdmin(payload).pipe(
      tap((res: object) => dispatch(new OnBlockMinistryAdminSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnBlockMinistryAdminFail(error))))
    );
  }

  @Action(OnBlockMinistryAdminFail)
  onBlockMinistryAdminFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnBlockMinistryAdminFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnBlockMinistryAdminSuccess)
  onBlockMinistryAdminSuccess(
    { dispatch }: StateContext<AdminStateModel>,
    { payload }: OnBlockMinistryAdminSuccess
  ): void {
    dispatch([
      new GetAllMinistryAdmins(),
      new ShowMessageBar({
        message: `Дякуємо! адміністратора міністерства заблоковано!`,
        type: 'success',
      }),
    ]);
  }

  @Action(UpdateMinistryAdmin)
  updateMinistryAdmin(
    { dispatch }: StateContext<AdminStateModel>,
    { payload }: UpdateMinistryAdmin,
  ): Observable<object> {
    return this.ministryAdminService.updateMinistryAdmin(payload).pipe(
      tap((res: object) => dispatch(new OnUpdateMinistryAdminSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnUpdateMinistryAdminFail(error))))
    );
  }

  @Action(OnUpdateMinistryAdminFail)
  onUpdateMinistryAdminrfail(
    { dispatch }: StateContext<AdminStateModel>, 
    { payload }: OnUpdateMinistryAdminFail
  ): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ 
      message: 'На жаль виникла помилка', 
      type: 'error' 
    }));
  }

  @Action(OnUpdateMinistryAdminSuccess)
  onUpdateMinistryAdminSuccess(
    { dispatch }: StateContext<AdminStateModel>, 
    { payload }: OnUpdateMinistryAdminSuccess
  ): void {
    dispatch(new MarkFormDirty(false));
    console.log('Ministry Admin is updated', payload);
    dispatch([
      new ShowMessageBar({
        message: 'Адміністратор міністерства успішно відредагований',
        type: 'success',
      }),
    ]);
    dispatch(new GetProfile()).subscribe(() => this.router.navigate(['/admin-tools/data/admins']));
  }

}
