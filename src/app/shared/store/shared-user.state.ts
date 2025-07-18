import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { EMPTY_RESULT } from 'shared/constants/constants';
import { messageStatus, showHttpErrorMessage, SnackbarText } from 'shared/enum/enumUA/message-bar';
import { ApplicationStatuses } from 'shared/enum/statuses';
import { Application } from 'shared/models/application.model';
import { Competition } from 'shared/models/competition.model';
import { Provider } from 'shared/models/provider.model';
import { SearchResponse } from 'shared/models/search.model';
import { Workshop, WorkshopCard, WorkshopDraft, WorkshopDraftCard } from 'shared/models/workshop.model';
import { AdminService } from 'shared/services/admin/admin.service';
import { ApplicationService } from 'shared/services/applications/application.service';
import { UserCompetitionService } from 'shared/services/competitions/user-competition/user-competition.service';
import { ProviderService } from 'shared/services/provider/provider.service';
import { UserWorkshopService } from 'shared/services/workshops/user-workshop/user-workshop.service';
import { Router } from '@angular/router';
import { MarkFormDirty, ShowMessageBar } from './app.actions';
import { GetPendingApplicationsByProviderId } from './provider.actions';
import { RegistrationState } from './registration.state';
import {
  DeleteWorkshopDraftCoverImage,
  DeleteWorkshopDraftCoverImageFail,
  DeleteWorkshopDraftCoverImageSuccess,
  DeleteWorkshopDraftImage,
  DeleteWorkshopDraftImageFail,
  DeleteWorkshopDraftImageSuccess,
  EditWorkshopDraftByModerator,
  EditWorkshopDraftByModeratorFail,
  EditWorkshopDraftByModeratorSuccess,
  GetAllApplications,
  GetApplicationsByPropertyId,
  GetCompetitionById,
  GetProviderById,
  GetWorkshopById,
  GetWorkshopDraftById,
  GetWorkshopsByProviderId,
  OnGetCompetitionByIdFail,
  OnGetProviderByIdFail,
  OnGetWorkshopByIdFail,
  OnGetWorkshopByIdSuccess,
  OnGetWorkshopDraftByIdFail,
  OnGetWorkshopDraftByIdSuccess,
  OnUpdateApplicationFail,
  OnUpdateApplicationSuccess,
  ResetCompetition,
  ResetProvider,
  ResetWorkshop,
  UpdateApplication
} from './shared-user.actions';

export interface SharedUserStateModel {
  isLoading: boolean;
  workshops: SearchResponse<WorkshopCard[] | WorkshopDraftCard[]>;
  selectedWorkshop: Workshop | WorkshopDraft;
  selectedProvider: Provider;
  applicationCards: SearchResponse<Application[]>;
  selectedCompetition: Competition;
}

@State<SharedUserStateModel>({
  name: 'user',
  defaults: {
    isLoading: false,
    workshops: null,
    selectedWorkshop: null,
    selectedProvider: null,
    applicationCards: null,
    selectedCompetition: null
  }
})
@Injectable()
export class SharedUserState {
  constructor(
    private readonly userWorkshopService: UserWorkshopService,
    private readonly userCompetitionService: UserCompetitionService,
    private readonly applicationService: ApplicationService,
    private readonly adminService: AdminService,
    private readonly providerService: ProviderService,
    private readonly store: Store,
    private readonly router: Router
  ) {}

