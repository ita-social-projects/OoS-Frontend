import { Child } from 'src/app/shared/models/child.model';
import { PaginationConstants } from 'src/app/shared/constants/constants';
import { Favorite, WorkshopFavoriteCard } from './../models/favorite.model';
import { FavoriteWorkshopsService } from './../services/workshops/favorite-workshops/favorite-workshops.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, debounceTime } from 'rxjs/operators';
import { ApplicationCards } from '../models/application.model';
import { ChildCards } from '../models/child.model';
import { Provider } from '../models/provider.model';
import { Workshop, WorkshopCard } from '../models/workshop.model';
import { ApplicationService } from '../services/applications/application.service';
import { ChildrenService } from '../services/children/children.service';
import { ProviderService } from '../services/provider/provider.service';
import { RatingService } from '../services/rating/rating.service';
import { UserWorkshopService } from '../services/workshops/user-workshop/user-workshop.service';
import { MarkFormDirty, ShowMessageBar } from './app.actions';
import { PaginationElement } from '../models/paginationElement.model';
import {
  CreateApplication,
  CreateChildren,
  DeleteChildById,
  GetWorkshopsByProviderId,
  OnCreateApplicationFail,
  OnCreateApplicationSuccess,
  OnCreateChildrenFail,
  OnCreateChildrenSuccess,
  OnDeleteChildFail,
  OnDeleteChildSuccess,
  UpdateChild,
  OnUpdateChildFail,
  OnUpdateChildSuccess,
  GetWorkshopById,
  OnGetWorkshopByIdFail,
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
  GetAllUsersChildren,
  OnGetProviderByIdFail,
  ResetProviderWorkshopDetails,
  GetStatusIsAllowToApply,
  GetUsersChildById,
  GetStatusAllowedToReview,
  GetReviewedApplications,
  ResetSelectedChild,
} from './user.actions';
import { ApplicationStatus } from '../enum/applications';
import { messageStatus } from '../enum/messageBar';
import { Util } from '../utils/utils';
import { ProviderAdmin } from '../models/providerAdmin.model';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

