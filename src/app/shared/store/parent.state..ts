import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, debounceTime, tap } from 'rxjs/operators';
import { Child, ChildCards } from '../models/child.model';
import { Favorite, WorkshopFavoriteCard } from '../models/favorite.model';
import { WorkshopCard } from '../models/workshop.model';
import { ApplicationService } from '../services/applications/application.service';
import { ChildrenService } from '../services/children/children.service';
import { FavoriteWorkshopsService } from '../services/workshops/favorite-workshops/favorite-workshops.service';
import { MarkFormDirty, ShowMessageBar } from './app.actions';
import {
  CreateApplication,
  CreateChildren,
  CreateFavoriteWorkshop,
  CreateRating,
  DeleteChildById,
  DeleteFavoriteWorkshop,
  GetAllUsersChildren,
  GetAllUsersChildrenByParentId,
  GetFavoriteWorkshops,
  GetFavoriteWorkshopsByUserId,
  GetReviewedApplications,
  GetStatusAllowedToReview,
  GetStatusIsAllowToApply,
  GetUsersChildById,
  GetUsersChildren,
  OnCreateApplicationFail,
  OnCreateApplicationSuccess,
  OnCreateChildrenFail,
  OnCreateChildrenSuccess,
  OnCreateRatingFail,
  OnCreateRatingSuccess,
  OnDeleteChildFail,
  OnDeleteChildSuccess,
  OnUpdateChildFail,
  OnUpdateChildSuccess,
  ResetSelectedChild,
  UpdateChild,
} from './parent.actions';
import { Location } from '@angular/common';
import { RatingService } from '../services/rating/rating.service';
import { Util } from '../utils/utils';
import { Truncated } from '../models/truncated.model';

export interface ParentStateModel {
  isLoading: boolean;
  isAllowChildToApply: boolean;
  isAllowedToReview: boolean;
  isReviewed: boolean;
  favoriteWorkshops: Favorite[];
  favoriteWorkshopsCard: WorkshopCard[];
  children: ChildCards;
  truncated: Truncated[];
  selectedChild: Child;
}

