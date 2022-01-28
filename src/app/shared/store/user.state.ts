import { WorkshopCard } from 'src/app/shared/models/workshop.model';
import { Favorite, WorkshopFavoriteCard } from './../models/favorite.model';
import { FavoriteWorkshopsService } from './../services/workshops/favorite-workshops/favorite-workshops.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Application } from '../models/application.model';
import { ChildCards } from '../models/child.model';
import { Provider } from '../models/provider.model';
import { Workshop } from '../models/workshop.model';
import { ApplicationService } from '../services/applications/application.service';
import { ChildrenService } from '../services/children/children.service';
import { ProviderService } from '../services/provider/provider.service';
import { RatingService } from '../services/rating/rating.service';
import { UserService } from '../services/user/user.service';
import { UserWorkshopService } from '../services/workshops/user-workshop/user-workshop.service';
import { MarkFormDirty, ShowMessageBar } from './app.actions';
import { CheckAuth, GetProfile } from './registration.actions';
import { ClearClasses, ClearDepartments } from './meta-data.actions';
import { PaginationElement } from '../models/paginationElement.model';
import {
  CreateApplication,
  CreateChildren,
  CreateProvider,
  CreateWorkshop,
  DeleteChildById,
  DeleteWorkshopById,
  GetWorkshopsByProviderId,
  OnCreateApplicationFail,
  OnCreateApplicationSuccess,
  OnCreateChildrenFail,
  OnCreateChildrenSuccess,
  OnCreateProviderFail,
  OnCreateProviderSuccess,
  OnCreateWorkshopFail,
  OnCreateWorkshopSuccess,
  OnDeleteChildFail,
  OnDeleteChildSuccess,
  OnDeleteWorkshopFail,
  OnDeleteWorkshopSuccess,
  UpdateChild,
  OnUpdateChildFail,
  OnUpdateChildSuccess,
  OnUpdateWorkshopSuccess,
  UpdateWorkshop,
  OnUpdateWorkshopFail,
  UpdateProvider,
  OnUpdateProviderFail,
  OnUpdateProviderSuccess,
  UpdateUser,
  OnUpdateUserFail,
  OnUpdateUserSuccess,
  GetWorkshopById,
  GetApplicationsByProviderId,
  GetApplicationsByParentId,
  OnUpdateApplicationSuccess,
  UpdateApplication,
  OnUpdateApplicationFail,
  GetProviderById,
  CreateRating,
  OnCreateRatingFail,
  OnCreateRatingSuccess,
  GetFavoriteWorkshops,
  CreateFavoriteWorkshop,
  DeleteFavoriteWorkshop,
  GetFavoriteWorkshopsByUserId,
  GetUsersChildren,
  CabinetPageChange,
  GetAllUsersChildren,
  ResetSelectedWorkshop,
} from './user.actions';
import { ApplicationStatus } from '../enum/applications';
import { messageStatus } from '../enum/messageBar';


export interface UserStateModel {
  isLoading: boolean;
  workshops: WorkshopCard[];
  selectedWorkshop: Workshop;
  selectedProvider: Provider;
  applications: Application[];
  children: ChildCards;
  favoriteWorkshops: Favorite[];
  favoriteWorkshopsCard: WorkshopCard[];
  currentPage: PaginationElement;
}
@State<UserStateModel>({
  name: 'user',
  defaults: {
    isLoading: false,
    workshops: [],
    selectedWorkshop: null,
    selectedProvider: null,
    applications: [],
    children: undefined,
    favoriteWorkshops: [],
    favoriteWorkshopsCard: [],
    currentPage: {
      element: 1,
      isActive: true
    },
  }
})
@Injectable()
export class UserState {
  postUrl = '/Workshop/Create';
  @Selector()
  static isLoading(state: UserStateModel): boolean { return state.isLoading; }

  @Selector()
  static workshops(state: UserStateModel): WorkshopCard[] { return state.workshops; }

  @Selector()
  static selectedProvider(state: UserStateModel): Provider { return state.selectedProvider; }

