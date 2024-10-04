import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext, Store } from '@ngxs/store';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { EMPTY_RESULT } from 'shared/constants/constants';
import { messageStatus, SnackbarText } from 'shared/enum/enumUA/message-bar';
import { ApplicationStatuses } from 'shared/enum/statuses';
import { Application } from 'shared/models/application.model';
import { Competition } from 'shared/models/competition.model';
import { Provider } from 'shared/models/provider.model';
import { SearchResponse } from 'shared/models/search.model';
import { Workshop, WorkshopCard } from 'shared/models/workshop.model';
import { AdminService } from 'shared/services/admin/admin.service';
import { ApplicationService } from 'shared/services/applications/application.service';
import { UserCompetitionService } from 'shared/services/competitions/user-competition.service';
import { ProviderService } from 'shared/services/provider/provider.service';
import { UserWorkshopService } from 'shared/services/workshops/user-workshop/user-workshop.service';
import { ShowMessageBar } from './app.actions';
import { GetPendingApplicationsByProviderId } from './provider.actions';
import { RegistrationState } from './registration.state';
import {
  GetAllApplications,
  GetApplicationsByPropertyId,
  GetCompetitionById,
  GetProviderById,
  GetWorkshopById,
  GetWorkshopsByProviderId,
  OnGetCompetitionByIdFail,
  OnGetProviderByIdFail,
  OnGetWorkshopByIdFail,
  OnUpdateApplicationFail,
  OnUpdateApplicationSuccess,
  ResetProviderWorkshopDetails,
  UpdateApplication
} from './shared-user.actions';

export interface SharedUserStateModel {
  isLoading: boolean;
  workshops: SearchResponse<WorkshopCard[]>;
  selectedWorkshop: Workshop;
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
    private userWorkshopService: UserWorkshopService,
    private userCompetitionService: UserCompetitionService,
    private applicationService: ApplicationService,
    private adminService: AdminService,
    private providerService: ProviderService,
    private store: Store
  ) {}

  @Selector()
  static isLoading(state: SharedUserStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  static workshops(state: SharedUserStateModel): SearchResponse<WorkshopCard[]> {
    return state.workshops;
  }

  @Selector()
  static selectedProvider(state: SharedUserStateModel): Provider {
    return state.selectedProvider;
  }

  @Selector()
  static selectedWorkshop(state: SharedUserStateModel): Workshop {
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

  @Action(GetCompetitionById)
  getCompetitionById(
    { patchState, dispatch }: StateContext<SharedUserStateModel>,
    { payload }: GetCompetitionById
  ): Observable<Competition | void> {
    patchState({ isLoading: true });
    return this.userCompetitionService.getCompetitionById(payload).pipe(
      tap((Competition: Competition) => patchState({ selectedCompetition: Competition, isLoading: false })),
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
    return this.userWorkshopService
      .getWorkshopsByProviderId(providerParameters)
      .pipe(tap((workshops: SearchResponse<WorkshopCard[]>) => patchState({ workshops: workshops ?? EMPTY_RESULT, isLoading: false })));
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

  @Action(ResetProviderWorkshopDetails)
  clearProviderWorkshopDetails({ patchState }: StateContext<SharedUserStateModel>): void {
    patchState({ selectedWorkshop: null, selectedProvider: null });
  }
}
