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
import { OfficialEmployee } from 'shared/models/official-employee.model';
import { Provider, ProviderWithLicenseStatus, ProviderWithStatus } from 'shared/models/provider.model';
import { SearchResponse } from 'shared/models/search.model';
import { Workshop, WorkshopProviderViewCard, WorkshopStatus } from 'shared/models/workshop.model';
import { AchievementsService } from 'shared/services/achievements/achievements.service';
import { ApplicationService } from 'shared/services/applications/application.service';
import { BlockService } from 'shared/services/block/block.service';
import { EmployeeService } from 'shared/services/employee/employee.service';
import { ProviderService } from 'shared/services/provider/provider.service';
import { UserWorkshopService } from 'shared/services/workshops/user-workshop/user-workshop.service';
import { PositionService } from 'shared/services/position/position.service';
import { Util } from 'shared/utils/utils';
import { Position } from 'shared/models/position.model';
import { GetFilteredProviders } from './admin.actions';
import { MarkFormDirty, ShowMessageBar } from './app.actions';
import * as providerActions from './provider.actions';
import { CheckAuth, GetProfile } from './registration.actions';

export interface ProviderStateModel {
  isLoading: boolean;
  achievements: SearchResponse<Achievement[]>;
  selectedAchievement: Achievement;
  approvedChildren: SearchResponse<Child[]>;
  providerWorkshops: SearchResponse<WorkshopProviderViewCard[]>;
  officialEmployees: SearchResponse<OfficialEmployee[]>;
  selectedEmployee: Employee;
  blockedParent: BlockedParent;
  truncatedItems: TruncatedItem[];
  pendingApplications: SearchResponse<Application[]>;
  positions: SearchResponse<Position[]>;
  selectedPosition: Position;
}

