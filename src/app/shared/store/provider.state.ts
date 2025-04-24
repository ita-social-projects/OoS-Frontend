import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { EMPTY, Observable, of, throwError } from 'rxjs';
import { catchError, finalize, take, tap } from 'rxjs/operators';

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
import { Workshop, WorkshopDraft, WorkshopDraftCard, WorkshopProviderViewCard, WorkshopStatus } from 'shared/models/workshop.model';
import { AchievementsService } from 'shared/services/achievements/achievements.service';
import { ApplicationService } from 'shared/services/applications/application.service';
import { BlockService } from 'shared/services/block/block.service';
import { EmployeeService } from 'shared/services/employee/employee.service';
import { ProviderService } from 'shared/services/provider/provider.service';
import { UserWorkshopService } from 'shared/services/workshops/user-workshop/user-workshop.service';
import { PositionService } from 'shared/services/position/position.service';
import { StudySubjectService } from 'shared/services/study-subjects/study-subjects.service';
import { LanguageListService } from 'shared/services/language-list/language-list.service';
import { UserCompetitionService } from 'shared/services/competitions/user-competition.service';
import { Util } from 'shared/utils/utils';
import { Position } from 'shared/models/position.model';
import { WorkshopDraftState } from 'shared/models/draftWorkshop.model';
import { workshopToDraftState } from 'shared/utils/provider.utils';
import { LanguageListItem } from 'shared/models/language-list.model';
import { StudySubject } from 'shared/models/study-subject.model';
import { Competition, CompetitionProviderViewCard } from 'shared/models/competition.model';
import { GetFilteredProviders } from './admin.actions';
import { MarkFormDirty, ShowMessageBar } from './app.actions';
import * as providerActions from './provider.actions';
import {
  OnGetWorkshopDraftIdByWorkshopIdSuccess,
  OnSaveWorkshopStep,
  OnSaveWorkshopStepFail,
  OnSaveWorkshopStepSuccess
} from './provider.actions';
import { CheckAuth, GetProfile } from './registration.actions';

export interface ProviderStateModel {
  isLoading: boolean;
  isDraftModalShown: boolean;
  achievements: SearchResponse<Achievement[]>;
  selectedAchievement: Achievement;
  approvedChildren: SearchResponse<Child[]>;
  providerWorkshops: SearchResponse<WorkshopProviderViewCard[]>;
  providerCompetition: SearchResponse<CompetitionProviderViewCard[]>;
  officialEmployees: SearchResponse<OfficialEmployee[]>;
  providerDrafts: SearchResponse<WorkshopDraftCard[]>;
  selectedEmployee: Employee;
  blockedParent: BlockedParent;
  truncatedItems: TruncatedItem[];
  pendingApplications: SearchResponse<Application[]>;
  positions: SearchResponse<Position[]>;
  selectedPosition: Position;
  unfinishedWorkshop: WorkshopDraftState;
  timeToLiveUnfinishedWorkshop: string | null;
  languageList: LanguageListItem[];
  studySubject: SearchResponse<StudySubject[]>;
  selectedSubject: StudySubject;
}

