import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ApplicationCards } from '../models/application.model';
import { Provider } from '../models/provider.model';
import { Workshop } from '../models/workshop.model';
import { ApplicationService } from '../services/applications/application.service';
import { UserService } from '../services/user/user.service';
import { MarkFormDirty, ShowMessageBar } from './app.actions';
import { CheckAuth } from './registration.actions';
import { PaginationElement } from '../models/paginationElement.model';
import {
  UpdateUser,
  OnUpdateUserFail,
  OnUpdateUserSuccess,
  OnUpdateApplicationSuccess,
  UpdateApplication,
  OnUpdateApplicationFail,
  ResetProviderWorkshopDetails,
  OnGetProviderByIdFail,
  GetProviderById,
  OnGetWorkshopByIdFail,
  GetWorkshopById,
  OnGetApplicationsSuccess,
} from './shared-user.actions';
import { ApplicationStatus } from '../enum/applications';
import { messageStatus } from '../enum/messageBar';
import { HttpErrorResponse } from '@angular/common/http';
import { ProviderService } from '../services/provider/provider.service';
import { UserWorkshopService } from '../services/workshops/user-workshop/user-workshop.service';

export interface SharedUserStateModel {
  isLoading: boolean;
  selectedWorkshop: Workshop;
  selectedProvider: Provider;
  applicationCards: ApplicationCards;
  currentPage: PaginationElement;
}
@State<SharedUserStateModel>({
  name: 'sharedUser',
  defaults: {
    isLoading: false,
    selectedWorkshop: null,
    selectedProvider: null,
    applicationCards: null,
    currentPage: {
      element: 1,
      isActive: true,
    },
  },
})
@Injectable()
export class SharedUserState {
  @Selector() static isLoading(state: SharedUserStateModel): boolean {
    return state.isLoading;
  }

  @Selector() static selectedProvider(state: SharedUserStateModel): Provider {
    return state.selectedProvider;
  }

  @Selector() static selectedWorkshop(state: SharedUserStateModel): Workshop {
    return state.selectedWorkshop;
  }

  @Selector() static applications(state: SharedUserStateModel): ApplicationCards {
    return state.applicationCards;
  }

  constructor(
    private applicationService: ApplicationService,
    private router: Router,
    private userService: UserService,
    private userWorkshopService: UserWorkshopService,
    private providerService: ProviderService
  ) {}

  @Action(UpdateUser)
  updateUser({ dispatch }: StateContext<SharedUserStateModel>, { payload }: UpdateUser): Observable<object> {
    return this.userService.updateUser(payload).pipe(
      tap(res => dispatch(new OnUpdateUserSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnUpdateUserFail(error))))
    );
  }

  @Action(OnUpdateUserFail)
  onUpdateUserFail({ dispatch }: StateContext<SharedUserStateModel>, { payload }: OnUpdateUserFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnUpdateUserSuccess)
  onUpdateUserSuccess({ dispatch }: StateContext<SharedUserStateModel>, { payload }: OnUpdateUserSuccess): void {
    dispatch(new MarkFormDirty(false));
    dispatch([
      new CheckAuth(),
      new ShowMessageBar({
        message: 'Особиста інформація успішно відредагована',
        type: 'success',
      }),
    ]);
    this.router.navigate(['/personal-cabinet/config']);
  }

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

  @Action(UpdateApplication)
  updateApplication(
    { dispatch }: StateContext<SharedUserStateModel>,
    { payload }: UpdateApplication
  ): Observable<object> {
    return this.applicationService.updateApplication(payload).pipe(
      tap(res => dispatch(new OnUpdateApplicationSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnUpdateApplicationFail(error))))
    );
  }

  @Action(OnUpdateApplicationFail)
  onUpdateApplicationfail(
    { dispatch }: StateContext<SharedUserStateModel>,
    { payload }: OnUpdateApplicationFail
  ): void {
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

  @Action(OnGetApplicationsSuccess)
  onGetApplicationsSuccess(
    { patchState }: StateContext<SharedUserStateModel>,
    { payload }: OnGetApplicationsSuccess
  ): void {
    const applicationRes = payload ? payload : { totalAmount: 0, entities: [] };
    patchState({ applicationCards: applicationRes});
  }
}