export interface UserStateModel {
  isLoading: boolean;
  workshops: WorkshopCard[];
  selectedWorkshop: Workshop;
  selectedProvider: Provider;
  applicationCards: ApplicationCards;
  children: ChildCards;
  selectedChild: Child;
  favoriteWorkshops: Favorite[];
  favoriteWorkshopsCard: WorkshopCard[];
  currentPage: PaginationElement;
  providerAdmins: ProviderAdmin[];
  isAllowChildToApply: boolean;
  isAllowedToReview: boolean;
  isReviewed: boolean;
}
@State<UserStateModel>({
  name: 'user',
  defaults: {
    isLoading: false,
    workshops: null,
    selectedWorkshop: null,
    selectedProvider: null,
    applicationCards: null,
    children: null,
    selectedChild: null,
    favoriteWorkshops: null,
    favoriteWorkshopsCard: null,
    currentPage: PaginationConstants.firstPage,
    providerAdmins: null,
    isAllowChildToApply: true,
    isAllowedToReview: false,
    isReviewed: false,
  },
})
@Injectable()
export class UserState {
  @Selector()
  static isLoading(state: UserStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  static workshops(state: UserStateModel): WorkshopCard[] {
    return state.workshops;
  }

  @Selector()
  static selectedProvider(state: UserStateModel): Provider {
    return state.selectedProvider;
  }

  @Selector()
  static selectedWorkshop(state: UserStateModel): Workshop {
    return state.selectedWorkshop;
  }

  @Selector()
  static selectedChild(state: UserStateModel): Child {
    return state.selectedChild;
  }

  @Selector()
  static applications(state: UserStateModel): ApplicationCards {
    return state.applicationCards;
  }
  @Selector()
  static children(state: UserStateModel): ChildCards {
    return state.children;
  }

  @Selector()
  static favoriteWorkshops(state: UserStateModel): Favorite[] {
    return state.favoriteWorkshops;
  }

  @Selector()
  static favoriteWorkshopsCard(state: UserStateModel): WorkshopCard[] {
    return state.favoriteWorkshopsCard;
  }

  @Selector()
  static isAllowChildToApply(state: UserStateModel): boolean {
    return state.isAllowChildToApply;
  }

  @Selector()
  static isAllowedToReview(state: UserStateModel): boolean {
    return state.isAllowedToReview;
  }

  @Selector()
  static isReviewed(state: UserStateModel): boolean {
    return state.isReviewed;
  }

  constructor(
    private userWorkshopService: UserWorkshopService,
    private applicationService: ApplicationService,
    private childrenService: ChildrenService,
    private providerService: ProviderService,
    private router: Router,
    private ratingService: RatingService,
    private favoriteWorkshopsService: FavoriteWorkshopsService,
    private location: Location
  ) {}

  @Action(GetWorkshopById)
  getWorkshopById(
    { patchState, dispatch }: StateContext<UserStateModel>,
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
    { dispatch, patchState }: StateContext<UserStateModel>,
    { payload }: OnGetWorkshopByIdFail
  ): void {
    throwError(payload);
    patchState({ selectedWorkshop: null, isLoading: false });
    dispatch(new ShowMessageBar({ message: 'Даний гурток видалено', type: 'error' }));
  }

  @Action(GetProviderById)
  getProviderById(
    { patchState, dispatch }: StateContext<UserStateModel>,
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
    { dispatch, patchState }: StateContext<UserStateModel>,
    { payload }: OnGetProviderByIdFail
  ): void {
    throwError(payload);
    patchState({ isLoading: false });
    dispatch(new ShowMessageBar({ message: 'Виникла помилка', type: 'error' }));
  }

  @Action(GetWorkshopsByProviderId)
  getWorkshopsByProviderId(
    { patchState }: StateContext<UserStateModel>,
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
    { patchState }: StateContext<UserStateModel>,
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
    { patchState }: StateContext<UserStateModel>,
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

  @Action(GetUsersChildren)
  getUsersChildren({ patchState }: StateContext<UserStateModel>, {}: GetUsersChildren): Observable<ChildCards> {
    patchState({ isLoading: true });
    return this.childrenService
      .getUsersChildren()
      .pipe(
        tap((children: ChildCards) =>
          patchState(
            children
              ? { children: children, isLoading: false }
              : { children: { totalAmount: 0, entities: [] }, isLoading: false }
          )
        )
      );
  }

  @Action(GetUsersChildById)
  getUsersChildById({ patchState }: StateContext<UserStateModel>, { payload }: GetUsersChildById): Observable<Child> {
    patchState({ isLoading: true });
    return this.childrenService
      .getUsersChildById(payload)
      .pipe(tap((selectedChild: Child) => patchState({ selectedChild: selectedChild, isLoading: false })));
  }

  @Action(GetAllUsersChildren)
  getAllUsersChildren({ patchState }: StateContext<UserStateModel>, {}: GetAllUsersChildren): Observable<ChildCards> {
    patchState({ isLoading: true });
    return this.childrenService
      .getAllUsersChildren()
      .pipe(tap((children: ChildCards) => patchState({ children: children, isLoading: false })));
  }

  @Action(CreateChildren)
  createChildren({ dispatch }: StateContext<UserStateModel>, { payload }: CreateChildren): Observable<object> {
    return this.childrenService.createChild(payload).pipe(
      tap(res => dispatch(new OnCreateChildrenSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnCreateChildrenFail(error))))
    );
  }

  @Action(OnCreateChildrenFail)
  onCreateChildrenFail({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateChildrenFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnCreateChildrenSuccess)
  onCreateChildrenSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateChildrenSuccess): void {
    dispatch([
      new ShowMessageBar({
        message: 'Дякуємо! Дитина була успішно додана.',
        type: 'success',
      }),
      new MarkFormDirty(false),
    ]);
    this.router.navigate(['/personal-cabinet/parent/info']);
  }

  @Action(CreateApplication)
  createApplication({ dispatch }: StateContext<UserStateModel>, { payload }: CreateApplication): Observable<object> {
    return this.applicationService.createApplication(payload).pipe(
      tap(res => dispatch(new OnCreateApplicationSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnCreateApplicationFail(error))))
    );
  }