@State<ProviderStateModel>({
  name: 'provider',
  defaults: {
    isLoading: false,
    isDraftModalShown: false,
    approvedChildren: null,
    achievements: null,
    selectedAchievement: null,
    providerWorkshops: null,
    providerCompetition: null,
    officialEmployees: null,
    providerDrafts: null,
    selectedEmployee: null,
    blockedParent: null,
    truncatedItems: null,
    pendingApplications: null,
    positions: null,
    selectedPosition: null,
    unfinishedWorkshop: null,
    timeToLiveUnfinishedWorkshop: null,
    languageList: null,
    studySubject: null,
    selectedSubject: null
  }
})
@Injectable()
export class ProviderState {
  constructor(
    private readonly achievementsService: AchievementsService,
    private readonly router: Router,
    private readonly userWorkshopService: UserWorkshopService,
    private readonly userCompetitionService: UserCompetitionService,
    private readonly employeeService: EmployeeService,
    private readonly providerService: ProviderService,
    private readonly applicationService: ApplicationService,
    private readonly blockService: BlockService,
    private readonly positionService: PositionService,
    private readonly studySubjectService: StudySubjectService,
    private readonly languageListService: LanguageListService
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
  static providerDrafts(state: ProviderStateModel): SearchResponse<WorkshopDraftCard[]> {
    return state.providerDrafts;
  }

  @Selector()
  static providerCompetition(state: ProviderStateModel): SearchResponse<CompetitionProviderViewCard[]> {
    return state.providerCompetition;
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
  static languageList(state: ProviderStateModel): LanguageListItem[] {
    return state.languageList;
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
  static hasUnfinishedWorkshopData(state: ProviderStateModel): boolean {
    return Boolean(state.unfinishedWorkshop?.workshopForLoading);
  }

  @Selector() static isModalShown(state: ProviderStateModel): boolean {
    return state.isDraftModalShown;
  }

  @Selector()
  static getTimeToLiveUnfinishedWorkshop(state: ProviderStateModel): string | null {
    return state.timeToLiveUnfinishedWorkshop;
  }

  @Selector()
  static positions(state: ProviderStateModel): SearchResponse<Position[]> {
    return state.positions;
  }

  @Selector()
  static selectedPosition(state: ProviderStateModel): Position {
    return state.selectedPosition;
  }

  @Selector()
  static studySubject(state: ProviderStateModel): SearchResponse<StudySubject[]> {
    return state.studySubject;
  }

  @Selector()
  static selectedSubject(state: ProviderStateModel): StudySubject {
    return state.selectedSubject;
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
    return this.achievementsService.getAchievementsByWorkshopId(payload).pipe(
      tap((achievements: SearchResponse<Achievement[]>) =>
        patchState({
          achievements: achievements ?? EMPTY_RESULT,
          isLoading: false
        })
      )
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

  @Action(providerActions.DraftSendForModeration)
  sendDraftForModeration(
    { dispatch, patchState }: StateContext<ProviderStateModel>,
    { id }: providerActions.DraftSendForModeration
  ): Observable<void> {
    patchState({ isLoading: true });
    return this.userWorkshopService.sendDraftForModeration(id).pipe(
      tap(() => dispatch(new providerActions.OnDraftSendForModerationSuccess())),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnDraftSendForModerationFail(error)))
    );
  }

  @Action(providerActions.OnDraftSendForModerationSuccess)
  onDraftSendForModerationSuccess({ dispatch, patchState }: StateContext<ProviderStateModel>): void {
    patchState({ isLoading: false });
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.sendDraftForModeration,
        type: 'success'
      })
    ]);
  }

  @Action(providerActions.OnDraftSendForModerationFail)
  onDraftSendForModerationFail({ dispatch, patchState }: StateContext<ProviderStateModel>): void {
    patchState({ isLoading: false });
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
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

  @Action(providerActions.GetProviderViewWorkshopDrafts)
  getProviderViewWorkshopDrafts(
    { patchState }: StateContext<ProviderStateModel>,
    { workshopCardParameters }: providerActions.GetProviderViewWorkshopDrafts
  ): Observable<SearchResponse<WorkshopDraftCard[]>> {
    patchState({ isLoading: true });
    return this.userWorkshopService
      .getProviderViewWorkshopDrafts(workshopCardParameters)
      .pipe(
        tap((providerDrafts: SearchResponse<WorkshopDraftCard[]>) =>
          patchState({ providerDrafts: providerDrafts ?? EMPTY_RESULT, isLoading: false })
        )
      );
  }

  @Action(providerActions.GetProviderViewCompetitions)
  getProviderViewCompetitions(
    { patchState }: StateContext<ProviderStateModel>,
    { competitionCardParameters }: providerActions.GetProviderViewCompetitions
  ): Observable<SearchResponse<CompetitionProviderViewCard[]>> {
    patchState({ isLoading: true });
    return this.userCompetitionService
      .getProviderViewCompetitions(competitionCardParameters)
      .pipe(
        tap((providerCompetitions: SearchResponse<CompetitionProviderViewCard[]>) =>
          patchState({ providerCompetition: providerCompetitions ?? EMPTY_RESULT, isLoading: false })
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

  @Action(providerActions.CreateWorkshopDraft)
  createWorkshopDraft(
    { patchState, dispatch }: StateContext<ProviderStateModel>,
    { payload }: providerActions.CreateWorkshopDraft
  ): Observable<Workshop | void> {
    patchState({ isLoading: true });
    return this.userWorkshopService.createWorkshopDraft(payload).pipe(
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
    const messageData = Util.getWorkshopMessage(payload, SnackbarText.createDraft);
    patchState({ isLoading: false });
    dispatch([new MarkFormDirty(false), new ShowMessageBar({ message: messageData.message, type: messageData.type })]);
    this.router.navigate(['./personal-cabinet/provider/drafts']);
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
  deleteWorkshop({ dispatch }: StateContext<ProviderStateModel>, { id, parameters }: providerActions.DeleteWorkshopById): Observable<void> {
    return this.userWorkshopService.deleteWorkshop(id).pipe(
      tap(() => dispatch(new providerActions.OnDeleteWorkshopSuccess(parameters))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnDeleteWorkshopFail(error)))
    );
  }

  @Action(providerActions.GetWorkshopDraftIdByWorkshopId)
  getWorkshopDraftIdByWorkshopId(
    { patchState, dispatch }: StateContext<ProviderStateModel>,
    { id }: providerActions.GetWorkshopDraftIdByWorkshopId
  ): Observable<string> {
    patchState({ isLoading: true });
    return this.userWorkshopService.getWorkshopDraftIdByWorkshopId(id).pipe(
      take(1),
      tap((draftId: string) => dispatch(new OnGetWorkshopDraftIdByWorkshopIdSuccess(draftId))),
      catchError(() => {
        dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
        return EMPTY;
      }),
      finalize(() => patchState({ isLoading: false }))
    );
  }

  @Action(providerActions.UpdateDraft)
  updateDraft(
    { dispatch }: StateContext<ProviderStateModel>,
    { draftId, payload }: providerActions.UpdateDraft
  ): Observable<WorkshopDraft | void> {
    return this.userWorkshopService.updateDraft(draftId, payload).pipe(
      tap((res: WorkshopDraft) => dispatch(new providerActions.OnUpdateDraftSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnUpdateWorkshopFail(error)))
    );
  }

  @Action(providerActions.OnUpdateDraftSuccess)
  onUpdateDraftSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnUpdateDraftSuccess): void {
    const messageData = Util.getWorkshopMessage(payload, SnackbarText.updateWorkshop);
    dispatch([new MarkFormDirty(false), new ShowMessageBar({ message: messageData.message, type: messageData.type })]);
    this.router.navigate(['/personal-cabinet/provider/drafts']);
  }

  @Action(providerActions.DeleteWorkshopDraftById)
  deleteDraft(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, parameters }: providerActions.DeleteWorkshopDraftById
  ): Observable<void> {
    return this.userWorkshopService.deleteWorkshopDraft(payload.workshopDraftId).pipe(
      tap(() => dispatch(new providerActions.OnDeleteDraftSuccess(parameters))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnDeleteDraftFail(error)))
    );
  }

  @Action(providerActions.OnDeleteDraftSuccess)
  onDeleteDraftSuccess({ dispatch }: StateContext<ProviderStateModel>, { parameters }: providerActions.OnDeleteDraftSuccess): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.deleteDraft,
        type: 'success'
      }),
      new providerActions.GetProviderViewWorkshopDrafts(parameters)
    ]);
  }

  @Action(providerActions.OnDeleteDraftFail)
  onDeleteDraftFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnDeleteDraftFail): void {
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

  @Action(providerActions.OnDeleteWorkshopFail)
  onDeleteWorkshopFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnDeleteWorkshopFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
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
    this.router.navigate(['/personal-cabinet/provider/provider-employees']);
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
    this.router.navigate(['/personal-cabinet/provider/provider-employees']);
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
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({
        message: SnackbarText.createPositionSuccess,
        type: 'success'
      })
    ]);
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
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({
        message: SnackbarText.updatePositionSuccess,
        type: 'success'
      })
    ]);
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

  @Action(providerActions.CreateCompetition)
  createCompetition(
    { patchState, dispatch }: StateContext<ProviderStateModel>,
    { payload }: providerActions.CreateCompetition
  ): Observable<Competition | void> {
    patchState({ isLoading: true });
    return this.userCompetitionService.createCompetition(payload).pipe(
      tap((res: Competition) => dispatch(new providerActions.OnCreateCompetitionSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnCreateCompetitionFail(error)))
    );
  }

  @Action(providerActions.OnCreateCompetitionFail)
  onCreateCompetitionFail(
    { dispatch, patchState }: StateContext<ProviderStateModel>,
    { payload }: providerActions.OnCreateCompetitionFail
  ): void {
    patchState({ isLoading: false });
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(providerActions.OnCreateCompetitionSuccess)
  onCreateCompetitionSuccess(
    { patchState, dispatch }: StateContext<ProviderStateModel>,
    { payload }: providerActions.OnCreateCompetitionSuccess
  ): void {
    const messageData = Util.getWorkshopMessage(payload, SnackbarText.createCompetition);
    patchState({ isLoading: false });
    dispatch([new MarkFormDirty(false), new ShowMessageBar({ message: messageData.message, type: messageData.type })]);
    this.router.navigate(['./personal-cabinet/provider/competitions']);
  }

  @Action(providerActions.UpdateCompetition)
  updateCompetition(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: providerActions.UpdateCompetition
  ): Observable<Competition | void> {
    return this.userCompetitionService.updateCompetition(payload).pipe(
      tap((res: Competition) => dispatch(new providerActions.OnUpdateCompetitionSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnUpdateCompetitionFail(error)))
    );
  }

  @Action(providerActions.OnUpdateCompetitionSuccess)
  onUpdateCompetitionSuccess(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: providerActions.OnUpdateCompetitionSuccess
  ): void {
    const messageData = Util.getWorkshopMessage(payload, SnackbarText.updateCompetition);
    dispatch([new MarkFormDirty(false), new ShowMessageBar({ message: messageData.message, type: messageData.type })]);
    this.router.navigate(['/personal-cabinet/provider/competitions']);
  }

  @Action(providerActions.OnUpdateCompetitionFail)
  onUpdateCompetitionFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnUpdateCompetitionFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(providerActions.DeleteCompetitionById)
  deleteCompetitionById(
    { dispatch }: StateContext<ProviderStateModel>,
    { competition, parameters }: providerActions.DeleteCompetitionById
  ): Observable<Competition | void> {
    return this.userCompetitionService.deleteCompetitionById(competition.id).pipe(
      tap(() => dispatch(new providerActions.DeleteCompetitionByIdSuccess(parameters))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.DeleteCompetitionByIdFail(error)))
    );
  }

  @Action(providerActions.DeleteCompetitionByIdSuccess)
  deleteCompetitionByIdSuccess(
    { dispatch }: StateContext<ProviderStateModel>,
    { competition }: providerActions.DeleteCompetitionByIdSuccess
  ): void {
    const messageData = Util.getWorkshopMessage(competition, SnackbarText.deleteCompetition);
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({ message: messageData.message, type: messageData.type }),
      new providerActions.GetProviderViewCompetitions(competition)
    ]);
  }

  @Action(providerActions.DeleteCompetitionByIdFail)
  deleteCompetitionByIdFail({ dispatch }: StateContext<ProviderStateModel>, { error }: providerActions.DeleteCompetitionByIdFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnSaveWorkshopStep)
  onSaveWorkshopStep(ctx: StateContext<ProviderStateModel>, action: OnSaveWorkshopStep): Observable<string | void> {
    ctx.patchState({ isLoading: true });
    const currentState = ctx.getState().unfinishedWorkshop || {};
    const { step, data } = action.payload;
    const combinedPayload = {
      ...currentState.step1,
      ...currentState.step2,
      ...currentState.step3,
      ...currentState.step4,
      ...data
    };

    return this.userWorkshopService.saveWorkshopStep(combinedPayload).pipe(
      tap(() => ctx.dispatch(new OnSaveWorkshopStepSuccess({ step, data }))),
      catchError((error: HttpErrorResponse) => ctx.dispatch(new OnSaveWorkshopStepFail(error)))
    );
  }

  @Action(OnSaveWorkshopStepSuccess)
  onSaveWorkshopStepSuccess(ctx: StateContext<ProviderStateModel>, { payload }: OnSaveWorkshopStepSuccess): void {
    const currentState = ctx.getState().unfinishedWorkshop || {};
    ctx.patchState({
      isLoading: false,
      unfinishedWorkshop: {
        ...currentState,
        [`step${payload.step}`]: payload.data
      }
    });
  }

  @Action(OnSaveWorkshopStepFail)
  onSaveWorkshopStepFail(ctx: StateContext<ProviderStateModel>, { payload }: OnSaveWorkshopStepFail): void {
    ctx.patchState({ isLoading: false });
    ctx.dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(providerActions.OnDeleteUnfinishedWorkshop)
  deleteUnfinishedWorkshop(ctx: StateContext<ProviderStateModel>): Observable<void> {
    ctx.patchState({ isLoading: true });
    return this.userWorkshopService.deleteUnfinishedWorkshop().pipe(
      tap(() => {
        ctx.dispatch(new providerActions.OnDeleteUnfinishedWorkshopSuccess());
      }),
      catchError((error: HttpErrorResponse) => ctx.dispatch(new providerActions.OnDeleteUnfinishedWorkshopFail(error)))
    );
  }

  @Action(providerActions.OnDeleteUnfinishedWorkshopFail)
  onDeleteUnfinishedWorkshopFail(ctx: StateContext<ProviderStateModel>, { payload }: providerActions.OnDeleteUnfinishedWorkshopFail): void {
    ctx.patchState({ isLoading: false });
    ctx.dispatch(new ShowMessageBar({ message: SnackbarText.deleteDraftFail, type: 'error' }));
  }

  @Action(providerActions.OnDeleteUnfinishedWorkshopSuccess)
  onDeleteUnfinishedWorkshopSuccess(ctx: StateContext<ProviderStateModel>): void {
    ctx.patchState({ unfinishedWorkshop: null, isLoading: false });
  }

  @Action(providerActions.GetUnfinishedWorkshop)
  getUnfinishedWorkshop(ctx: StateContext<ProviderStateModel>): Observable<Workshop> {
    ctx.patchState({ isLoading: true });

    return this.userWorkshopService.getUnfinishedWorkshop().pipe(
      tap((workshop: Workshop) => {
        ctx.dispatch(new providerActions.GetUnfinishedWorkshopSuccess(workshop));
      }),
      catchError((error: HttpErrorResponse) => {
        ctx.dispatch(new providerActions.GetUnfinishedWorkshopFail(error));
        return of({} as Workshop);
      })
    );
  }

  @Action(providerActions.GetUnfinishedWorkshopSuccess)
  getUnfinishedWorkshopSuccess(ctx: StateContext<ProviderStateModel>, { payload }: providerActions.GetUnfinishedWorkshopSuccess): void {
    const draftState: WorkshopDraftState = workshopToDraftState(payload);
    ctx.patchState({
      unfinishedWorkshop: draftState,
      isLoading: false
    });
  }

  @Action(providerActions.GetUnfinishedWorkshopFail)
  onGetUnfinishedWorkshopFail(ctx: StateContext<ProviderStateModel>, { payload }: providerActions.GetUnfinishedWorkshopFail): void {
    ctx.patchState({ isLoading: false, unfinishedWorkshop: null });
    ctx.dispatch(new ShowMessageBar({ message: SnackbarText.getDraftFail, type: 'error' }));
  }

  @Action(providerActions.GetUnfinishedWorkshopTimeToLive)
  getUnfinishedWorkshopTimeToLive(ctx: StateContext<ProviderStateModel>): Observable<string> {
    ctx.patchState({ isLoading: true });
    return this.userWorkshopService.getTimeToLiveOfUnfinishedWorkshop().pipe(
      tap((response: string) => {
        ctx.dispatch(new providerActions.GetUnfinishedWorkshopTimeToLiveSuccess(response));
      }),
      catchError((error: HttpErrorResponse) => {
        ctx.dispatch(new providerActions.GetUnfinishedWorkshopTimeToLiveFail(error));
        return of('');
      })
    );
  }

  @Action(providerActions.GetUnfinishedWorkshopTimeToLiveSuccess)
  onGetDraftTimeToLiveSuccess(
    ctx: StateContext<ProviderStateModel>,
    { payload }: providerActions.GetUnfinishedWorkshopTimeToLiveSuccess
  ): void {
    ctx.patchState({ timeToLiveUnfinishedWorkshop: payload, isLoading: false });
  }

  @Action(providerActions.GetUnfinishedWorkshopTimeToLiveFail)
  onGetDraftTimeToLiveFail(ctx: StateContext<ProviderStateModel>, { payload }: providerActions.GetUnfinishedWorkshopTimeToLiveFail): void {
    ctx.patchState({ isLoading: false });
    ctx.dispatch(new ShowMessageBar({ message: SnackbarText.getTimeToLiveFail, type: 'error' }));
  }

  @Action(providerActions.SetDraftModalShown)
  setDraftModalShown(ctx: StateContext<ProviderStateModel>, { payload }: providerActions.SetDraftModalShown): void {
    ctx.patchState({ isDraftModalShown: payload });
  }

  @Action(providerActions.GetLanguageList)
  getLanguageList({ patchState }: StateContext<ProviderStateModel>, {}: providerActions.GetLanguageList): Observable<LanguageListItem[]> {
    patchState({ isLoading: true });
    return this.languageListService
      .getLanguageList()
      .pipe(tap((languageList: LanguageListItem[]) => patchState({ languageList, isLoading: false })));
  }

  @Action(providerActions.CreateStudySubject)
  createStudySubject(
    { dispatch, patchState }: StateContext<ProviderStateModel>,
    { payload }: providerActions.CreateStudySubject
  ): Observable<StudySubject | void> {
    patchState({ isLoading: true });
    return this.studySubjectService.createStudySubject(payload).pipe(
      tap((res: StudySubject) => dispatch(new providerActions.OnCreateStudySubjectSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnCreateStudySubjectFail(error)))
    );
  }

  @Action(providerActions.OnCreateStudySubjectSuccess)
  onCreateStudySubjectSuccess(
    { dispatch, patchState }: StateContext<ProviderStateModel>,
    { payload }: providerActions.OnCreateStudySubjectSuccess
  ): void {
    patchState({ isLoading: false });
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({
        message: SnackbarText.createSubjectSuccess,
        type: 'success'
      })
    ]);
    this.router.navigate(['/personal-cabinet/provider/study-subjects']);
  }

  @Action(providerActions.OnCreateStudySubjectFail)
  onCreateStudySubjectFail(
    { dispatch, patchState }: StateContext<ProviderStateModel>,
    { payload }: providerActions.OnCreateStudySubjectFail
  ): void {
    patchState({ isLoading: false });
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(providerActions.GetStudySubjects)
  getStudySubjects(
    { patchState }: StateContext<ProviderStateModel>,
    { payload }: providerActions.GetStudySubjects
  ): Observable<SearchResponse<StudySubject[]>> {
    patchState({ isLoading: true });
    return this.studySubjectService.getStudySubjects(payload).pipe(
      tap((studySubject: SearchResponse<StudySubject[]>) =>
        patchState({
          studySubject: studySubject ?? EMPTY_RESULT,
          isLoading: false
        })
      )
    );
  }

  @Action(providerActions.GetStudySubjectById)
  getStudySubjectById(
    { patchState }: StateContext<ProviderStateModel>,
    payload: providerActions.GetStudySubjectById
  ): Observable<StudySubject> {
    patchState({ isLoading: true });
    return this.studySubjectService
      .getStudySubjectById(payload.subjectId, payload.providerId)
      .pipe(tap((selectedSubject: StudySubject) => patchState({ selectedSubject, isLoading: false })));
  }

  @Action(providerActions.UpdateStudySubject)
  updateStudySubject(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: providerActions.UpdateStudySubject
  ): Observable<StudySubject | void> {
    return this.studySubjectService.updateStudySubject(payload).pipe(
      tap((res: StudySubject) => dispatch(new providerActions.OnUpdateStudySubjectSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnUpdateStudySubjectFail(error)))
    );
  }

  @Action(providerActions.OnUpdateStudySubjectSuccess)
  onUpdateStudySubjectSuccess(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: providerActions.OnUpdateStudySubjectSuccess
  ): void {
    dispatch([
      new ShowMessageBar({
        message: SnackbarText.updateStudySubject,
        type: 'success'
      }),
      new MarkFormDirty(false)
    ]);
    this.router.navigate(['/personal-cabinet/provider/study-subjects']);
  }

  @Action(providerActions.OnUpdateStudySubjectFail)
  onUpdateStudySubjectFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnUpdateStudySubjectFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(providerActions.DeleteStudySubjectById)
  deleteStudySubjectById(
    { dispatch }: StateContext<ProviderStateModel>,
    { subjectParameters, subjectId }: providerActions.DeleteStudySubjectById
  ): Observable<StudySubject[] | void> {
    return this.studySubjectService.deleteStudySubject(subjectParameters, subjectId).pipe(
      tap(() => {
        dispatch(new providerActions.OnDeleteStudySubjectSuccess(subjectParameters));
      }),
      catchError((error: HttpErrorResponse) => dispatch(new providerActions.OnDeleteStudySubjectFail(error)))
    );
  }

  @Action(providerActions.OnDeleteStudySubjectSuccess)
  onDeleteStudySubjectSuccess(
    { dispatch }: StateContext<ProviderStateModel>,
    { parameters }: providerActions.OnDeleteStudySubjectSuccess
  ): void {
    dispatch([
      new ShowMessageBar({ message: SnackbarText.deleteStudySubject, type: 'success' }),
      new providerActions.GetStudySubjects(parameters)
    ]);
  }

  @Action(providerActions.OnDeleteStudySubjectFail)
  onDeleteStudySubjectFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: providerActions.OnDeleteStudySubjectFail): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }
}