  @Selector()
  static selectedWorkshop(state: UserStateModel): Workshop { return state.selectedWorkshop; }

  @Selector()
  static applications(state: UserStateModel): Application[] { return state.applications; }

  @Selector()
  static children(state: UserStateModel): ChildCards { return state.children; }

  @Selector()
  static favoriteWorkshops(state: UserStateModel): Favorite[] { return state.favoriteWorkshops; }

  @Selector()
  static favoriteWorkshopsCard(state: UserStateModel): WorkshopCard[] { return state.favoriteWorkshopsCard; }

  constructor(
    private userWorkshopService: UserWorkshopService,
    private applicationService: ApplicationService,
    private childrenService: ChildrenService,
    private providerService: ProviderService,
    private router: Router,
    private userService: UserService,
    private ratingService: RatingService,
    private favoriteWorkshopsService: FavoriteWorkshopsService,
  ) { }

  @Action(GetWorkshopById)
  getWorkshopById({ patchState }: StateContext<UserStateModel>, { payload }: GetWorkshopById): Observable<Workshop> {
    patchState({ isLoading: true });
    return this.userWorkshopService
      .getWorkshopById(payload)
      .pipe(
        tap((workshop: Workshop) => {
          return patchState({ selectedWorkshop: workshop, isLoading: false });
        }));
  }

  @Action(GetProviderById)
  getProviderById({ patchState }: StateContext<UserStateModel>, { payload }: GetProviderById): Observable<Provider> {
    return this.providerService
      .getProviderById(payload)
      .pipe(
        tap((provider: Provider) => {
          return patchState({ selectedProvider: provider });
        }));
  }

  @Action(GetWorkshopsByProviderId)
  getWorkshopsByProviderId({ patchState }: StateContext<UserStateModel>, { payload }: GetWorkshopsByProviderId): Observable<WorkshopCard[]> {
    patchState({ isLoading: true })
    return this.userWorkshopService
      .getWorkshopsByProviderId(payload)
      .pipe(
        tap((userWorkshops: WorkshopCard[]) => {
          return patchState({ workshops: userWorkshops, isLoading: false });
        }));
  }

  @Action(GetApplicationsByParentId)
  getApplicationsByUserId({ patchState }: StateContext<UserStateModel>, { payload }: GetApplicationsByParentId): Observable<Application[]> {
    patchState({ isLoading: true });
    return this.applicationService
      .getApplicationsByParentId(payload)
      .pipe(
        tap((applications: Application[]) => {
          return patchState({ applications: applications, isLoading: false });
        }));
  }

  @Action(GetApplicationsByProviderId)
  getApplicationsByProviderId({ patchState }: StateContext<UserStateModel>, { id, parameters }: GetApplicationsByProviderId): Observable<Application[]> {
    patchState({ isLoading: true });
    return this.applicationService
      .getApplicationsByProviderId(id, parameters)
      .pipe(
        tap((applications: Application[]) => {
          return patchState({ applications: applications, isLoading: false });
        }));
  }

  @Action(GetUsersChildren)
  getUsersChildren({ patchState, getState }: StateContext<UserStateModel>, { }: GetUsersChildren): Observable<ChildCards> {
    const state: UserStateModel = getState();
    return this.childrenService
      .getUsersChildren(state)
      .pipe(
        tap(
          (children: ChildCards) => patchState({ children: children })
        ))
  }

  @Action(GetAllUsersChildren)
  getAllUsersChildren({ patchState }: StateContext<UserStateModel>, { }: GetAllUsersChildren): Observable<ChildCards> {
    return this.childrenService
      .getAllUsersChildren()
      .pipe(
        tap(
          (children: ChildCards) => patchState({ children: children })
        ))
  }