  @Action(OnCreateApplicationFail)
  onCreateApplicationFail({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateApplicationFail): void {
    throwError(payload);
    dispatch(
      new ShowMessageBar({
        message:
          payload.error.status === 429
            ? `Перевищено ліміт заявок. Спробуйте ще раз через ${Util.secondsToDh(payload.headers.get('retry-after'))}`
            : 'На жаль виникла помилка',
        type: 'error',
        info: payload.error.status === 429 ? 'Користувач може подати не більше 2-х заяв в тиждень на людину' : '',
      })
    );
  }

  @Action(OnCreateApplicationSuccess)
  onCreateApplicationSuccess(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnCreateApplicationSuccess
  ): void {
    dispatch([new ShowMessageBar({ message: 'Заявку створено!', type: 'success' }), new MarkFormDirty(false)]);
    this.router.navigate(['']);
  }

  @Action(DeleteChildById)
  deleteChildById({ dispatch }: StateContext<UserStateModel>, { payload }: DeleteChildById): Observable<object> {
    return this.childrenService.deleteChild(payload).pipe(
      tap(res => dispatch(new OnDeleteChildSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnDeleteChildFail(error))))
    );
  }

  @Action(OnDeleteChildFail)
  onDeleteChildFail({ dispatch }: StateContext<UserStateModel>, { payload }: OnDeleteChildFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnDeleteChildSuccess)
  onDeleteChildSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnDeleteChildSuccess): void {
    dispatch([new ShowMessageBar({ message: 'Дитину видалено!', type: 'success' }), new GetUsersChildren()]);
  }

  @Action(UpdateChild)
  updateChild({ dispatch }: StateContext<UserStateModel>, { payload }: UpdateChild): Observable<object> {
    return this.childrenService.updateChild(payload).pipe(
      tap(res => dispatch(new OnUpdateChildSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnUpdateChildFail(error))))
    );
  }

  @Action(OnUpdateChildFail)
  onUpdateChildfail({ dispatch }: StateContext<UserStateModel>, { payload }: OnUpdateChildFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnUpdateChildSuccess)
  onUpdateChildSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnUpdateChildSuccess): void {
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({
        message: 'Дитина успішно відредагована',
        type: 'success',
      }),
    ]);
    this.location.back();
  }

  @Action(UpdateApplication)
  updateApplication({ dispatch }: StateContext<UserStateModel>, { payload }: UpdateApplication): Observable<object> {
    return this.applicationService.updateApplication(payload).pipe(
      tap(res => dispatch(new OnUpdateApplicationSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnCreateApplicationFail(error))))
    );
  }

  @Action(OnUpdateApplicationFail)
  onUpdateApplicationfail({ dispatch }: StateContext<UserStateModel>, { payload }: OnUpdateApplicationFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnUpdateApplicationSuccess)
  onUpdateApplicationSuccess(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnUpdateApplicationSuccess
  ): void {
    dispatch(
      new ShowMessageBar({
        message: payload.status === ApplicationStatus.Left ? messageStatus.left : messageStatus.approved,
        type: 'success',
      })
    );
  }

  @Action(GetStatusIsAllowToApply)
  getStatusIsAllowToApply(
    { patchState }: StateContext<UserStateModel>,
    { childId, workshopId }: GetStatusIsAllowToApply
  ): Observable<boolean> {
    patchState({ isLoading: true });
    return this.applicationService.getStatusIsAllowToApply(childId, workshopId).pipe(
      tap((status: boolean) => {
        return patchState({ isAllowChildToApply: status, isLoading: false });
      })
    );
  }

  @Action(GetStatusAllowedToReview)
  getApplicationsAllowedToReview(
    { patchState }: StateContext<UserStateModel>,
    { parentId, workshopId }: GetStatusAllowedToReview
  ): Observable<boolean> {
    patchState({ isLoading: true });
    return this.applicationService.getApplicationsAllowedToReview(parentId, workshopId).pipe(
      tap((status: boolean) => {
        return patchState({ isAllowedToReview: status, isLoading: false });
      })
    );
  }

  @Action(GetReviewedApplications)
  getReviewedApplications(
    { patchState }: StateContext<UserStateModel>,
    { parentId, workshopId }: GetReviewedApplications
  ): Observable<boolean> {
    patchState({ isLoading: true });
    return this.applicationService.getReviewedApplications(parentId, workshopId).pipe(
      tap((status: boolean) => {
        return patchState({ isReviewed: status, isLoading: false });
      })
    );
  }

  @Action(CreateRating)
  createRating({ dispatch }: StateContext<UserStateModel>, { payload }: CreateRating): Observable<object> {
    return this.ratingService.createRate(payload).pipe(
      tap(res => dispatch(new OnCreateRatingSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnCreateRatingFail(error))))
    );
  }

  @Action(OnCreateRatingFail)
  onCreateRatingFail({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateRatingFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnCreateRatingSuccess)
  onCreateRatingSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateRatingSuccess): void {
    dispatch(
      new ShowMessageBar({
        message: 'Оцінка успішно поставлена!',
        type: 'success',
      })
    );
  }

  @Action(GetFavoriteWorkshops)
  getFavoriteWorkshops({ patchState }: StateContext<UserStateModel>, {}: GetFavoriteWorkshops): Observable<Favorite[]> {
    return this.favoriteWorkshopsService.getFavoriteWorkshops().pipe(
      tap((favoriteWorkshop: Favorite[]) => {
        return patchState({ favoriteWorkshops: favoriteWorkshop });
      })
    );
  }

  @Action(GetFavoriteWorkshopsByUserId)
  getFavoriteWorkshopsByUserId(
    { patchState }: StateContext<UserStateModel>,
    {}: GetFavoriteWorkshopsByUserId
  ): Observable<WorkshopFavoriteCard> {
    return this.favoriteWorkshopsService.getFavoriteWorkshopsByUserId().pipe(
      tap((favoriteWorkshopCard: WorkshopFavoriteCard) => {
        return patchState({
          favoriteWorkshopsCard: favoriteWorkshopCard?.entities,
        });
      })
    );
  }

  @Action(CreateFavoriteWorkshop)
  createFavoriteWorkshop(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: CreateFavoriteWorkshop
  ): Observable<object> {
    return this.favoriteWorkshopsService.createFavoriteWorkshop(payload).pipe(
      debounceTime(2000),
      tap(() => dispatch(new GetFavoriteWorkshops()))
    );
  }

  @Action(DeleteFavoriteWorkshop)
  deleteFavoriteWorkshop(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: DeleteFavoriteWorkshop
  ): Observable<object> {
    return this.favoriteWorkshopsService.deleteFavoriteWorkshop(payload).pipe(
      debounceTime(2000),
      tap(() => dispatch(new GetFavoriteWorkshops()))
    );
  }

  @Action(ResetProviderWorkshopDetails)
  clearProviderWorkshopDetails({ patchState }: StateContext<UserStateModel>): void {
    patchState({ selectedWorkshop: null, selectedProvider: null });
  }

  @Action(ResetSelectedChild)
  resetSelectedChild({ patchState }: StateContext<UserStateModel>): void {
    patchState({ selectedChild: null });
  }
}