@State<ParentStateModel>({
  name: 'parent',
  defaults: {
    isLoading: false,
    isAllowChildToApply: true,
    isAllowedToReview: false,
    isReviewed: false,
    favoriteWorkshops: null,
    favoriteWorkshopsCard: null,
    children: null,
    truncated: null,
    selectedChild: null,
  },
})
@Injectable()
export class ParentState {
  @Selector()
  static isLoading(state: ParentStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  static isAllowChildToApply(state: ParentStateModel): boolean {
    return state.isAllowChildToApply;
  }

  @Selector()
  static isAllowedToReview(state: ParentStateModel): boolean {
    return state.isAllowedToReview;
  }

  @Selector()
  static isReviewed(state: ParentStateModel): boolean {
    return state.isReviewed;
  }

  @Selector()
  static favoriteWorkshops(state: ParentStateModel): Favorite[] {
    return state.favoriteWorkshops;
  }

  @Selector()
  static favoriteWorkshopsCard(state: ParentStateModel): WorkshopCard[] {
    return state.favoriteWorkshopsCard;
  }

  @Selector()
  static selectedChild(state: ParentStateModel): Child {
    return state.selectedChild;
  }

  @Selector()
  static children(state: ParentStateModel): ChildCards {
    return state.children;
  }

  @Selector()
  static truncated(state: ParentStateModel): Truncated[] {
    return state.truncated;
  }

  constructor(
    private applicationService: ApplicationService,
    private favoriteWorkshopsService: FavoriteWorkshopsService,
    private childrenService: ChildrenService,
    private router: Router,
    private location: Location,
    private ratingService: RatingService
  ) {}

  @Action(GetStatusIsAllowToApply)
  getStatusIsAllowToApply(
    { patchState }: StateContext<ParentStateModel>,
    { childId, workshopId }: GetStatusIsAllowToApply
  ): Observable<boolean> {
    patchState({ isLoading: true });
    return this.applicationService
      .getStatusIsAllowToApply(childId, workshopId)
      .pipe(tap((status: boolean) => patchState({ isAllowChildToApply: status, isLoading: false })));
  }

  @Action(GetStatusAllowedToReview)
  getApplicationsAllowedToReview(
    { patchState }: StateContext<ParentStateModel>,
    { parentId, workshopId }: GetStatusAllowedToReview
  ): Observable<boolean> {
    patchState({ isLoading: true });
    return this.applicationService
      .getApplicationsAllowedToReview(parentId, workshopId)
      .pipe(tap((status: boolean) => patchState({ isAllowedToReview: status, isLoading: false })));
  }

  @Action(GetReviewedApplications)
  getReviewedApplications(
    { patchState }: StateContext<ParentStateModel>,
    { parentId, workshopId }: GetReviewedApplications
  ): Observable<boolean> {
    patchState({ isLoading: true });
    return this.applicationService
      .getReviewedApplications(parentId, workshopId)
      .pipe(tap((status: boolean) => patchState({ isReviewed: status, isLoading: false })));
  }

  @Action(GetFavoriteWorkshops)
  getFavoriteWorkshops(
    { patchState }: StateContext<ParentStateModel>,
    {}: GetFavoriteWorkshops
  ): Observable<Favorite[]> {
    return this.favoriteWorkshopsService
      .getFavoriteWorkshops()
      .pipe(tap((favoriteWorkshop: Favorite[]) => patchState({ favoriteWorkshops: favoriteWorkshop })));
  }

  @Action(GetFavoriteWorkshopsByUserId)
  getFavoriteWorkshopsByUserId(
    { patchState }: StateContext<ParentStateModel>,
    {}: GetFavoriteWorkshopsByUserId
  ): Observable<WorkshopFavoriteCard> {
    return this.favoriteWorkshopsService
      .getFavoriteWorkshopsByUserId()
      .pipe(
        tap((favoriteWorkshopCard: WorkshopFavoriteCard) =>
          patchState({ favoriteWorkshopsCard: favoriteWorkshopCard?.entities })
        )
      );
  }

  @Action(CreateFavoriteWorkshop)
  createFavoriteWorkshop(
    { dispatch }: StateContext<ParentStateModel>,
    { payload }: CreateFavoriteWorkshop
  ): Observable<object> {
    return this.favoriteWorkshopsService.createFavoriteWorkshop(payload).pipe(
      debounceTime(2000),
      tap(() => dispatch(new GetFavoriteWorkshops()))
    );
  }

  @Action(DeleteFavoriteWorkshop)
  deleteFavoriteWorkshop(
    { dispatch }: StateContext<ParentStateModel>,
    { payload }: DeleteFavoriteWorkshop
  ): Observable<object> {
    return this.favoriteWorkshopsService.deleteFavoriteWorkshop(payload).pipe(
      debounceTime(2000),
      tap(() => dispatch(new GetFavoriteWorkshops()))
    );
  }

  @Action(GetUsersChildren)
  getUsersChildren({ patchState }: StateContext<ParentStateModel>, {}: GetUsersChildren): Observable<ChildCards> {
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
  getUsersChildById({ patchState }: StateContext<ParentStateModel>, { payload }: GetUsersChildById): Observable<Child> {
    patchState({ isLoading: true });
    return this.childrenService
      .getUsersChildById(payload)
      .pipe(tap((selectedChild: Child) => patchState({ selectedChild: selectedChild, isLoading: false })));
  }

  @Action(GetAllUsersChildren)
  getAllUsersChildren({ patchState }: StateContext<ParentStateModel>, {}: GetAllUsersChildren): Observable<ChildCards> {
    patchState({ isLoading: true });
    return this.childrenService
      .getAllUsersChildren()
      .pipe(tap((children: ChildCards) => patchState({ children: children, isLoading: false })));
  }

  @Action(GetAllUsersChildrenByParentId)
  getAllUsersChildrenByParentId({ patchState }: StateContext<ParentStateModel>, { payload }: GetAllUsersChildrenByParentId): Observable<Truncated[]> {
    patchState({ isLoading: true });
    return this.childrenService
      .getUsersChildrenByParentId(payload)
      .pipe(tap((trunckated: Truncated[]) => patchState({ truncated: trunckated, isLoading: false })));
  }

  @Action(DeleteChildById)
  deleteChildById({ dispatch }: StateContext<ParentStateModel>, { payload }: DeleteChildById): Observable<object> {
    return this.childrenService.deleteChild(payload).pipe(
      tap(res => dispatch(new OnDeleteChildSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnDeleteChildFail(error))))
    );
  }

  @Action(OnDeleteChildFail)
  onDeleteChildFail({ dispatch }: StateContext<ParentStateModel>, { payload }: OnDeleteChildFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnDeleteChildSuccess)
  onDeleteChildSuccess({ dispatch }: StateContext<ParentStateModel>, { payload }: OnDeleteChildSuccess): void {
    dispatch([new ShowMessageBar({ message: 'Дитину видалено!', type: 'success' }), new GetUsersChildren()]);
  }

  @Action(UpdateChild)
  updateChild({ dispatch }: StateContext<ParentStateModel>, { payload }: UpdateChild): Observable<object> {
    return this.childrenService.updateChild(payload).pipe(
      tap(res => dispatch(new OnUpdateChildSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnUpdateChildFail(error))))
    );
  }

