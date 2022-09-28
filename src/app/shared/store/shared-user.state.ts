import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApplicationCards } from '../models/application.model';
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
  ResetProviderWorkshopDetails,
  GetWorkshopListByProviderId,
} from './shared-user.actions';
import { ApplicationStatus } from '../enum/applications';
import { messageStatus } from '../enum/messageBar';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Truncated } from '../models/truncated.model';

export interface SharedUserStateModel {
  isLoading: boolean;
  workshops: WorkshopCard[];
  truncated: Truncated[];
  selectedWorkshop: Workshop;
  selectedProvider: Provider;
  applicationCards: ApplicationCards;
}
@State<SharedUserStateModel>({
  name: 'user',
  defaults: {
    isLoading: false,
    workshops: null,
    truncated: null,
    selectedWorkshop: null,
    selectedProvider: null,
    applicationCards: null,
  },
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
  static truncated(state: SharedUserStateModel): Truncated[] {
    return state.truncated;
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
  static applications(state: SharedUserStateModel): ApplicationCards {
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
  ): Observable<object> {
    patchState({ isLoading: true });
    return this.userWorkshopService.getWorkshopById(payload).pipe(
      tap((workshop: Workshop) => patchState({ selectedWorkshop: workshop, isLoading: false })),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnGetWorkshopByIdFail(error))))
    );
  }

  @Action(GetWorkshopListByProviderId)
  getWorkshopListByProviderId(
    { patchState } : StateContext<SharedUserStateModel>,
    { payload }: GetWorkshopListByProviderId
  ): Observable<Truncated[]> {
    patchState({ isLoading: true });
    return this.userWorkshopService
      .getWorkshopListByProviderId(payload)
      .pipe(tap((truncated: Truncated[]) => patchState({ truncated: truncated, isLoading: false })));
  }

  @Action(OnGetWorkshopByIdFail)
  onGetWorkshopByIdFail(
    { dispatch, patchState }: StateContext<SharedUserStateModel>,
    { payload }: OnGetWorkshopByIdFail
  ): void {
    throwError(payload);
    patchState({ selectedWorkshop: null, isLoading: false });
    dispatch(new ShowMessageBar({ message: 'Даний гурток видалено', type: 'error' }));
  }

  @Action(GetProviderById)
  getProviderById(
    { patchState, dispatch }: StateContext<SharedUserStateModel>,
    { payload }: GetProviderById
  ): Observable<object> {
    patchState({ isLoading: true });
    return this.providerService.getProviderById(payload).pipe(
      tap((provider: Provider) => patchState({ selectedProvider: provider, isLoading: false })),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnGetProviderByIdFail(error))))
    );
  }

  @Action(OnGetProviderByIdFail)
  onGetProviderByIdFail(
    { dispatch, patchState }: StateContext<SharedUserStateModel>,
    { payload }: OnGetProviderByIdFail
  ): void {
    throwError(payload);
    patchState({ isLoading: false });
    dispatch(new ShowMessageBar({ message: 'Виникла помилка', type: 'error' }));
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
  ): Observable<ApplicationCards> {
    patchState({ isLoading: true });
    return this.applicationService
      .getApplicationsByParentId(id, parameters)
      .pipe(
        tap((applicationCards: ApplicationCards) =>
          patchState(
            applicationCards
              ? { applicationCards: applicationCards, isLoading: false }
              : { applicationCards: { totalAmount: 0, entities: [] }, isLoading: false }
          )
        )
      );
  }

  @Action(GetApplicationsByProviderId)
  getApplicationsByProviderId(
    { patchState }: StateContext<SharedUserStateModel>,
    { id, parameters }: GetApplicationsByProviderId
  ): Observable<ApplicationCards> {
    patchState({ isLoading: true });

    return this.applicationService
      .getApplicationsByProviderId(id, parameters)
      .pipe(
        tap((applicationCards: ApplicationCards) =>
          patchState(
            applicationCards
              ? { applicationCards: applicationCards, isLoading: false }
              : { applicationCards: { totalAmount: 0, entities: [] }, isLoading: false }
          )
        )
      );
  }

  @Action(UpdateApplication)
  updateApplication({ dispatch }: StateContext<SharedUserStateModel>, { payload }: UpdateApplication): Observable<object> {
    return this.applicationService.updateApplication(payload).pipe(
      tap(res => dispatch(new OnUpdateApplicationSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnUpdateApplicationFail(error))))
    );
  }

  @Action(OnUpdateApplicationFail)
  onUpdateApplicationfail({ dispatch }: StateContext<SharedUserStateModel>, { payload }: OnUpdateApplicationFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnUpdateApplicationSuccess)
  onUpdateApplicationSuccess(
    { dispatch }: StateContext<SharedUserStateModel>,
    { payload }: OnUpdateApplicationSuccess
  ): void {
    dispatch(
      new ShowMessageBar({
        message: payload.status === ApplicationStatus.Left ? messageStatus.left : messageStatus.approved,
        type: 'success',
      })
    );
  }

  @Action(ResetProviderWorkshopDetails)
  clearProviderWorkshopDetails({ patchState }: StateContext<SharedUserStateModel>): void {
    patchState({ selectedWorkshop: null, selectedProvider: null });
  }
}
