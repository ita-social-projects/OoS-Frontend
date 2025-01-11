import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Constants, EMPTY_RESULT } from 'shared/constants/constants';
import { SnackbarText } from 'shared/enum/enumUA/message-bar';
import { ProviderStatuses } from 'shared/enum/statuses';
import { Achievement } from 'shared/models/achievement.model';
import { Application } from 'shared/models/application.model';
import { BlockedParent } from 'shared/models/block.model';
import { Child } from 'shared/models/child.model';
import { TruncatedItem } from 'shared/models/item.model';
import { Employee } from 'shared/models/employee.model';
import { Provider, ProviderWithLicenseStatus, ProviderWithStatus } from 'shared/models/provider.model';
import { SearchResponse } from 'shared/models/search.model';
import { Workshop, WorkshopProviderViewCard, WorkshopStatus } from 'shared/models/workshop.model';
import { AchievementsService } from 'shared/services/achievements/achievements.service';
import { ApplicationService } from 'shared/services/applications/application.service';
import { BlockService } from 'shared/services/block/block.service';
import { EmployeeService } from 'shared/services/employee/employee.service';
import { ProviderService } from 'shared/services/provider/provider.service';
import { UserWorkshopService } from 'shared/services/workshops/user-workshop/user-workshop.service';
import { Util } from 'shared/utils/utils';
import { GetFilteredProviders } from './admin.actions';
import { MarkFormDirty, ShowMessageBar } from './app.actions';
import {
  BlockParent,
  BlockParentFail,
  BlockParentSuccess,
  BlockEmployeeById,
  CreateAchievement,
  CreateProvider,
  CreateEmployee,
  CreateWorkshop,
  DeleteAchievementById,
  DeleteEmployeeById,
  DeleteProviderById,
  DeleteWorkshopById,
  GetAchievementById,
  GetAchievementsByWorkshopId,
  GetBlockedParents,
  GetChildrenByWorkshopId,
  GetFilteredEmployees,
  GetPendingApplicationsByProviderId,
  GetEmployeeById,
  GetEmployeeWorkshops,
  GetProviderViewWorkshops,
  GetWorkshopListByEmployeeId,
  GetWorkshopListByProviderId,
  OnBlockEmployeeFail,
  OnBlockEmployeeSuccess,
  OnClearBlockedParents,
  OnCreateAchievementFail,
  OnCreateAchievementSuccess,
  OnCreateEmployeeFail,
  OnCreateEmployeeSuccess,
  OnCreateProviderFail,
  OnCreateProviderSuccess,
  OnCreateWorkshopFail,
  OnCreateWorkshopSuccess,
  OnDeleteAchievementFail,
  OnDeleteAchievementSuccess,
  OnDeleteEmployeeFail,
  OnDeleteEmployeeSuccess,
  OnDeleteProviderByIdFail,
  OnDeleteProviderByIdSuccess,
  OnDeleteWorkshopFail,
  OnDeleteWorkshopSuccess,
  OnPublishWorkshopFail,
  OnPublishWorkshopSuccess,
  OnUpdateAchievementFail,
  OnUpdateAchievementSuccess,
  OnUpdateEmployeeFail,
  OnUpdateEmployeeSuccess,
  OnUpdateProviderFail,
  OnUpdateProviderStatusFail,
  OnUpdateProviderStatusSuccess,
  OnUpdateProviderSuccess,
  OnUpdateWorkshopFail,
  OnUpdateWorkshopStatusFail,
  OnUpdateWorkshopStatusSuccess,
  OnUpdateWorkshopSuccess,
  PublishWorkshop,
  ReinviteEmployee,
  ResetAchievements,
  UnBlockParent,
  UnBlockParentFail,
  UnBlockParentSuccess,
  UpdateAchievement,
  UpdateProvider,
  UpdateEmployee,
  UpdateProviderLicenseStatus,
  UpdateProviderStatus,
  UpdateWorkshop,
  UpdateWorkshopStatus
} from './provider.actions';
import { CheckAuth, GetProfile } from './registration.actions';