  @Selector()
  static isLoading(state: SharedUserStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  static workshops(state: SharedUserStateModel): SearchResponse<WorkshopCard[] | WorkshopDraftCard[]> {
    return state.workshops;
  }

  @Selector()
  static selectedProvider(state: SharedUserStateModel): Provider {
    return state.selectedProvider;
  }

  @Selector()
  static selectedWorkshop(state: SharedUserStateModel): Workshop | WorkshopDraft {
    return state.selectedWorkshop;
  }

  @Selector()
  static selectedCompetition(state: SharedUserStateModel): Competition {
    return state.selectedCompetition;
  }

  @Selector()
  static applications(state: SharedUserStateModel): SearchResponse<Application[]> {
    return state.applicationCards;
  }

  @Action(GetWorkshopById)
  getWorkshopById({ patchState, dispatch }: StateContext<SharedUserStateModel>, { payload }: GetWorkshopById): Observable<Workshop | void> {
    patchState({ isLoading: true });
    return this.userWorkshopService.getWorkshopById(payload).pipe(
      tap((workshop: Workshop) => patchState({ selectedWorkshop: workshop, isLoading: false })),
      catchError((error: HttpErrorResponse) => dispatch(new OnGetWorkshopByIdFail(error)))
    );
  }

  @Action(OnGetWorkshopByIdSuccess)
  onGetWorkshopByIdSuccess({ patchState }: StateContext<SharedUserStateModel>, { workshop }: OnGetWorkshopByIdSuccess): void {
    patchState({ selectedWorkshop: workshop, isLoading: false });
  }

  @Action(OnGetWorkshopByIdFail)
  onGetWorkshopByIdFail({ dispatch, patchState }: StateContext<SharedUserStateModel>, { payload }: OnGetWorkshopByIdFail): void {
    patchState({ selectedWorkshop: null, isLoading: false });
    dispatch(
      new ShowMessageBar({
        message: SnackbarText.deletedWorkshop,
        type: 'error'
      })
    );
  }

  @Action(GetWorkshopDraftById)
  getWorkshopDraftById(
    { patchState, dispatch }: StateContext<SharedUserStateModel>,
    { payload }: GetWorkshopDraftById
  ): Observable<WorkshopDraft | void> {
    patchState({ isLoading: true });
    return this.userWorkshopService.getWorkshopDraftById(payload).pipe(
      tap((workshop: WorkshopDraft) => dispatch(new OnGetWorkshopDraftByIdSuccess(workshop))),
      catchError((error: HttpErrorResponse) => dispatch(new OnGetWorkshopDraftByIdFail(error)))
    );
  }

  @Action(OnGetWorkshopDraftByIdSuccess)
  onGetWorkshopDraftByIdSuccess({ patchState }: StateContext<SharedUserStateModel>, { payload }: OnGetWorkshopDraftByIdSuccess): void {
    patchState({ selectedWorkshop: payload, isLoading: false });
  }

  @Action(OnGetWorkshopDraftByIdFail)
  onGetWorkshopDraftByIdFail({ dispatch, patchState }: StateContext<SharedUserStateModel>, { payload }: OnGetWorkshopDraftByIdFail): void {
    patchState({ selectedWorkshop: null, isLoading: false });
    dispatch(
      new ShowMessageBar({
        message: SnackbarText.deletedDraft,
        type: 'error'
      })
    );
  }

  @Action(GetCompetitionById)
  getCompetitionById(
    { patchState, dispatch }: StateContext<SharedUserStateModel>,
    { payload }: GetCompetitionById
  ): Observable<Competition | void> {
    patchState({ isLoading: true });
    return this.userCompetitionService.getCompetitionById(payload).pipe(
      tap((competition: Competition) => patchState({ selectedCompetition: competition, isLoading: false })),
      catchError((error: HttpErrorResponse) => dispatch(new OnGetCompetitionByIdFail(error)))
    );
  }

  @Action(GetAllApplications)
  getAllApplications(
    { patchState }: StateContext<SharedUserStateModel>,
    { params }: GetAllApplications
  ): Observable<SearchResponse<Application[]>> {
    patchState({ isLoading: true });
    return this.adminService
      .getAllApplications(params)
      .pipe(
        tap((applicationCards: SearchResponse<Application[]>) =>
          patchState({ applicationCards: applicationCards ?? EMPTY_RESULT, isLoading: false })
        )
      );
  }

  @Action(OnGetCompetitionByIdFail)
  onGetCompetitionByIdFail({ dispatch, patchState }: StateContext<SharedUserStateModel>, { payload }: OnGetCompetitionByIdFail): void {
    patchState({ selectedCompetition: null, isLoading: false });
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(GetProviderById)
  getProviderById({ patchState, dispatch }: StateContext<SharedUserStateModel>, { payload }: GetProviderById): Observable<Provider | void> {
    patchState({ isLoading: true });
    return this.providerService.getProviderById(payload).pipe(
      tap((provider: Provider) => patchState({ selectedProvider: provider, isLoading: false })),
      catchError((error: HttpErrorResponse) => dispatch(new OnGetProviderByIdFail(error)))
    );
  }

  @Action(OnGetProviderByIdFail)
  onGetProviderByIdFail({ dispatch, patchState }: StateContext<SharedUserStateModel>, { payload }: OnGetProviderByIdFail): void {
    patchState({ isLoading: false });
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(GetWorkshopsByProviderId)
  getWorkshopsByProviderId(
    { patchState }: StateContext<SharedUserStateModel>,
    { providerParameters }: GetWorkshopsByProviderId
  ): Observable<SearchResponse<WorkshopCard[]>> {
    patchState({ isLoading: true });
    return this.userWorkshopService.getWorkshopsByProviderId(providerParameters).pipe(
      tap((workshops: SearchResponse<WorkshopCard[]>) =>
        patchState({
          workshops: workshops ?? EMPTY_RESULT,
          isLoading: false
        })
      )
    );
  }

  @Action(GetApplicationsByPropertyId)
  getApplicationsByPropertyId(
    { patchState }: StateContext<SharedUserStateModel>,
    { id, parameters }: GetApplicationsByPropertyId
  ): Observable<SearchResponse<Application[]>> {
    patchState({ isLoading: true });

    return this.applicationService
      .getApplicationsByPropertyId(id, parameters)
      .pipe(
        tap((applicationCards: SearchResponse<Application[]>) =>
          patchState({ applicationCards: applicationCards ?? EMPTY_RESULT, isLoading: false })
        )
      );
  }

  @Action(UpdateApplication)
  updateApplication({ dispatch }: StateContext<SharedUserStateModel>, { payload }: UpdateApplication): Observable<Application | void> {
    return this.applicationService.updateApplication(payload).pipe(
      tap((res: Application) => dispatch(new OnUpdateApplicationSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new OnUpdateApplicationFail(error)))
    );
  }

  @Action(OnUpdateApplicationFail)
  onUpdateApplicationFail({ dispatch }: StateContext<SharedUserStateModel>, { payload }: OnUpdateApplicationFail): void {
    throwError(() => payload);
  }

  @Action(OnUpdateApplicationSuccess)
  onUpdateApplicationSuccess({ dispatch }: StateContext<SharedUserStateModel>, { payload }: OnUpdateApplicationSuccess): void {
    dispatch([
      new ShowMessageBar({
        message: payload.status === ApplicationStatuses.Left ? messageStatus.left : messageStatus.approved,
        type: 'success'
      }),
      new GetPendingApplicationsByProviderId(this.store.selectSnapshot(RegistrationState.provider).id)
    ]);
  }

  @Action(ResetProvider)
  clearProviderDetails({ patchState }: StateContext<SharedUserStateModel>): void {
    patchState({ selectedProvider: null });
  }

  @Action(ResetWorkshop)
  clearWorkshopDetails({ patchState }: StateContext<SharedUserStateModel>): void {
    patchState({ selectedWorkshop: null });
  }

  @Action(ResetCompetition)
  clearCompetitionDetails({ patchState }: StateContext<SharedUserStateModel>): void {
    patchState({ selectedCompetition: null });
  }

  @Action(DeleteWorkshopDraftCoverImage)
  onDeleteWorkshopDraftCoverImage(
    { dispatch }: StateContext<SharedUserStateModel>,
    { draftId }: DeleteWorkshopDraftCoverImage
  ): Observable<void> {
    return this.userWorkshopService.deleteCoverImageByWorkshopDraftId(draftId).pipe(
      tap(() => dispatch(new DeleteWorkshopDraftCoverImageSuccess())),
      catchError((error) => {
        dispatch(new DeleteWorkshopDraftCoverImageFail(error));
        throw error;
      })
    );
  }

  @Action(DeleteWorkshopDraftCoverImageSuccess)
  onDeleteWorkshopDraftCoverImageSuccess({ dispatch }: StateContext<SharedUserStateModel>): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.workshopCoverImageDeleted, type: 'success' }));
  }

  @Action(DeleteWorkshopDraftCoverImageFail)
  onDeleteWorkshopDraftCoverImageFail(
    { dispatch }: StateContext<SharedUserStateModel>,
    { error }: DeleteWorkshopDraftCoverImageFail
  ): void {
    showHttpErrorMessage(dispatch, error.status);
  }

  @Action(DeleteWorkshopDraftImage)
  onDeleteWorkshopDraftImage(
    { dispatch }: StateContext<SharedUserStateModel>,
    { draftId, imageId }: DeleteWorkshopDraftImage
  ): Observable<void> {
    return this.userWorkshopService.deleteImageByWorkshopDraftId(draftId, imageId).pipe(
      tap(() => dispatch(new DeleteWorkshopDraftImageSuccess())),
      catchError((error) => {
        dispatch(new DeleteWorkshopDraftImageFail(error));
        throw error;
      })
    );
  }

  @Action(DeleteWorkshopDraftImageSuccess)
  onDeleteWorkshopDraftImageSuccess({ dispatch }: StateContext<SharedUserStateModel>): void {
    dispatch(new ShowMessageBar({ message: SnackbarText.workshopImageDeleted, type: 'success' }));
  }

  @Action(DeleteWorkshopDraftImageFail)
  onDeleteWorkshopDraftImageFail({ dispatch }: StateContext<SharedUserStateModel>, { error }: DeleteWorkshopDraftImageFail): void {
    showHttpErrorMessage(dispatch, error.status);
  }

  @Action(EditWorkshopDraftByModerator)
  onEditWorkshopDraftByModerator(
    { dispatch }: StateContext<SharedUserStateModel>,
    { draftId, formData }: EditWorkshopDraftByModerator
  ): Observable<void> {
    return this.userWorkshopService.editWorkshopDraftByModerator(formData, draftId).pipe(
      tap(() => dispatch(new EditWorkshopDraftByModeratorSuccess())),
      catchError((error) => dispatch(new EditWorkshopDraftByModeratorFail(error)))
    );
  }

  @Action(EditWorkshopDraftByModeratorSuccess)
  onEditWorkshopDraftByModeratorSuccess({ dispatch }: StateContext<SharedUserStateModel>): void {
    dispatch([new MarkFormDirty(false), new ShowMessageBar({ message: SnackbarText.editDraft, type: 'success' })]);
    this.router.navigate(['/admin-tools/data/workshop-list']);
  }

  @Action(EditWorkshopDraftByModeratorFail)
  onEditWorkshopDraftByModeratorFail({ dispatch }: StateContext<SharedUserStateModel>, { error }: EditWorkshopDraftByModeratorFail): void {
    showHttpErrorMessage(dispatch, error.status);
  }
}
