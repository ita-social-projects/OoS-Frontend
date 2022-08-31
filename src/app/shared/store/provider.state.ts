import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Achievement } from '../models/achievement.model';
import { ChildCards } from '../models/child.model';
import { AchievementsService } from '../services/achievements/achievements.service';
import { MarkFormDirty, ShowMessageBar } from './app.actions';
import {
  CreateAchievement,
  DeleteAchievementById,
  GetAchievementById,
  GetAchievementsByWorkshopId,
  GetChildrenByWorkshopId,
  OnCreateAchievementFail,
  OnCreateAchievementSuccess,
  OnDeleteAchievementFail,
  OnDeleteAchievementSuccess,
  OnUpdateAchievementFail,
  OnUpdateAchievementSuccess,
  UpdateAchievement,
} from './provider.actions';

export interface ProviderStateModel {
  isLoading: boolean;
  achievements: Achievement[];
  selectedAchievement: Achievement;
  approvedChildren: ChildCards;
}

@State<ProviderStateModel>({
  name: 'provider',
  defaults: {
    isLoading: false,
    approvedChildren: null,
    achievements: null,
    selectedAchievement: null,
  },
})
@Injectable()
export class ProviderState {
  @Selector()
  static isLoading(state: ProviderStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  static approvedChildren(state: ProviderStateModel): ChildCards {
    return state.approvedChildren;
  }

  @Selector()
  static achievements(state: ProviderStateModel): Achievement[] {
    return state.achievements;
  }

  @Selector()
  static selectedAchievement(state: ProviderStateModel): Achievement {
    return state.selectedAchievement;
  }

  constructor(private achievementsService: AchievementsService, private router: Router) {}

  @Action(GetAchievementById)
  getAchievementById(
    { patchState }: StateContext<ProviderStateModel>,
    { payload }: GetAchievementById
  ): Observable<Achievement> {
    patchState({ isLoading: true });
    return this.achievementsService
      .getAchievementById(payload)
      .pipe(tap((achievement: Achievement) => patchState({ selectedAchievement: achievement, isLoading: false })));
  }

  @Action(GetAchievementsByWorkshopId)
  getAchievementsByWorkshopId(
    { patchState }: StateContext<ProviderStateModel>,
    { payload }: GetAchievementsByWorkshopId
  ): Observable<Achievement[]> {
    patchState({ isLoading: true });
    return this.achievementsService
      .getAchievementsByWorkshopId(payload)
      .pipe(tap((achievements: Achievement[]) => patchState({ achievements: achievements, isLoading: false })));
  }

  @Action(GetChildrenByWorkshopId)
  getChildrenByWorkshopId(
    { patchState }: StateContext<ProviderStateModel>,
    { payload }: GetChildrenByWorkshopId
  ): Observable<ChildCards> {
    patchState({ isLoading: true });
    return this.achievementsService.getChildrenByWorkshopId(payload).pipe(
      tap((approvedChildren: ChildCards) => {
        return patchState(
          approvedChildren
            ? { approvedChildren: approvedChildren, isLoading: false }
            : { approvedChildren: { totalAmount: 0, entities: [] }, isLoading: false }
        );
      })
    );
  }

  @Action(CreateAchievement)
  createAchievement(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: CreateAchievement
  ): Observable<void | Achievement> {
    return this.achievementsService.createAchievement(payload).pipe(
      tap((res: Achievement) => dispatch(new OnCreateAchievementSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new OnCreateAchievementFail(error)))
    );
  }

  @Action(OnCreateAchievementSuccess)
  onCreateAchievementSuccess(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: OnCreateAchievementSuccess
  ): void {
    dispatch([new ShowMessageBar({ message: 'Новe Досягнення додано!', type: 'success' }), new MarkFormDirty(false)]);
    this.router.navigate(['/details/workshop/', payload.workshopId]);
  }

  @Action(OnCreateAchievementFail)
  onCreateAchievementFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnCreateAchievementFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(UpdateAchievement)
  updateAchievement(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: UpdateAchievement
  ): Observable<void | Achievement> {
    return this.achievementsService.updateAchievement(payload).pipe(
      tap((res: Achievement) => dispatch(new OnCreateAchievementSuccess(res))),
      catchError((error: HttpErrorResponse) => dispatch(new OnCreateAchievementFail(error)))
    );
  }

  @Action(OnUpdateAchievementSuccess)
  onUpdateAchievementSuccess(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: OnUpdateAchievementSuccess
  ): void {
    dispatch([
      new ShowMessageBar({ message: 'Досягненян успішно відредаговано!', type: 'success' }),
      new MarkFormDirty(false),
    ]);
    this.router.navigate(['/details/workshop/', payload.workshopId]);
  }

  @Action(OnUpdateAchievementFail)
  onUpdateAchievementFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateAchievementFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(DeleteAchievementById)
  deleteAchievementById(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: DeleteAchievementById
  ): Observable<object> {
    return this.achievementsService.deleteAchievement(payload).pipe(
      tap((res: HttpErrorResponse) => dispatch(new OnDeleteAchievementSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnDeleteAchievementFail(error))))
    );
  }

  @Action(OnDeleteAchievementSuccess)
  onDeleteAchievementSuccess(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: OnDeleteAchievementSuccess
  ): void {
    dispatch([new ShowMessageBar({ message: 'Досягнення видалено!', type: 'success' })]);
    this.router.navigate(['/details/workshop', payload.workshopId]);
  }
}