@State<ProviderStateModel>({
  name: 'provider',
  defaults: {
    isLoading: false,
    approvedChildren: null,
    achievements: null,
    selectedAchievement: null,
    providerWorkshops: null,
    officialEmployees: null,
    selectedEmployee: null,
    blockedParent: null,
    truncatedItems: null,
    pendingApplications: null,
    positions: null,
    selectedPosition: null
  }
})
@Injectable()
export class ProviderState {
  constructor(
    private readonly achievementsService: AchievementsService,
    private readonly router: Router,
    private readonly userWorkshopService: UserWorkshopService,
    private readonly employeeService: EmployeeService,
    private readonly providerService: ProviderService,
    private readonly applicationService: ApplicationService,
    private readonly blockService: BlockService,
    private readonly positionService: PositionService
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
  static officialEmployees(state: ProviderStateModel): SearchResponse<OfficialEmployee[]> {
    return state.officialEmployees;
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

  @Selector()
  static positions(state: ProviderStateModel): SearchResponse<Position[]> {
    return state.positions;
  }

  @Selector()
  static selectedPosition(state: ProviderStateModel): Position {
    return state.selectedPosition;
  }

  @Action(providerActions.GetAchievementById)
  getAchievementById(
    { patchState }: StateContext<ProviderStateModel>,
    { payload }: providerActions.GetAchievementById
  ): Observable<Achievement> {
    patchState({ isLoading: true });
    return this.achievementsService
      .getAchievementById(payload)
      .pipe(tap((selectedAchievement: Achievement) => patchState({ selectedAchievement, isLoading: false })));
  }

  @Action(providerActions.GetAchievementsByWorkshopId)
  getAchievementsByWorkshopId(
    { patchState }: StateContext<ProviderStateModel>,
    { payload }: providerActions.GetAchievementsByWorkshopId
  ): Observable<SearchResponse<Achievement[]>> {
    patchState({ isLoading: true });
    return this.achievementsService
      .getAchievementsByWorkshopId(payload)
      .pipe(
        tap((achievements: SearchResponse<Achievement[]>) => patchState({ achievements: achievements ?? EMPTY_RESULT, isLoading: false }))
      );
  }

  @Action(providerActions.GetChildrenByWorkshopId)
  getChildrenByWorkshopId(
    { patchState }: StateContext<ProviderStateModel>,
    { payload }: providerActions.GetChildrenByWorkshopId
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

  @Action(providerActions.GetWorkshopListByProviderId)
  getWorkshopListByProviderId(
    { patchState }: StateContext<ProviderStateModel>,
    { payload }: providerActions.GetWorkshopListByProviderId
  ): Observable<TruncatedItem[]> {
    patchState({ isLoading: true });
    return this.userWorkshopService
      .getWorkshopListByProviderId(payload)
      .pipe(tap((truncatedItems: TruncatedItem[]) => patchState({ truncatedItems, isLoading: false })));
  }

  @Action(providerActions.GetWorkshopListByEmployeeId)
  getWorkshopListByEmployeeId(
    { patchState }: StateContext<ProviderStateModel>,
    { id }: providerActions.GetWorkshopListByEmployeeId
  ): Observable<TruncatedItem[]> {
    patchState({ isLoading: true });
    return this.userWorkshopService
      .getWorkshopListByEmployeeId(id)
      .pipe(tap((truncatedItems: TruncatedItem[]) => patchState({ truncatedItems, isLoading: false })));
  }

  @Action(providerActions.CreateAchievement)
  createAchievement(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: providerActions.CreateAchievement
  ): Observable<Achievement | void> {
    return this.achievementsService.createAchievement(payload).pipe(
      tap((res: Achievement) => dispatch(new providerActions.OnCreateAchievementSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnCreateAchievementFail(error)))
    );
  }

  @Action(providerActions.OnCreateAchievementSuccess)
  onCreateAchievementSuccess(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: providerActions.OnCreateAchievementSuccess
  ): void {
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

  @Action(providerActions.OnCreateAchievementFail)
  onCreateAchievementFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnCreateAchievementFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(providerActions.UpdateAchievement)
  updateAchievement(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: providerActions.UpdateAchievement
  ): Observable<Achievement | void> {
    return this.achievementsService.updateAchievement(payload).pipe(
      tap((res: Achievement) => dispatch(new providerActions.OnUpdateAchievementSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnUpdateAchievementFail(error)))
    );
  }

  @Action(providerActions.OnUpdateAchievementSuccess)
  onUpdateAchievementSuccess(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: providerActions.OnUpdateAchievementSuccess
  ): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.updateAchievement,
        type: 'success'
      }),
      new MarkFormDirty(false)
    ]);
    this.router.navigate(['/details/workshop/', payload.workshopId]);
  }

  @Action(providerActions.OnUpdateAchievementFail)
  onUpdateAchievementFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnUpdateAchievementFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(providerActions.DeleteAchievementById)
  deleteAchievementById(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: providerActions.DeleteAchievementById
  ): Observable<void> {
    return this.achievementsService.deleteAchievement(payload.id).pipe(
      tap(() => dispatch(new providerActions.OnDeleteAchievementSuccess(payload))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnDeleteAchievementFail(error)))
    );
  }

  @Action(providerActions.OnDeleteAchievementSuccess)
  onDeleteAchievementSuccess(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: providerActions.OnDeleteAchievementSuccess
  ): void {
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

  @Action(providerActions.GetEmployeeWorkshops)
  getEmployeeWorkshops(
    { patchState }: StateContext<ProviderStateModel>,
    { parameters }: providerActions.GetEmployeeWorkshops
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

  @Action(providerActions.GetProviderViewWorkshops)
  getProviderWorkshops(
    { patchState }: StateContext<ProviderStateModel>,
    { workshopCardParameters }: providerActions.GetProviderViewWorkshops
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

  @Action(providerActions.GetFilteredOfficialEmployees)
  getFilteredOfficialEmployees(
    { patchState }: StateContext<ProviderStateModel>,
    { payload }: providerActions.GetFilteredOfficialEmployees
  ): Observable<SearchResponse<OfficialEmployee[]>> {
    patchState({ isLoading: true });
    return this.employeeService
      .getFilteredOfficialEmployees(payload)
      .pipe(
        tap((officials: SearchResponse<OfficialEmployee[]>) =>
          patchState({ officialEmployees: officials ?? EMPTY_RESULT, isLoading: false })
        )
      );
  }

  @Action(providerActions.CreateWorkshop)
  createWorkshop(
    { patchState, dispatch }: StateContext<ProviderStateModel>,
    { payload }: providerActions.CreateWorkshop
  ): Observable<Workshop | void> {
    patchState({ isLoading: true });
    return this.userWorkshopService.createWorkshop(payload).pipe(
      tap((res: Workshop) => dispatch(new providerActions.OnCreateWorkshopSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnCreateWorkshopFail(error)))
    );
  }

  @Action(providerActions.OnCreateWorkshopFail)
  onCreateWorkshopFail(
    { dispatch, patchState }: StateContext<ProviderStateModel>,
    { payload }: providerActions.OnCreateWorkshopFail
  ): void {
    patchState({ isLoading: false });
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(providerActions.OnCreateWorkshopSuccess)
  onCreateWorkshopSuccess(
    { patchState, dispatch }: StateContext<ProviderStateModel>,
    { payload }: providerActions.OnCreateWorkshopSuccess
  ): void {
    const messageData = Util.getWorkshopMessage(payload, SnackbarText.createWorkshop);
    patchState({ isLoading: false });
    dispatch([new MarkFormDirty(false), new ShowMessageBar({ message: messageData.message, type: messageData.type })]);
    this.router.navigate(['./personal-cabinet/provider/workshops']);
  }

  @Action(providerActions.UpdateWorkshop)
  updateWorkshop({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.UpdateWorkshop): Observable<Workshop | void> {
    return this.userWorkshopService.updateWorkshop(payload).pipe(
      tap((res: Workshop) => dispatch(new providerActions.OnUpdateWorkshopSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnUpdateWorkshopFail(error)))
    );
  }

  @Action(providerActions.OnUpdateWorkshopSuccess)
  onUpdateWorkshopSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnUpdateWorkshopSuccess): void {
    const messageData = Util.getWorkshopMessage(payload, SnackbarText.updateWorkshop);
    dispatch([new MarkFormDirty(false), new ShowMessageBar({ message: messageData.message, type: messageData.type })]);
    this.router.navigate(['/personal-cabinet/provider/workshops']);
  }

  @Action(providerActions.OnUpdateWorkshopFail)
  onUpdateWorkshopFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnUpdateWorkshopFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(providerActions.DeleteWorkshopById)
  deleteWorkshop(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, parameters }: providerActions.DeleteWorkshopById
  ): Observable<void> {
    return this.userWorkshopService.deleteWorkshop(payload.id).pipe(
      tap(() => dispatch(new providerActions.OnDeleteWorkshopSuccess(parameters))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnDeleteWorkshopFail(error)))
    );
  }

  @Action(providerActions.OnDeleteWorkshopFail)
  onDeleteWorkshopFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnDeleteWorkshopFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(providerActions.OnDeleteWorkshopSuccess)
  onDeleteWorkshopSuccess({ dispatch }: StateContext<ProviderStateModel>, { parameters }: providerActions.OnDeleteWorkshopSuccess): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.deleteWorkshop,
        type: 'success'
      }),
      new providerActions.GetProviderViewWorkshops(parameters)
    ]);
  }

  @Action(providerActions.PublishWorkshop)
  publishWorkshop(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: providerActions.PublishWorkshop
  ): Observable<Provider | void> {
    return this.userWorkshopService.publishWorkshop(payload).pipe(
      tap(() => dispatch(new providerActions.OnPublishWorkshopSuccess())),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnPublishWorkshopFail(error)))
    );
  }

  @Action(providerActions.OnPublishWorkshopFail)
  onPublishWorkshopFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnPublishWorkshopFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(providerActions.OnPublishWorkshopSuccess)
  onPublishWorkshopSuccess({ dispatch }: StateContext<ProviderStateModel>): void {
    this.router.navigate(['/personal-cabinet/provider/workshops']);
    dispatch(new ShowMessageBar({ message: SnackbarText.publishWorkshop, type: 'success' }));
  }

  @Action(providerActions.CreateProvider)
  createProvider(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, isImagesFeature }: providerActions.CreateProvider
  ): Observable<Provider | void> {
    return this.providerService.createProvider(payload, isImagesFeature).pipe(
      tap((res: Provider) => dispatch(new providerActions.OnCreateProviderSuccess(res))),
      catchError((error) => dispatch(new providerActions.OnCreateProviderFail(error)))
    );
  }

  @Action(providerActions.OnCreateProviderFail)
  onCreateProviderFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnCreateProviderFail): void {
    const message =
      payload.error === Constants.UNABLE_CREATE_PROVIDER || Constants.UNABLE_CREATE_PROVIDER + Constants.THERE_IS_SUCH_DATA
        ? SnackbarText.notUniqueData
        : SnackbarText.error;
    dispatch(new ShowMessageBar({ message, type: 'error' }));
  }

  @Action(providerActions.OnCreateProviderSuccess)
  onCreateProviderSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnCreateProviderSuccess): void {
    dispatch(new CheckAuth()).subscribe(() => this.router.navigate(['/personal-cabinet/provider/info']));
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.createProvider,
        type: 'success'
      }),
      new MarkFormDirty(false)
    ]);
  }

  @Action(providerActions.UpdateProvider)
  updateProvider(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, isImagesFeature }: providerActions.UpdateProvider
  ): Observable<Provider | void> {
    return this.providerService.updateProvider(payload, isImagesFeature).pipe(
      tap(() => dispatch(new providerActions.OnUpdateProviderSuccess())),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnUpdateProviderFail(error)))
    );
  }

  @Action(providerActions.OnUpdateProviderFail)
  onUpdateProviderfail({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnUpdateProviderFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(providerActions.OnUpdateProviderSuccess)
  onUpdateProviderSuccess({ dispatch }: StateContext<ProviderStateModel>): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.updateProvider,
        type: 'success'
      }),
      new MarkFormDirty(false)
    ]);
    dispatch(new GetProfile()).subscribe(() => this.router.navigate(['/personal-cabinet/provider/info']));
  }

  @Action(providerActions.UpdateProviderStatus)
  updateProviderStatus(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, providerParameters }: providerActions.UpdateProviderStatus
  ): Observable<ProviderWithStatus | void> {
    return this.providerService.updateProviderStatus(payload).pipe(
      tap(() => dispatch(new providerActions.OnUpdateProviderStatusSuccess(payload, providerParameters))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnUpdateProviderStatusFail(error)))
    );
  }

  @Action(providerActions.UpdateProviderLicenseStatus)
  updateProviderLicenseStatus(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, providerParameters }: providerActions.UpdateProviderLicenseStatus
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

  @Action(providerActions.OnUpdateProviderStatusFail)
  onUpdateProviderStatusFail(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: providerActions.OnUpdateProviderStatusFail
  ): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(providerActions.OnUpdateProviderStatusSuccess)
  onUpdateProviderStatusSuccess(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, providerParameters }: providerActions.OnUpdateProviderStatusSuccess
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

  @Action(providerActions.CreateEmployee)
  createEmployee({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.CreateEmployee): Observable<Employee | void> {
    return this.employeeService.createEmployee(payload).pipe(
      tap((res: Employee) => dispatch(new providerActions.OnCreateEmployeeSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnCreateEmployeeFail(error)))
    );
  }

  @Action(providerActions.OnCreateEmployeeFail)
  onCreateEmployeeFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnCreateEmployeeFail): void {
    throwError(() => payload);
  }

  @Action(providerActions.OnCreateEmployeeSuccess)
  onCreateEmployeeSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnCreateEmployeeSuccess): void {
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({
        message: SnackbarText.createEmployeeSuccess,
        type: 'success'
      })
    ]);
    this.router.navigate(['/personal-cabinet/provider/administration']);
  }

  @Action(providerActions.BlockEmployeeById)
  blockEmployee(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, filterParams }: providerActions.BlockEmployeeById
  ): Observable<void> {
    return this.employeeService.blockEmployee(payload).pipe(
      tap(() => dispatch(new providerActions.OnBlockEmployeeSuccess(payload, filterParams))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnBlockEmployeeFail(error)))
    );
  }

  @Action(providerActions.OnBlockEmployeeFail)
  onBlockEmployeeFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnBlockEmployeeFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(providerActions.OnBlockEmployeeSuccess)
  onBlockEmployeeSuccess(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, filterParams }: providerActions.OnBlockEmployeeSuccess
  ): void {
    dispatch([
      new providerActions.GetFilteredOfficialEmployees(filterParams),
      new ShowMessageBar({
        message: payload.isBlocked ? SnackbarText.blockPerson : SnackbarText.unblockPerson,
        type: 'success'
      })
    ]);
  }

  @Action(providerActions.DeleteEmployeeById)
  deleteEmployee(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, filterParams }: providerActions.DeleteEmployeeById
  ): Observable<void> {
    return this.employeeService.deleteEmployee(payload.userId, payload.providerId).pipe(
      tap(() => dispatch(new providerActions.OnDeleteEmployeeSuccess(filterParams))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnDeleteEmployeeFail(error)))
    );
  }

  @Action(providerActions.OnDeleteEmployeeFail)
  onDeleteEmployeeFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnDeleteEmployeeFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(providerActions.OnDeleteEmployeeSuccess)
  onDeleteEmployeeSuccess({ dispatch }: StateContext<ProviderStateModel>, { filterParams }: providerActions.OnDeleteEmployeeSuccess): void {
    dispatch([
      new providerActions.GetFilteredOfficialEmployees(filterParams),
      new ShowMessageBar({
        message: SnackbarText.deleteEmployee,
        type: 'success'
      })
    ]);
  }

  @Action(providerActions.UpdateEmployee)
  updateEmployee(
    { dispatch }: StateContext<ProviderStateModel>,
    { providerId, employee }: providerActions.UpdateEmployee
  ): Observable<Employee | void> {
    return this.employeeService.updateEmployee(providerId, employee).pipe(
      tap(() => dispatch(new providerActions.OnUpdateEmployeeSuccess(employee))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnUpdateEmployeeFail(error)))
    );
  }

  @Action(providerActions.OnUpdateEmployeeFail)
  onUpdateEmployeeFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnUpdateEmployeeFail): void {
    dispatch(
      new ShowMessageBar({
        message: SnackbarText.error,
        type: 'error'
      })
    );
  }

  @Action(providerActions.OnUpdateEmployeeSuccess)
  onUpdateEmployeeSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnUpdateEmployeeSuccess): void {
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({
        message: SnackbarText.updateEmployee,
        type: 'success'
      })
    ]);
    this.router.navigate(['/personal-cabinet/provider/administration']);
  }

  @Action(providerActions.UpdateWorkshopStatus)
  updateStatus(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, providerId }: providerActions.UpdateWorkshopStatus
  ): Observable<WorkshopStatus | void> {
    return this.userWorkshopService.updateWorkshopStatus(payload).pipe(
      tap(() => dispatch(new providerActions.OnUpdateWorkshopStatusSuccess(providerId))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnUpdateWorkshopStatusFail(error)))
    );
  }

  @Action(providerActions.OnUpdateWorkshopStatusFail)
  onUpdateStatusFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnUpdateWorkshopStatusFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(providerActions.OnUpdateWorkshopStatusSuccess)
  onUpdateStatusSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnUpdateWorkshopStatusSuccess): void {}

  @Action(providerActions.BlockParent)
  blockParent({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.BlockParent): Observable<BlockedParent | void> {
    return this.blockService.blockParent(payload).pipe(
      tap((res: BlockedParent) => dispatch(new providerActions.BlockParentSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.BlockParentFail(error)))
    );
  }

  @Action(providerActions.BlockParentFail)
  blockParentFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.BlockParentFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(providerActions.BlockParentSuccess)
  blockParentSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.BlockParentSuccess): void {
    dispatch([new MarkFormDirty(false), new ShowMessageBar({ message: SnackbarText.blockPerson, type: 'success' })]);
  }

  @Action(providerActions.UnBlockParent)
  unBlockParent(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: providerActions.UnBlockParent
  ): Observable<BlockedParent | void> {
    return this.blockService.unBlockParent(payload).pipe(
      tap((res: BlockedParent) => dispatch(new providerActions.UnBlockParentSuccess(res))),
      catchError((error: Error) => dispatch(new providerActions.UnBlockParentFail(error)))
    );
  }

  @Action(providerActions.UnBlockParentFail)
  unBlockParentFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.UnBlockParentFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(providerActions.UnBlockParentSuccess)
  unBlockParentSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.UnBlockParentSuccess): void {
    dispatch([new MarkFormDirty(false), new ShowMessageBar({ message: SnackbarText.unblockPerson, type: 'success' })]);
  }

  @Action(providerActions.GetBlockedParents)
  getBlockedParents(
    { patchState }: StateContext<ProviderStateModel>,
    { providerId, parentId }: providerActions.GetBlockedParents
  ): Observable<BlockedParent> {
    return this.blockService
      .getBlockedParents(providerId, parentId)
      .pipe(tap((blockedParent: BlockedParent) => patchState({ blockedParent })));
  }

  @Action(providerActions.OnClearBlockedParents)
  onClearBlockedParents({ patchState }: StateContext<ProviderStateModel>): void {
    patchState({ blockedParent: null });
  }

  @Action(providerActions.ResetAchievements)
  resetAchievement({ patchState }: StateContext<ProviderStateModel>): void {
    patchState({ selectedAchievement: null, achievements: null });
  }

  @Action(providerActions.DeleteProviderById)
  deleteProviderById(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, providerParameters }: providerActions.DeleteProviderById
  ): Observable<void> {
    return this.providerService.deleteProviderById(payload).pipe(
      tap(() => dispatch(new providerActions.OnDeleteProviderByIdSuccess(payload, providerParameters))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnDeleteProviderByIdFail(error)))
    );
  }

  @Action(providerActions.OnDeleteProviderByIdFail)
  onDeleteProviderByIdFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnDeleteProviderByIdFail): void {
    dispatch(
      new ShowMessageBar({
        message: SnackbarText.error,
        type: 'error'
      })
    );
  }

  @Action(providerActions.OnDeleteProviderByIdSuccess)
  onDeleteProviderByIdSuccess(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, providerParameters }: providerActions.OnDeleteProviderByIdSuccess
  ): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.deleteProvider,
        type: 'success'
      }),
      new GetFilteredProviders(providerParameters)
    ]);
  }

  @Action(providerActions.GetEmployeeById)
  getEmployeeById({ patchState }: StateContext<ProviderStateModel>, { payload }: providerActions.GetEmployeeById): Observable<Employee> {
    patchState({ isLoading: true });
    return this.employeeService
      .getEmployeeById(payload)
      .pipe(tap((selectedEmployee: Employee) => patchState({ selectedEmployee, isLoading: false })));
  }

  @Action(providerActions.ReinviteEmployee)
  reinviteEmployee({ dispatch }: StateContext<ProviderStateModel>, { employee }: providerActions.ReinviteEmployee): Observable<void> {
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

  @Action(providerActions.GetPendingApplicationsByProviderId)
  getPendingApplications(
    { patchState }: StateContext<ProviderStateModel>,
    { id }: providerActions.GetPendingApplicationsByProviderId
  ): Observable<SearchResponse<Application[]>> {
    return this.applicationService
      .getPendingApplicationsByProviderId(id)
      .pipe(tap((pendingApplications: SearchResponse<Application[]>) => patchState({ pendingApplications })));
  }

  @Action(providerActions.GetPositions)
  getPositions(
    { patchState, dispatch }: StateContext<ProviderStateModel>,
    { positionParameters }: providerActions.GetPositions
  ): Observable<SearchResponse<Position[]> | void> {
    patchState({ isLoading: true });
    return this.positionService.getPositions(positionParameters).pipe(
      tap((positions: SearchResponse<Position[]>) => patchState({ positions: positions, isLoading: false })),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnGetPositionsFail(error)))
    );
  }

  @Action(providerActions.OnGetPositionsFail)
  onGetPositionsFail({ patchState, dispatch }: StateContext<ProviderStateModel>, { error }: providerActions.OnGetPositionsFail): void {
    const notFoundStatus = 200;
    patchState({ isLoading: false });

    if (error.status === notFoundStatus) {
      patchState({ positions: { totalAmount: 0, entities: [] } });
      dispatch(new ShowMessageBar({ message: SnackbarText.positionByTitleNotFound, type: 'error' }));
    } else {
      dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
    }
  }

  @Action(providerActions.CreatePosition)
  createPosition(
    { patchState, dispatch }: StateContext<ProviderStateModel>,
    { position }: providerActions.CreatePosition
  ): Observable<Position | void> {
    patchState({ isLoading: true });
    return this.positionService.createPosition(position).pipe(
      tap((res: Position) => dispatch(new providerActions.OnCreatePositionSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnCreatePositionFail(error)))
    );
  }

  @Action(providerActions.OnCreatePositionSuccess)
  onCreatePositionSuccess(
    { patchState, dispatch }: StateContext<ProviderStateModel>,
    { position }: providerActions.OnCreatePositionSuccess
  ): void {
    patchState({ isLoading: false });
    dispatch([new MarkFormDirty(false), new ShowMessageBar({ message: SnackbarText.createPositionSuccess, type: 'success' })]);
    this.router.navigate(['./personal-cabinet/provider/positions']);
  }

  @Action(providerActions.OnCreatePositionFail)
  onCreatePositionFail({ dispatch, patchState }: StateContext<ProviderStateModel>, { error }: providerActions.OnCreatePositionFail): void {
    patchState({ isLoading: false });
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(providerActions.UpdatePosition)
  updatePosition(
    { patchState, dispatch }: StateContext<ProviderStateModel>,
    { position }: providerActions.UpdatePosition
  ): Observable<Position | void> {
    patchState({ isLoading: true });
    return this.positionService.updatePosition(position).pipe(
      tap((res: Position) => dispatch(new providerActions.OnUpdatePositionSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnUpdatePositionFail(error)))
    );
  }

  @Action(providerActions.OnUpdatePositionSuccess)
  onUpdatePositionSuccess(
    { dispatch, patchState }: StateContext<ProviderStateModel>,
    { position }: providerActions.OnUpdatePositionSuccess
  ): void {
    patchState({ selectedPosition: null, isLoading: false });
    dispatch([new MarkFormDirty(false), new ShowMessageBar({ message: SnackbarText.updatePositionSuccess, type: 'success' })]);
    this.router.navigate(['/personal-cabinet/provider/positions']);
  }

  @Action(providerActions.OnUpdatePositionFail)
  onUpdatePositionFail({ dispatch, patchState }: StateContext<ProviderStateModel>, { error }: providerActions.OnUpdatePositionFail): void {
    patchState({ isLoading: false });
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(providerActions.DeletePositionById)
  deletePositionById(
    { patchState, dispatch }: StateContext<ProviderStateModel>,
    { positionParameters, positionId }: providerActions.DeletePositionById
  ): Observable<Position[] | void> {
    patchState({ isLoading: true });
    return this.positionService.deletePosition(positionParameters, positionId).pipe(
      tap(() => {
        dispatch(new providerActions.OnDeletePositionSuccess(positionParameters));
      }),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnDeletePositionFail(error)))
    );
  }

  @Action(providerActions.OnDeletePositionSuccess)
  onDeletePositionSuccess(
    { patchState, dispatch }: StateContext<ProviderStateModel>,
    payload: providerActions.OnDeletePositionSuccess
  ): void {
    patchState({ isLoading: false });
    dispatch([
      new ShowMessageBar({ message: SnackbarText.deletePositionSuccess, type: 'success' }),
      new providerActions.GetPositions(payload.positionParameters)
    ]);
  }

  @Action(providerActions.OnDeletePositionFail)
  onDeletePositionFail({ patchState, dispatch }: StateContext<ProviderStateModel>, payload: providerActions.OnDeletePositionFail): void {
    patchState({ isLoading: false });
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(providerActions.GetPositionById)
  getPositionById(
    { patchState, dispatch }: StateContext<ProviderStateModel>,
    payload: providerActions.GetPositionById
  ): Observable<Position | void> {
    return this.positionService.getPositionById(payload.positionId, payload.providerId).pipe(
      tap((position: Position) => {
        patchState({
          selectedPosition: position
        });
      }),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnGetPositionByIdFail(error)))
    );
  }

  @Action(providerActions.OnGetPositionByIdFail)
  onGetPositionByIdFail({ dispatch }: StateContext<ProviderStateModel>, payload: providerActions.OnDeletePositionFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.positionByIdNotFound, type: 'error' }));
  }
}