  @Action(CreateWorkshop)
  createWorkshop({ patchState, dispatch }: StateContext<UserStateModel>, { payload }: CreateWorkshop): Observable<object> {
    patchState({ isLoading: true })
    return this.userWorkshopService
      .createWorkshop(payload)
      .pipe(
        tap((res) => dispatch(new OnCreateWorkshopSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnCreateWorkshopFail(error))))
      );
  }

  @Action(OnCreateWorkshopFail)
  onCreateWorkshopFail({ dispatch, patchState }: StateContext<UserStateModel>, { payload }: OnCreateWorkshopFail): void {
    throwError(payload);
    patchState({ isLoading: false });
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnCreateWorkshopSuccess)
  onCreateWorkshopSuccess({ patchState, dispatch }: StateContext<UserStateModel>, { payload }: OnCreateWorkshopSuccess): void {
    patchState({ isLoading: false })
    dispatch(new MarkFormDirty(false));
    console.log('Workshop is created', payload);
    dispatch(new ShowMessageBar({ message: 'Гурток створено!', type: 'success' }));
    this.router.navigate(['/personal-cabinet/workshops']);
    dispatch([
      new ClearClasses(),
      new ClearDepartments()
    ]);
  }

  @Action(DeleteWorkshopById)
  deleteWorkshop({ dispatch }: StateContext<UserStateModel>, { payload }: DeleteWorkshopById): Observable<object> {
    return this.userWorkshopService
      .deleteWorkshop(payload.workshopId)
      .pipe(
        tap((res) => dispatch(new OnDeleteWorkshopSuccess(payload))),
        catchError((error: Error) => of(dispatch(new OnDeleteWorkshopFail(error))))
      );
  }

  @Action(OnDeleteWorkshopFail)
  onDeleteWorkshopFail({ dispatch }: StateContext<UserStateModel>, { payload }: OnDeleteWorkshopFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnDeleteWorkshopSuccess)
  onDeleteWorkshopSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnDeleteWorkshopSuccess): void {
    console.log('Workshop is deleted', payload);
    dispatch(new ShowMessageBar({ message: `Дякуємо! Гурток "${payload.title}" видалено!`, type: 'success' }));
    dispatch(new GetWorkshopsByProviderId(payload.providerId));
  }

  @Action(CreateChildren)
  createChildren({ dispatch }: StateContext<UserStateModel>, { payload }: CreateChildren): Observable<object> {
    return this.childrenService
      .createChild(payload)
      .pipe(
        tap((res) => dispatch(new OnCreateChildrenSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnCreateChildrenFail(error))))
      );
  }

  @Action(OnCreateChildrenFail)
  onCreateChildrenFail({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateChildrenFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnCreateChildrenSuccess)
  onCreateChildrenSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateChildrenSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Child is created', payload);
    dispatch(new ShowMessageBar({ message: 'Дитина успішно зареєстрована', type: 'success' }));
    this.router.navigate(['/personal-cabinet/parent/info']);
  }

  @Action(CreateProvider)
  createProvider({ dispatch }: StateContext<UserStateModel>, { payload }: CreateProvider): Observable<object> {
    return this.providerService
      .createProvider(payload)
      .pipe(
        tap((res) => dispatch(new OnCreateProviderSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnCreateProviderFail(error))))
      );
  }

  @Action(OnCreateProviderFail)
  onCreateProviderFail({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateProviderFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnCreateProviderSuccess)
  onCreateProviderSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateProviderSuccess): void {
    dispatch(new GetProfile()).subscribe(() => this.router.navigate(['']));
    dispatch(new MarkFormDirty(false));
    console.log('Provider is created', payload);
    dispatch(new ShowMessageBar({ message: 'Організацію успішно створено', type: 'success' }));
  }

  @Action(CreateApplication)
  createApplication({ dispatch }: StateContext<UserStateModel>, { payload }: CreateApplication): Observable<object> {
    return this.applicationService
      .createApplication(payload)
      .pipe(
        tap((res) => dispatch(new OnCreateApplicationSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnCreateApplicationFail(error))))
      );
  }

  @Action(OnCreateApplicationFail)
  onCreateApplicationFail({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateApplicationFail): void {
    throwError(payload);    
    dispatch(new ShowMessageBar({ message: 'Ліміт заяв неревищено (>10), повторіть, будь ласка, спробу пізніше', type: 'error' }));
  }

  @Action(OnCreateApplicationSuccess)
  onCreateApplicationSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateApplicationSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Application is created', payload);
    dispatch(new ShowMessageBar({ message: 'Заявку створено!', type: 'success' }));
    this.router.navigate(['']);
  }

  @Action(DeleteChildById)
  deleteChildById({ dispatch }: StateContext<UserStateModel>, { payload }: DeleteChildById): Observable<object> {
    return this.childrenService
      .deleteChild(payload)
      .pipe(
        tap((res) => dispatch(new OnDeleteChildSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnDeleteChildFail(error))))
      );
  }

  @Action(OnDeleteChildFail)
  onDeleteChildFail({ dispatch }: StateContext<UserStateModel>, { payload }: OnDeleteChildFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnDeleteChildSuccess)
  onDeleteChildSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnDeleteChildSuccess): void {
    console.log('Child is deleted', payload);
    dispatch(new ShowMessageBar({ message: 'Дитину видалено!', type: 'success' }));
    dispatch(new GetUsersChildren());
  }

  @Action(UpdateWorkshop)
  updateWorkshop({ dispatch }: StateContext<UserStateModel>, { payload }: UpdateWorkshop): Observable<object> {
    return this.userWorkshopService
      .updateWorkshop(payload)
      .pipe(
        tap((res) => dispatch(new OnUpdateWorkshopSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnUpdateWorkshopFail(error))))
      );
  }

  @Action(OnUpdateWorkshopFail)
  onUpdateWorkshopFail({ dispatch }: StateContext<UserStateModel>, { payload }: OnUpdateWorkshopFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(UpdateChild)
  updateChild({ dispatch }: StateContext<UserStateModel>, { payload }: UpdateChild): Observable<object> {
    return this.childrenService
      .updateChild(payload)
      .pipe(
        tap((res) => dispatch(new OnUpdateChildSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnUpdateChildFail(error))))
      );
  }


  @Action(OnUpdateChildFail)
  onUpdateChildfail({ dispatch }: StateContext<UserStateModel>, { payload }: OnUpdateChildFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnUpdateWorkshopSuccess)
  onUpdateWorkshopSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnUpdateWorkshopSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Workshop is updated', payload);
    dispatch(new ShowMessageBar({ message: 'Гурток оновлено!', type: 'success' }));
    this.router.navigate(['/personal-cabinet/workshops']);
  }

  @Action(OnUpdateChildSuccess)
  onUpdateChildSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnUpdateChildSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Child is updated', payload);
    dispatch(new ShowMessageBar({ message: 'Дитина успішно відредагована', type: 'success' }));
    this.router.navigate(['/personal-cabinet/parent/info']);
  }

  @Action(UpdateProvider)
  updateProvider({ dispatch }: StateContext<UserStateModel>, { payload }: UpdateProvider): Observable<object> {
    return this.providerService
      .updateProvider(payload)
      .pipe(
        tap((res) => dispatch(new OnUpdateProviderSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnUpdateProviderFail(error))))
      );
  }

  @Action(OnUpdateProviderFail)
  onUpdateProviderfail({ dispatch }: StateContext<UserStateModel>, { payload }: OnUpdateProviderFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnUpdateProviderSuccess)
  onUpdateProviderSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnUpdateProviderSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Provider is updated', payload);
    dispatch([new ShowMessageBar({ message: 'Організація успішно відредагована', type: 'success' }), new GetProfile()]);
    dispatch(new GetProfile()).subscribe(() => this.router.navigate(['/personal-cabinet/provider/info']));
  }

  @Action(UpdateUser)
  updateUser({ dispatch }: StateContext<UserStateModel>, { payload }: UpdateUser): Observable<object> {
    return this.userService
      .updateUser(payload)
      .pipe(
        tap((res) => dispatch(new OnUpdateUserSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnUpdateUserFail(error))))
      );
  }

  @Action(OnUpdateUserFail)
  onUpdateUserFail({ dispatch }: StateContext<UserStateModel>, { payload }: OnUpdateUserFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnUpdateUserSuccess)
  onUpdateUserSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnUpdateUserSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('User is updated', payload);
    dispatch(new ShowMessageBar({ message: 'Особиста інформація успішно відредагована', type: 'success' }));
    dispatch(new CheckAuth());
    this.router.navigate(['/personal-cabinet/config']);
  }


  @Action(UpdateApplication)
  updateApplication({ dispatch }: StateContext<UserStateModel>, { payload }: UpdateApplication): Observable<object> {
    return this.applicationService
      .updateApplication(payload)
      .pipe(
        tap((res) => dispatch(new OnUpdateApplicationSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnCreateApplicationFail(error))))
      );
  }

  @Action(OnUpdateApplicationFail)
  onUpdateApplicationfail({ dispatch }: StateContext<UserStateModel>, { payload }: OnUpdateApplicationFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnUpdateApplicationSuccess)
  onUpdateApplicationSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnUpdateApplicationSuccess): void {
    
    dispatch(new ShowMessageBar({ message: payload.status === ApplicationStatus.Left 
      ? messageStatus.left 
      : messageStatus.approved, type: 'success' }));
    dispatch(new GetApplicationsByParentId(payload.parentId));
  }
  @Action(CreateRating)
  createRating({ dispatch }: StateContext<UserStateModel>, { payload }: CreateRating): Observable<object> {
    return this.ratingService
      .createRate(payload)
      .pipe(
        tap((res) => dispatch(new OnCreateRatingSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnCreateRatingFail(error))))
      );
  }

  @Action(OnCreateRatingFail)
  onCreateRatingFail({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateRatingFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnCreateRatingSuccess)
  onCreateRatingSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateRatingSuccess): void {
    console.log('Rate is created', payload);
    dispatch(new ShowMessageBar({ message: 'Оцінка успішно поставлена!', type: 'success' }));
  }

  @Action(GetFavoriteWorkshops)
  getFavoriteWorkshops({ patchState }: StateContext<UserStateModel>, { }: GetFavoriteWorkshops): Observable<Favorite[]> {
    return this.favoriteWorkshopsService
      .getFavoriteWorkshops()
      .pipe(
        tap((favoriteWorkshop: Favorite[]) => {
          return patchState({ favoriteWorkshops: favoriteWorkshop });
        }));
  }

  @Action(GetFavoriteWorkshopsByUserId)
  getFavoriteWorkshopsByUserId({ patchState }: StateContext<UserStateModel>, { }: GetFavoriteWorkshopsByUserId): Observable<WorkshopFavoriteCard> {
    return this.favoriteWorkshopsService
      .getFavoriteWorkshopsByUserId()
      .pipe(
        tap((favoriteWorkshopCard: WorkshopFavoriteCard) => {
          return patchState({ favoriteWorkshopsCard: favoriteWorkshopCard?.entities });
        }));
  }

  @Action(CreateFavoriteWorkshop)
  createFavoriteWorkshop({ dispatch }: StateContext<UserStateModel>, { payload }: CreateFavoriteWorkshop): Observable<object> {
    return this.favoriteWorkshopsService
      .createFavoriteWorkshop(payload)
      .pipe(tap(() => dispatch([new GetFavoriteWorkshops(), new GetFavoriteWorkshopsByUserId()])))
  }

  @Action(DeleteFavoriteWorkshop)
  deleteFavoriteWorkshop({ dispatch }: StateContext<UserStateModel>, { payload }: DeleteFavoriteWorkshop): Observable<object> {
    return this.favoriteWorkshopsService
      .deleteFavoriteWorkshop(payload)
      .pipe(tap(() => dispatch([new GetFavoriteWorkshops(), new GetFavoriteWorkshopsByUserId()])))
  }

  @Action(CabinetPageChange)
  pageChange({ patchState }: StateContext<UserStateModel>, { payload }: CabinetPageChange): void {
    patchState({ currentPage: payload });
  }

  @Action(ResetSelectedWorkshop)
  ResetSelectedWorkshop({ patchState }: StateContext<UserStateModel>): void {
    patchState({ selectedWorkshop: null });
  }
}
