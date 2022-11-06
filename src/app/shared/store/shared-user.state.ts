import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Application } from '../models/application.model';
import { Provider } from '../models/provider.model';
import { Workshop, WorkshopCard } from '../models/workshop.model';
import { ApplicationService } from '../services/applications/application.service';
import { ProviderService } from '../services/provider/provider.service';
import { UserWorkshopService } from '../services/workshops/user-workshop/user-workshop.service';
import { ShowMessageBar } from './app.actions';
import {
  GetWorkshopsByProviderId,
  GetWorkshopById,
  OnGetWorkshopByIdFail,
  GetApplicationsByProviderId,
  GetApplicationsByParentId,
  OnUpdateApplicationSuccess,
  UpdateApplication,
  OnUpdateApplicationFail,
  GetProviderById,
  OnGetProviderByIdFail,
  ResetProviderWorkshopDetails
} from './shared-user.actions';
import { Statuses } from '../enum/statuses';
import { messageStatus, SnackbarText } from '../enum/messageBar';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TruncatedItem } from '../models/truncated.model';
import { SearchResponse } from '../models/search.model';
import { EMPTY_RESULT } from '../constants/constants';

export interface SharedUserStateModel {
  isLoading: boolean;
  workshops: WorkshopCard[];
  selectedWorkshop: Workshop;
  selectedProvider: Provider;
  applicationCards: SearchResponse<Application[]>;
}
@State<SharedUserStateModel>({
  name: 'user',
  defaults: {
    isLoading: false,
    workshops: null,
    selectedWorkshop: null,
    selectedProvider: null,
    applicationCards: null
  }
})
@Injectable()
export class SharedUserState {
  @Selector()
  static isLoading(state: SharedUserStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  static workshops(state: SharedUserStateModel): WorkshopCard[] {
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
  static applications(state: SharedUserStateModel): SearchResponse<Application[]> {
    return state.applicationCards;
  }

  constructor(
    private userWorkshopService: UserWorkshopService,
    private applicationService: ApplicationService,
    private providerService: ProviderService,
    private router: Router
  ) {}

  @Action(GetWorkshopById)
  getWorkshopById(
    { patchState, dispatch }: StateContext<SharedUserStateModel>,
    { payload }: GetWorkshopById
  ): Observable<Workshop | Observable<void>> {
    patchState({ isLoading: true });
    return this.userWorkshopService.getWorkshopById(payload).pipe(
      tap((workshop: Workshop) => patchState({ selectedWorkshop: workshop, isLoading: false })),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnGetWorkshopByIdFail(error))))
    );
  }

  @Action(OnGetWorkshopByIdFail)
  onGetWorkshopByIdFail({ dispatch, patchState }: StateContext<SharedUserStateModel>, { payload }: OnGetWorkshopByIdFail): void {
    throwError(payload);
    patchState({ selectedWorkshop: null, isLoading: false });
    dispatch(
      new ShowMessageBar({
        message: SnackbarText.deletedWorkshop,
        type: 'error'
      })
    );
  }

  @Action(GetProviderById)
  getProviderById(
    { patchState, dispatch }: StateContext<SharedUserStateModel>,
    { payload }: GetProviderById
  ): Observable<Provider | Observable<void>> {
    patchState({ isLoading: true });
    return this.providerService.getProviderById(payload).pipe(
      tap((provider: Provider) => patchState({ selectedProvider: provider, isLoading: false })),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnGetProviderByIdFail(error))))
    );
  }

  @Action(OnGetProviderByIdFail)
  onGetProviderByIdFail({ dispatch, patchState }: StateContext<SharedUserStateModel>, { payload }: OnGetProviderByIdFail): void {
    throwError(payload);
    patchState({ isLoading: false });
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(GetWorkshopsByProviderId)
  getWorkshopsByProviderId(
    { patchState }: StateContext<SharedUserStateModel>,
    { payload, excludedWorkshopId }: GetWorkshopsByProviderId
  ): Observable<WorkshopCard[]> {
    patchState({ isLoading: true });
    return this.userWorkshopService.getWorkshopsByProviderId(payload, excludedWorkshopId).pipe(
      tap((userWorkshops: WorkshopCard[]) => {
        return patchState({ workshops: userWorkshops, isLoading: false });
      })
    );
  }

  @Action(GetApplicationsByParentId)
  getApplicationsByParentId(
    { patchState }: StateContext<SharedUserStateModel>,
    { id, parameters }: GetApplicationsByParentId
  ): Observable<SearchResponse<Application[]>> {
    patchState({ isLoading: true });
    return this.applicationService
      .getApplicationsByParentId(id, parameters)
      .pipe(
        tap((applicationCards: SearchResponse<Application[]>) =>
          patchState(
            applicationCards
              ? { applicationCards: applicationCards, isLoading: false }
              : { applicationCards: EMPTY_RESULT, isLoading: false }
          )
        )
      );
  }

  @Action(GetApplicationsByProviderId)
  getApplicationsByProviderId(
    { patchState }: StateContext<SharedUserStateModel>,
    { id, parameters }: GetApplicationsByProviderId
  ): Observable<SearchResponse<Application[]>> {
    patchState({ isLoading: true });

    return this.applicationService
      .getApplicationsByProviderId(id, parameters)
      .pipe(
        tap((applicationCards: SearchResponse<Application[]>) =>
          patchState(
            applicationCards
              ? { applicationCards: applicationCards, isLoading: false }
              : { applicationCards: EMPTY_RESULT, isLoading: false }
          )
        )
      );
  }

  @Action(UpdateApplication)
  updateApplication(
    { dispatch }: StateContext<SharedUserStateModel>,
    { payload }: UpdateApplication
  ): Observable<Application | Observable<void>> {
    return this.applicationService.updateApplication(payload).pipe(
      tap((res: Application) => dispatch(new OnUpdateApplicationSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnUpdateApplicationFail(error))))
    );
  }

  @Action(OnUpdateApplicationFail)
  onUpdateApplicationfail({ dispatch }: StateContext<SharedUserStateModel>, { payload }: OnUpdateApplicationFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: SnackbarText.error, type: 'error' }));
  }

  @Action(OnUpdateApplicationSuccess)
  onUpdateApplicationSuccess({ dispatch }: StateContext<SharedUserStateModel>, { payload }: OnUpdateApplicationSuccess): void {
    dispatch(
      new ShowMessageBar({
        message: payload.status === Statuses.Left ? messageStatus.left : messageStatus.approved,
        type: 'success'
      })
    );
  }

  @Action(ResetProviderWorkshopDetails)
  clearProviderWorkshopDetails({ patchState }: StateContext<SharedUserStateModel>): void {
    patchState({ selectedWorkshop: null, selectedProvider: null });
  }
}