  @Action(OnUpdateChildFail)
  onUpdateChildfail({ dispatch }: StateContext<ParentStateModel>, { payload }: OnUpdateChildFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnUpdateChildSuccess)
  onUpdateChildSuccess({ dispatch }: StateContext<ParentStateModel>, { payload }: OnUpdateChildSuccess): void {
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({
        message: 'Дитина успішно відредагована',
        type: 'success',
      }),
    ]);
    this.location.back();
  }

  @Action(CreateChildren)
  createChildren({ dispatch }: StateContext<ParentStateModel>, { payload }: CreateChildren): Observable<object> {
    return this.childrenService.createChild(payload).pipe(
      tap(res => dispatch(new OnCreateChildrenSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnCreateChildrenFail(error))))
    );
  }

  @Action(OnCreateChildrenFail)
  onCreateChildrenFail({ dispatch }: StateContext<ParentStateModel>, { payload }: OnCreateChildrenFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnCreateChildrenSuccess)
  onCreateChildrenSuccess({ dispatch }: StateContext<ParentStateModel>, { payload }: OnCreateChildrenSuccess): void {
    dispatch([
      new ShowMessageBar({
        message: 'Дякуємо! Дитина була успішно додана.',
        type: 'success',
      }),
      new MarkFormDirty(false),
    ]);
    this.router.navigate(['/personal-cabinet/parent/info']);
  }

  @Action(ResetSelectedChild)
  resetSelectedChild({ patchState }: StateContext<ParentStateModel>): void {
    patchState({ selectedChild: null });
  }

  @Action(CreateRating)
  createRating({ dispatch }: StateContext<ParentStateModel>, { payload }: CreateRating): Observable<object> {
    return this.ratingService.createRate(payload).pipe(
      tap(res => dispatch(new OnCreateRatingSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnCreateRatingFail(error))))
    );
  }

  @Action(OnCreateRatingFail)
  onCreateRatingFail({ dispatch }: StateContext<ParentStateModel>, { payload }: OnCreateRatingFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnCreateRatingSuccess)
  onCreateRatingSuccess({ dispatch }: StateContext<ParentStateModel>, { payload }: OnCreateRatingSuccess): void {
    dispatch(
      new ShowMessageBar({
        message: 'Оцінка успішно поставлена!',
        type: 'success',
      })
    );
  }

  @Action(CreateApplication)
  createApplication({ dispatch }: StateContext<ParentStateModel>, { payload }: CreateApplication): Observable<object> {
    return this.applicationService.createApplication(payload).pipe(
      tap(res => dispatch(new OnCreateApplicationSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnCreateApplicationFail(error))))
    );
  }

  @Action(OnCreateApplicationFail)
  onCreateApplicationFail({ dispatch }: StateContext<ParentStateModel>, { payload }: OnCreateApplicationFail): void {
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
    { dispatch }: StateContext<ParentStateModel>,
    { payload }: OnCreateApplicationSuccess
  ): void {
    dispatch([new ShowMessageBar({ message: 'Заявку створено!', type: 'success' }), new MarkFormDirty(false)]);
    this.router.navigate(['']);
  }
}