export interface ProviderStateModel {
  isLoading: boolean;
  achievements: SearchResponse<Achievement[]>;
  selectedAchievement: Achievement;
  approvedChildren: SearchResponse<Child[]>;
  providerWorkshops: SearchResponse<WorkshopProviderViewCard[]>;
  employees: SearchResponse<Employee[]>;
  selectedEmployee: Employee;
  blockedParent: BlockedParent;
  truncatedItems: TruncatedItem[];
  pendingApplications: SearchResponse<Application[]>;
}

@State<ProviderStateModel>({
  name: 'provider',
  defaults: {
    isLoading: false,
    approvedChildren: null,
    achievements: null,
    selectedAchievement: null,
    providerWorkshops: null,
    employees: null,
    selectedEmployee: null,
    blockedParent: null,
    truncatedItems: null,
    pendingApplications: null
  }
})
@Injectable()
export class ProviderState {
  constructor(
    private achievementsService: AchievementsService,
    private router: Router,
    private userWorkshopService: UserWorkshopService,
    private employeeService: EmployeeService,
    private providerService: ProviderService,
    private applicationService: ApplicationService,
    private blockService: BlockService
  ) {}

  @Selector()
  static isLoading(state: ProviderStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  static approvedChildren(state: ProviderStateModel): SearchResponse<Child[]> {
    return state.approvedChildren;
  }

  @Selector()
  static achievements(state: ProviderStateModel): SearchResponse<Achievement[]> {
    return state.achievements;
  }

  @Selector()
  static selectedAchievement(state: ProviderStateModel): Achievement {
    return state.selectedAchievement;
  }

  @Selector()
  static providerWorkshops(state: ProviderStateModel): SearchResponse<WorkshopProviderViewCard[]> {
    return state.providerWorkshops;
  }

  @Selector()
  static employees(state: ProviderStateModel): SearchResponse<Employee[]> {
    return state.employees;
  }

  @Selector()
  static blockedParent(state: ProviderStateModel): BlockedParent {
    return state.blockedParent;
  }

  @Selector()
  static truncated(state: ProviderStateModel): TruncatedItem[] {
    return state.truncatedItems;
  }

  @Selector()
  static selectedEmployee(state: ProviderStateModel): Employee {
    return state.selectedEmployee;
  }

  @Selector()
  static pendingApplications(state: ProviderStateModel): SearchResponse<Application[]> {
    return state.pendingApplications;
  }

  @Action(GetAchievementById)
  getAchievementById({ patchState }: StateContext<ProviderStateModel>, { payload }: GetAchievementById): Observable<Achievement> {
    patchState({ isLoading: true });
    return this.achievementsService
      .getAchievementById(payload)
      .pipe(tap((selectedAchievement: Achievement) => patchState({ selectedAchievement, isLoading: false })));
  }

  @Action(GetAchievementsByWorkshopId)
  getAchievementsByWorkshopId(
    { patchState }: StateContext<ProviderStateModel>,
    { payload }: GetAchievementsByWorkshopId
  ): Observable<SearchResponse<Achievement[]>> {
    patchState({ isLoading: true });
    return this.achievementsService
      .getAchievementsByWorkshopId(payload)
      .pipe(
        tap((achievements: SearchResponse<Achievement[]>) => patchState({ achievements: achievements ?? EMPTY_RESULT, isLoading: false }))
      );
  }

  @Action(GetChildrenByWorkshopId)
  getChildrenByWorkshopId(
    { patchState }: StateContext<ProviderStateModel>,
    { payload }: GetChildrenByWorkshopId
  ): Observable<SearchResponse<Child[]>> {
    patchState({ isLoading: true });
    return this.achievementsService
      .getChildrenByWorkshopId(payload)
      .pipe(
        tap((approvedChildren: SearchResponse<Child[]>) =>
          patchState({ approvedChildren: approvedChildren ?? EMPTY_RESULT, isLoading: false })
        )
      );
  }

  @Action(GetWorkshopListByProviderId)
  getWorkshopListByProviderId(
    { patchState }: StateContext<ProviderStateModel>,
    { payload }: GetWorkshopListByProviderId
  ): Observable<TruncatedItem[]> {
    patchState({ isLoading: true });
    return this.userWorkshopService
      .getWorkshopListByProviderId(payload)
      .pipe(tap((truncatedItems: TruncatedItem[]) => patchState({ truncatedItems, isLoading: false })));
  }

  @Action(GetWorkshopListByEmployeeId)
  getWorkshopListByEmployeeId(
    { patchState }: StateContext<ProviderStateModel>,
    { id }: GetWorkshopListByEmployeeId
  ): Observable<TruncatedItem[]> {
    patchState({ isLoading: true });
    return this.userWorkshopService
      .getWorkshopListByEmployeeId(id)
      .pipe(tap((truncatedItems: TruncatedItem[]) => patchState({ truncatedItems, isLoading: false })));
  }

  @Action(CreateAchievement)
  createAchievement({ dispatch }: StateContext<ProviderStateModel>, { payload }: CreateAchievement): Observable<Achievement | void> {
    return this.achievementsService.createAchievement(payload).pipe(
      tap((res: Achievement) => dispatch(new OnCreateAchievementSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new OnCreateAchievementFail(error)))
    );
  }

  @Action(OnCreateAchievementSuccess)
  onCreateAchievementSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnCreateAchievementSuccess): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.createAchievement,
        type: 'success'
      }),
      new MarkFormDirty(false)
    ]);
    this.router.navigate([`/details/workshop/${payload.workshopId}`], {
      queryParams: { status: 'Achievements' }
    });
  }

  @Action(OnCreateAchievementFail)
  onCreateAchievementFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnCreateAchievementFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(UpdateAchievement)
  updateAchievement({ dispatch }: StateContext<ProviderStateModel>, { payload }: UpdateAchievement): Observable<Achievement | void> {
    return this.achievementsService.updateAchievement(payload).pipe(
      tap((res: Achievement) => dispatch(new OnUpdateAchievementSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new OnUpdateAchievementFail(error)))
    );
  }

  @Action(OnUpdateAchievementSuccess)
  onUpdateAchievementSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateAchievementSuccess): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.updateAchievement,
        type: 'success'
      }),
      new MarkFormDirty(false)
    ]);
    this.router.navigate(['/details/workshop/', payload.workshopId]);
  }

  @Action(OnUpdateAchievementFail)
  onUpdateAchievementFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateAchievementFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(DeleteAchievementById)
  deleteAchievementById({ dispatch }: StateContext<ProviderStateModel>, { payload }: DeleteAchievementById): Observable<void> {
    return this.achievementsService.deleteAchievement(payload.id).pipe(
      tap(() => dispatch(new OnDeleteAchievementSuccess(payload))),
      catchError((error: HttpErrorResponse) => dispatch(new OnDeleteAchievementFail(error)))
    );
  }

  @Action(OnDeleteAchievementSuccess)
  onDeleteAchievementSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnDeleteAchievementSuccess): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.deleteAchievement,
        type: 'success'
      })
    ]);
    this.router
      .navigate([`/details/workshop/${payload.workshopId}`], {
        queryParams: { status: 'Achievements' }
      })
      .then(() => {
        window.location.reload();
      });
  }

  @Action(GetEmployeeWorkshops)
  getEmployeeWorkshops(
    { patchState }: StateContext<ProviderStateModel>,
    { parameters }: GetEmployeeWorkshops
  ): Observable<SearchResponse<WorkshopProviderViewCard[]>> {
    patchState({ isLoading: true });
    return this.userWorkshopService
      .getEmployeesWorkshops(parameters)
      .pipe(
        tap((providerWorkshops: SearchResponse<WorkshopProviderViewCard[]>) =>
          patchState({ providerWorkshops: providerWorkshops ?? EMPTY_RESULT, isLoading: false })
        )
      );
  }

  @Action(GetProviderViewWorkshops)
  getProviderWorkshops(
    { patchState }: StateContext<ProviderStateModel>,
    { workshopCardParameters }: GetProviderViewWorkshops
  ): Observable<SearchResponse<WorkshopProviderViewCard[]>> {
    patchState({ isLoading: true });
    return this.userWorkshopService
      .getProviderViewWorkshops(workshopCardParameters)
      .pipe(
        tap((providerWorkshops: SearchResponse<WorkshopProviderViewCard[]>) =>
          patchState({ providerWorkshops: providerWorkshops ?? EMPTY_RESULT, isLoading: false })
        )
      );
  }

  @Action(GetFilteredEmployees)
  getFilteredEmployees(
    { patchState }: StateContext<ProviderStateModel>,
    { payload }: GetFilteredEmployees
  ): Observable<SearchResponse<Employee[]>> {
    patchState({ isLoading: true });
    return this.employeeService
      .getFilteredEmployees(payload)
      .pipe(tap((employees: SearchResponse<Employee[]>) => patchState({ employees: employees ?? EMPTY_RESULT, isLoading: false })));
  }

  @Action(CreateWorkshop)
  createWorkshop({ patchState, dispatch }: StateContext<ProviderStateModel>, { payload }: CreateWorkshop): Observable<Workshop | void> {
    patchState({ isLoading: true });
    return this.userWorkshopService.createWorkshop(payload).pipe(
      tap((res: Workshop) => dispatch(new OnCreateWorkshopSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new OnCreateWorkshopFail(error)))
    );
  }

  @Action(OnCreateWorkshopFail)
  onCreateWorkshopFail({ dispatch, patchState }: StateContext<ProviderStateModel>, { payload }: OnCreateWorkshopFail): void {
    patchState({ isLoading: false });
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnCreateWorkshopSuccess)
  onCreateWorkshopSuccess({ patchState, dispatch }: StateContext<ProviderStateModel>, { payload }: OnCreateWorkshopSuccess): void {
    const messageData = Util.getWorkshopMessage(payload, SnackbarText.createWorkshop);
    patchState({ isLoading: false });
    dispatch([new MarkFormDirty(false), new ShowMessageBar({ message: messageData.message, type: messageData.type })]);
    this.router.navigate(['./personal-cabinet/provider/workshops']);
  }

  @Action(UpdateWorkshop)
  updateWorkshop({ dispatch }: StateContext<ProviderStateModel>, { payload }: UpdateWorkshop): Observable<Workshop | void> {
    return this.userWorkshopService.updateWorkshop(payload).pipe(
      tap((res: Workshop) => dispatch(new OnUpdateWorkshopSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new OnUpdateWorkshopFail(error)))
    );
  }

  @Action(OnUpdateWorkshopSuccess)
  onUpdateWorkshopSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateWorkshopSuccess): void {
    const messageData = Util.getWorkshopMessage(payload, SnackbarText.updateWorkshop);
    dispatch([new MarkFormDirty(false), new ShowMessageBar({ message: messageData.message, type: messageData.type })]);
    this.router.navigate(['/personal-cabinet/provider/workshops']);
  }

  @Action(OnUpdateWorkshopFail)
  onUpdateWorkshopFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateWorkshopFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(DeleteWorkshopById)
  deleteWorkshop({ dispatch }: StateContext<ProviderStateModel>, { payload, parameters }: DeleteWorkshopById): Observable<void> {
    return this.userWorkshopService.deleteWorkshop(payload.workshopId).pipe(
      tap(() => dispatch(new OnDeleteWorkshopSuccess(parameters))),
      catchError((error: HttpErrorResponse) => dispatch(new OnDeleteWorkshopFail(error)))
    );
  }

  @Action(OnDeleteWorkshopFail)
  onDeleteWorkshopFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnDeleteWorkshopFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnDeleteWorkshopSuccess)
  onDeleteWorkshopSuccess({ dispatch }: StateContext<ProviderStateModel>, { parameters }: OnDeleteWorkshopSuccess): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.deleteWorkshop,
        type: 'success'
      }),
      new GetProviderViewWorkshops(parameters)
    ]);
  }

  @Action(PublishWorkshop)
  publishWorkshop({ dispatch }: StateContext<ProviderStateModel>, { payload }: PublishWorkshop): Observable<Provider | void> {
    return this.userWorkshopService.publishWorkshop(payload).pipe(
      tap(() => dispatch(new OnPublishWorkshopSuccess())),
      catchError((error: HttpErrorResponse) => dispatch(new OnPublishWorkshopFail(error)))
    );
  }

  @Action(OnPublishWorkshopFail)
  onPublishWorkshopFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnPublishWorkshopFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnPublishWorkshopSuccess)
  onPublishWorkshopSuccess({ dispatch }: StateContext<ProviderStateModel>): void {
    this.router.navigate(['/personal-cabinet/provider/workshops']);
    dispatch(new ShowMessageBar({ message: SnackbarText.publishWorkshop, type: 'success' }));
  }

  @Action(CreateProvider)
  createProvider(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, isImagesFeature }: CreateProvider
  ): Observable<Provider | void> {
    return this.providerService.createProvider(payload, isImagesFeature).pipe(
      tap((res: Provider) => dispatch(new OnCreateProviderSuccess(res))),
      catchError((error) => dispatch(new OnCreateProviderFail(error)))
    );
  }

  @Action(OnCreateProviderFail)
  onCreateProviderFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnCreateProviderFail): void {
    const message =
      payload.error === Constants.UNABLE_CREATE_PROVIDER || Constants.UNABLE_CREATE_PROVIDER + Constants.THERE_IS_SUCH_DATA
        ? SnackbarText.notUniqueData
        : SnackbarText.error;
    dispatch(new ShowMessageBar({ message, type: 'error' }));
  }

  @Action(OnCreateProviderSuccess)
  onCreateProviderSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnCreateProviderSuccess): void {
    dispatch(new CheckAuth()).subscribe(() => this.router.navigate(['/personal-cabinet/provider/info']));
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.createProvider,
        type: 'success'
      }),
      new MarkFormDirty(false)
    ]);
  }

  @Action(UpdateProvider)
  updateProvider(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, isImagesFeature }: UpdateProvider
  ): Observable<Provider | void> {
    return this.providerService.updateProvider(payload, isImagesFeature).pipe(
      tap(() => dispatch(new OnUpdateProviderSuccess())),
      catchError((error: HttpErrorResponse) => dispatch(new OnUpdateProviderFail(error)))
    );
  }

  @Action(OnUpdateProviderFail)
  onUpdateProviderfail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateProviderFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnUpdateProviderSuccess)
  onUpdateProviderSuccess({ dispatch }: StateContext<ProviderStateModel>, {}: OnUpdateProviderSuccess): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.updateProvider,
        type: 'success'
      }),
      new MarkFormDirty(false)
    ]);
    dispatch(new GetProfile()).subscribe(() => this.router.navigate(['/personal-cabinet/provider/info']));
  }

  @Action(UpdateProviderStatus)
  updateProviderStatus(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, providerParameters }: UpdateProviderStatus
  ): Observable<ProviderWithStatus | void> {
    return this.providerService.updateProviderStatus(payload).pipe(
      tap(() => dispatch(new OnUpdateProviderStatusSuccess(payload, providerParameters))),
      catchError((error: HttpErrorResponse) => dispatch(new OnUpdateProviderStatusFail(error)))
    );
  }

  @Action(UpdateProviderLicenseStatus)
  updateProviderLicenseStatus(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, providerParameters }: UpdateProviderLicenseStatus
  ): Observable<ProviderWithLicenseStatus | void> {
    return this.providerService.updateProviderLicenseStatus(payload).pipe(
      tap(() =>
        dispatch([
          new ShowMessageBar({
            message: SnackbarText.licenseApproved,
            type: 'success'
          }),
          new MarkFormDirty(false),
          new GetFilteredProviders(providerParameters)
        ])
      ),
      catchError(() => dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' })))
    );
  }

  @Action(OnUpdateProviderStatusFail)
  onUpdateProviderStatusFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateProviderStatusFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnUpdateProviderStatusSuccess)
  onUpdateProviderStatusSuccess(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, providerParameters }: OnUpdateProviderStatusSuccess
  ): void {
    dispatch([
      new ShowMessageBar({
        message: payload.status === ProviderStatuses.Editing ? SnackbarText.statusEditing : SnackbarText.changeProviderStatus,
        type: 'success'
      }),
      new MarkFormDirty(false),
      new GetFilteredProviders(providerParameters)
    ]);
  }

  @Action(CreateEmployee)
  createEmployee({ dispatch }: StateContext<ProviderStateModel>, { payload }: CreateEmployee): Observable<Employee | void> {
    return this.employeeService.createEmployee(payload).pipe(
      tap((res: Employee) => dispatch(new OnCreateEmployeeSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new OnCreateEmployeeFail(error)))
    );
  }

  @Action(OnCreateEmployeeFail)
  onCreateEmployeeFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnCreateEmployeeFail): void {
    throwError(() => payload);
  }

  @Action(OnCreateEmployeeSuccess)
  onCreateEmployeeSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnCreateEmployeeSuccess): void {
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({
        message: SnackbarText.createEmployeeSuccess,
        type: 'success'
      })
    ]);
    this.router.navigate(['/personal-cabinet/provider/administration']);
  }

  @Action(BlockEmployeeById)
  blockEmployee({ dispatch }: StateContext<ProviderStateModel>, { payload, filterParams }: BlockEmployeeById): Observable<void> {
    return this.employeeService.blockEmployee(payload).pipe(
      tap(() => dispatch(new OnBlockEmployeeSuccess(payload, filterParams))),
      catchError((error: HttpErrorResponse) => dispatch(new OnBlockEmployeeFail(error)))
    );
  }

  @Action(OnBlockEmployeeFail)
  onBlockEmployeeFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnBlockEmployeeFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnBlockEmployeeSuccess)
  onBlockEmployeeSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload, filterParams }: OnBlockEmployeeSuccess): void {
    dispatch([
      new GetFilteredEmployees(filterParams),
      new ShowMessageBar({
        message: payload.isBlocked ? SnackbarText.blockPerson : SnackbarText.unblockPerson,
        type: 'success'
      })
    ]);
  }

  @Action(DeleteEmployeeById)
  deleteEmployee({ dispatch }: StateContext<ProviderStateModel>, { payload, filterParams }: DeleteEmployeeById): Observable<void> {
    return this.employeeService.deleteEmployee(payload.userId, payload.providerId).pipe(
      tap(() => dispatch(new OnDeleteEmployeeSuccess(filterParams))),
      catchError((error: HttpErrorResponse) => dispatch(new OnDeleteEmployeeFail(error)))
    );
  }

  @Action(OnDeleteEmployeeFail)
  onDeleteEmployeeFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnDeleteEmployeeFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnDeleteEmployeeSuccess)
  onDeleteEmployeeSuccess({ dispatch }: StateContext<ProviderStateModel>, { filterParams }: OnDeleteEmployeeSuccess): void {
    dispatch([
      new GetFilteredEmployees(filterParams),
      new ShowMessageBar({
        message: SnackbarText.deleteEmployee,
        type: 'success'
      })
    ]);
  }

  @Action(UpdateEmployee)
  updateEmployee({ dispatch }: StateContext<ProviderStateModel>, { providerId, employee }: UpdateEmployee): Observable<Employee | void> {
    return this.employeeService.updateEmployee(providerId, employee).pipe(
      tap(() => dispatch(new OnUpdateEmployeeSuccess(employee))),
      catchError((error: HttpErrorResponse) => dispatch(new OnUpdateEmployeeFail(error)))
    );
  }

  @Action(OnUpdateEmployeeFail)
  onUpdateEmployeeFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateEmployeeFail): void {
    dispatch(
      new ShowMessageBar({
        message: SnackbarText.error,
        type: 'error'
      })
    );
  }

  @Action(OnUpdateEmployeeSuccess)
  onUpdateEmployeeSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateEmployeeSuccess): void {
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({
        message: SnackbarText.updateEmployee,
        type: 'success'
      })
    ]);
    this.router.navigate(['/personal-cabinet/provider/administration']);
  }

  @Action(UpdateWorkshopStatus)
  updateStatus(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, providerId }: UpdateWorkshopStatus
  ): Observable<WorkshopStatus | void> {
    return this.userWorkshopService.updateWorkshopStatus(payload).pipe(
      tap(() => dispatch(new OnUpdateWorkshopStatusSuccess(providerId))),
      catchError((error: HttpErrorResponse) => dispatch(new OnUpdateWorkshopStatusFail(error)))
    );
  }

  @Action(OnUpdateWorkshopStatusFail)
  onUpdateStatusFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateWorkshopStatusFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnUpdateWorkshopStatusSuccess)
  onUpdateStatusSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateWorkshopStatusSuccess): void {}

  @Action(BlockParent)
  blockParent({ dispatch }: StateContext<ProviderStateModel>, { payload }: BlockParent): Observable<BlockedParent | void> {
    return this.blockService.blockParent(payload).pipe(
      tap((res: BlockedParent) => dispatch(new BlockParentSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new BlockParentFail(error)))
    );
  }

  @Action(BlockParentFail)
  blockParentFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: BlockParentFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(BlockParentSuccess)
  blockParentSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: BlockParentSuccess): void {
    dispatch([new MarkFormDirty(false), new ShowMessageBar({ message: SnackbarText.blockPerson, type: 'success' })]);
  }

  @Action(UnBlockParent)
  unBlockParent({ dispatch }: StateContext<ProviderStateModel>, { payload }: UnBlockParent): Observable<BlockedParent | void> {
    return this.blockService.unBlockParent(payload).pipe(
      tap((res: BlockedParent) => dispatch(new UnBlockParentSuccess(res))),
      catchError((error: Error) => dispatch(new UnBlockParentFail(error)))
    );
  }

  @Action(UnBlockParentFail)
  unBlockParentFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: UnBlockParentFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(UnBlockParentSuccess)
  unBlockParentSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: UnBlockParentSuccess): void {
    dispatch([new MarkFormDirty(false), new ShowMessageBar({ message: SnackbarText.unblockPerson, type: 'success' })]);
  }

  @Action(GetBlockedParents)
  getBlockedParents(
    { patchState }: StateContext<ProviderStateModel>,
    { providerId, parentId }: GetBlockedParents
  ): Observable<BlockedParent> {
    return this.blockService
      .getBlockedParents(providerId, parentId)
      .pipe(tap((blockedParent: BlockedParent) => patchState({ blockedParent })));
  }

  @Action(OnClearBlockedParents)
  onClearBlockedParents({ patchState }: StateContext<ProviderStateModel>, {}: OnClearBlockedParents): void {
    patchState({ blockedParent: null });
  }

  @Action(ResetAchievements)
  resetAchievement({ patchState }: StateContext<ProviderStateModel>, {}: ResetAchievements): void {
    patchState({ selectedAchievement: null, achievements: null });
  }

  @Action(DeleteProviderById)
  deleteProviderById(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, providerParameters }: DeleteProviderById
  ): Observable<void> {
    return this.providerService.deleteProviderById(payload).pipe(
      tap(() => dispatch(new OnDeleteProviderByIdSuccess(payload, providerParameters))),
      catchError((error: HttpErrorResponse) => dispatch(new OnDeleteProviderByIdFail(error)))
    );
  }

  @Action(OnDeleteProviderByIdFail)
  onDeleteProviderByIdFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnDeleteProviderByIdFail): void {
    dispatch(
      new ShowMessageBar({
        message: SnackbarText.error,
        type: 'error'
      })
    );
  }

  @Action(OnDeleteProviderByIdSuccess)
  onDeleteProviderByIdSuccess(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, providerParameters }: OnDeleteProviderByIdSuccess
  ): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.deleteProvider,
        type: 'success'
      }),
      new GetFilteredProviders(providerParameters)
    ]);
  }

  @Action(GetEmployeeById)
  getEmployeeById({ patchState }: StateContext<ProviderStateModel>, { payload }: GetEmployeeById): Observable<Employee> {
    patchState({ isLoading: true });
    return this.employeeService
      .getEmployeeById(payload)
      .pipe(tap((selectedEmployee: Employee) => patchState({ selectedEmployee, isLoading: false })));
  }

  @Action(ReinviteEmployee)
  reinviteEmployee({ dispatch }: StateContext<ProviderStateModel>, { employee }: ReinviteEmployee): Observable<void> {
    return this.employeeService.reinvateEmployee(employee).pipe(
      tap(() =>
        dispatch(
          new ShowMessageBar({
            message: SnackbarText.sendInvitation,
            type: 'success'
          })
        )
      )
    );
  }

  @Action(GetPendingApplicationsByProviderId)
  getPendingApplications(
    { patchState }: StateContext<ProviderStateModel>,
    { id }: GetPendingApplicationsByProviderId
  ): Observable<SearchResponse<Application[]>> {
    return this.applicationService
      .getPendingApplicationsByProviderId(id)
      .pipe(tap((pendingApplications: SearchResponse<Application[]>) => patchState({ pendingApplications })));
  }
}
