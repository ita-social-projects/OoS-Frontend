import { Constants } from 'src/app/shared/constants/constants';
import { WorkshopCard, WorkshopFilterCard } from 'src/app/shared/models/workshop.model';
import { Favorite, WorkshopFavoriteCard } from './../models/favorite.model';
import { FavoriteWorkshopsService } from './../services/workshops/favorite-workshops/favorite-workshops.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Application, ApplicationCards } from '../models/application.model';
import { ChildCards } from '../models/child.model';
import { Provider } from '../models/provider.model';
import { Workshop } from '../models/workshop.model';
import { ApplicationService } from '../services/applications/application.service';
import { ChildrenService } from '../services/children/children.service';
import { ProviderService } from '../services/provider/provider.service';
import { ProviderAdminService } from '../services/provider-admins/provider-admin.service';
import { RatingService } from '../services/rating/rating.service';
import { UserService } from '../services/user/user.service';
import { UserWorkshopService } from '../services/workshops/user-workshop/user-workshop.service';
import { MarkFormDirty, ShowMessageBar } from './app.actions';
import { CheckAuth, GetProfile } from './registration.actions';
import { ClearClasses, ClearDepartments } from './meta-data.actions';
import { PaginationElement } from '../models/paginationElement.model';
import {
  CreateApplication,
  CreateAchievement,
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
  GetAllProviderAdmins,
  CreateProviderAdmin,
  OnCreateProviderAdminFail,
  OnCreateProviderAdminSuccess,
  DeleteProviderAdminById,
  OnDeleteProviderAdminFail,
  OnDeleteProviderAdminSuccess,
  BlockProviderAdminById,
  OnBlockProviderAdminFail,
  OnBlockProviderAdminSuccess,
  OnGetProviderByIdFail,
  ResetProviderWorkshopDetails,
  BlockParent,
  BlockParentFail,
  BlockParentSuccess,
  GetBlockedParents,
  UnBlockParent,
  UnBlockParentFail,
  UnBlockParentSuccess,
  OnCreateAchievementSuccess,
  OnCreateAchievementFail,
  GetAchievementsByWorkshopId,
  GetStatusIsAllowToApply,
} from './user.actions';
import { ApplicationStatus } from '../enum/applications';
import { messageStatus } from '../enum/messageBar';
import { Util } from '../utils/utils';
import { ProviderAdmin } from '../models/providerAdmin.model';
import { Location } from '@angular/common';
import { BlockService } from '../services/block/block.service';
import { BlockedParent } from '../models/block.model';
import { Achievement } from '../models/achievement.model';
import { AchievementsService } from '../services/achievements/achievements.service';
import { Parent } from '../models/parent.model';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';

export interface UserStateModel {
  isLoading: boolean;
  workshops: WorkshopCard[];
  selectedWorkshop: Workshop;
  selectedProvider: Provider;
  applicationCards: ApplicationCards;
  achievements: Achievement[];
  children: ChildCards;
  favoriteWorkshops: Favorite[];
  favoriteWorkshopsCard: WorkshopCard[];
  currentPage: PaginationElement;
  providerAdmins: ProviderAdmin[];
  blockedParents: BlockedParent;
  blockedParent: BlockedParent;
  isAllowChildToApply: boolean;
}
@State<UserStateModel>({
  name: 'user',
  defaults: {
    isLoading: false,
    workshops: null,
    selectedWorkshop: null,
    selectedProvider: null,
    applicationCards: null,
    achievements: null,
    children: undefined,
    favoriteWorkshops: null,
    favoriteWorkshopsCard: null,
    currentPage: {
      element: 1,
      isActive: true,
    },
    providerAdmins: null,
    blockedParents: null,
    blockedParent: null,
    isAllowChildToApply: true,
  },

})
@Injectable()
export class UserState {
  postUrl = '/Workshop/Create';
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
  static applications(state: UserStateModel): ApplicationCards {
    return state.applicationCards; }


  @Selector()
  static achievements(state: UserStateModel): Achievement[] {
    return state.achievements;
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
  static providerAdmins(state: UserStateModel): ProviderAdmin[] {
    return state.providerAdmins;
  }

  @Selector()
  static isAllowChildToApply(state: UserStateModel): boolean {
    return state.isAllowChildToApply;
  }

  @Selector()
  static blockedParents(state: UserStateModel): BlockedParent { return state.blockedParents; }

  @Selector()
  static blockedParent(state: UserStateModel): BlockedParent { return state.blockedParent; }

  constructor(
    private userWorkshopService: UserWorkshopService,
    private applicationService: ApplicationService,
    private childrenService: ChildrenService,
    private providerService: ProviderService,
    private providerAdminService: ProviderAdminService,
    private achievementsService: AchievementsService,
    private router: Router,
    private userService: UserService,
    private ratingService: RatingService,
    private favoriteWorkshopsService: FavoriteWorkshopsService,
    private blockService: BlockService,
    private location: Location
  ) {}

  @Action(GetWorkshopById)
  getWorkshopById(
    { patchState, dispatch }: StateContext<UserStateModel>,
    { payload }: GetWorkshopById
  ): Observable<object> {
    patchState({ isLoading: true });
    return this.userWorkshopService.getWorkshopById(payload).pipe(
      tap((workshop: Workshop) =>
        patchState({ selectedWorkshop: workshop, isLoading: false })
      ),
      catchError((error: HttpErrorResponse) =>
        of(dispatch(new OnGetWorkshopByIdFail(error)))
      )
    );
  }

  @Action(OnGetWorkshopByIdFail)
  onGetWorkshopByIdFail(
    { dispatch, patchState }: StateContext<UserStateModel>,
    { payload }: OnGetWorkshopByIdFail
  ): void {
    throwError(payload);
    patchState({ selectedWorkshop: null, isLoading: false });
    dispatch(
      new ShowMessageBar({ message: 'Даний гурток видалено', type: 'error' })
    );
  }

  @Action(GetAchievementsByWorkshopId)
  getAchievementsByWorkshopId(
    { patchState }: StateContext<UserStateModel>,
    { payload }: GetAchievementsByWorkshopId
  ): Observable<Achievement[]> {
    patchState({ isLoading: true });
    return this.achievementsService.getAchievementsByWorkshopId(payload).pipe(
      tap((achievements: Achievement[]) => {
        return patchState({ achievements: achievements, isLoading: false });
      })
    );
  }

  @Action(GetProviderById)
  getProviderById(
    { patchState, dispatch }: StateContext<UserStateModel>,
    { payload }: GetProviderById
  ): Observable<object> {
    patchState({ isLoading: true });
    return this.providerService.getProviderById(payload).pipe(
      tap((provider: Provider) =>
        patchState({ selectedProvider: provider, isLoading: false })
      ),
      catchError((error: HttpErrorResponse) =>
        of(dispatch(new OnGetProviderByIdFail(error)))
      )
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
    { payload }: GetWorkshopsByProviderId
  ): Observable<WorkshopCard[]> {
    patchState({ isLoading: true });
    return this.userWorkshopService.getWorkshopsByProviderId(payload).pipe(
      tap((userWorkshops: WorkshopCard[]) => {
        return patchState({ workshops: userWorkshops, isLoading: false });
      })
    );
  }

  @Action(GetApplicationsByParentId)
  getApplicationsByParentId({ patchState }: StateContext<UserStateModel>, { id, parameters }: GetApplicationsByParentId): Observable<ApplicationCards> {
    patchState({ isLoading: true });
    return this.applicationService
      .getApplicationsByParentId(id, parameters)
      .pipe(
        tap((applicationCards: ApplicationCards) =>
        patchState(applicationCards ? { applicationCards: applicationCards, isLoading: false } : { applicationCards: {totalAmount: 0, entities: []}, isLoading: false }),));
      }

  @Action(GetApplicationsByProviderId)
  getApplicationsByProviderId({ patchState }: StateContext<UserStateModel>, { id, parameters }: GetApplicationsByProviderId): Observable<ApplicationCards> {
    patchState({ isLoading: true });
    return this.applicationService
      .getApplicationsByProviderId(id, parameters)
      .pipe(
        tap((applicationCards: ApplicationCards) =>
        patchState(applicationCards ? { applicationCards: applicationCards, isLoading: false } : { applicationCards: {totalAmount: 0, entities: []}, isLoading: false }),));
        }

  @Action(GetAllProviderAdmins)
  getAllProviderAdmins(
    { patchState }: StateContext<UserStateModel>,
    {}: GetAllProviderAdmins
  ): Observable<ProviderAdmin[]> {
    patchState({ isLoading: true });
    return this.providerAdminService
      .getAllProviderAdmins()
      .pipe(
        tap((providerAdmins: ProviderAdmin[]) =>
          patchState({ providerAdmins: providerAdmins, isLoading: false })
        )
      );
  }

  @Action(GetUsersChildren)
  getUsersChildren(
    { patchState, getState }: StateContext<UserStateModel>,
    {}: GetUsersChildren
  ): Observable<ChildCards> {
    patchState({ isLoading: true });
    const state: UserStateModel = getState();
    return this.childrenService
      .getUsersChildren(state)
      .pipe(tap((children: ChildCards) => patchState({ children: children, isLoading: false })));
  }

  @Action(GetAllUsersChildren)
  getAllUsersChildren(
    { patchState }: StateContext<UserStateModel>,
    {}: GetAllUsersChildren
  ): Observable<ChildCards> {
    patchState({ isLoading: true });
    return this.childrenService
      .getAllUsersChildren()
      .pipe(tap((children: ChildCards) => patchState({ children: children, isLoading: false })));
  }

  @Action(CreateWorkshop)
  createWorkshop(
    { patchState, dispatch }: StateContext<UserStateModel>,
    { payload }: CreateWorkshop
  ): Observable<object> {
    patchState({ isLoading: true });
    return this.userWorkshopService.createWorkshop(payload).pipe(
      tap((res) => dispatch(new OnCreateWorkshopSuccess(res))),
      catchError((error: HttpErrorResponse) =>
        of(dispatch(new OnCreateWorkshopFail(error)))
      )
    );
  }

  @Action(OnCreateWorkshopFail)
  onCreateWorkshopFail(
    { dispatch, patchState }: StateContext<UserStateModel>,
    { payload }: OnCreateWorkshopFail
  ): void {
    throwError(payload);
    patchState({ isLoading: false });
    dispatch(
      new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' })
    );
  }

  @Action(OnCreateWorkshopSuccess)
  onCreateWorkshopSuccess(
    { patchState, dispatch }: StateContext<UserStateModel>,
    { payload }: OnCreateWorkshopSuccess
  ): void {
    const message = Util.getWorkshopMessage(payload);
    patchState({ isLoading: false });
    dispatch(new MarkFormDirty(false));
    console.log('Workshop is created', payload);
    dispatch(new ShowMessageBar({ message: message.text, type: message.type }));
    this.router.navigate(['/personal-cabinet/workshops']);
    dispatch([new ClearClasses(), new ClearDepartments()]);
  }

  @Action(DeleteWorkshopById)
  deleteWorkshop(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: DeleteWorkshopById
  ): Observable<object> {
    return this.userWorkshopService.deleteWorkshop(payload.workshopId).pipe(
      tap((res) => dispatch(new OnDeleteWorkshopSuccess(payload))),
      catchError((error: HttpErrorResponse) =>
        of(dispatch(new OnDeleteWorkshopFail(error)))
      )
    );
  }

  @Action(OnDeleteWorkshopFail)
  onDeleteWorkshopFail(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnDeleteWorkshopFail
  ): void {
    throwError(payload);
    dispatch(
      new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' })
    );
  }

  @Action(OnDeleteWorkshopSuccess)
  onDeleteWorkshopSuccess(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnDeleteWorkshopSuccess
  ): void {
    console.log('Workshop is deleted', payload);
    dispatch([
      new ShowMessageBar({
        message: `Дякуємо! Гурток "${payload.title}" видалено!`,
        type: 'success',
      }),
      new GetWorkshopsByProviderId(payload.providerId),
    ]);
  }

  @Action(CreateChildren)
  createChildren(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: CreateChildren
  ): Observable<object> {
    return this.childrenService.createChild(payload).pipe(
      tap((res) => dispatch(new OnCreateChildrenSuccess(res))),
      catchError((error: HttpErrorResponse) =>
        of(dispatch(new OnCreateChildrenFail(error)))
      )
    );
  }

  @Action(OnCreateChildrenFail)
  onCreateChildrenFail(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnCreateChildrenFail
  ): void {
    throwError(payload);
    dispatch(
      new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' })
    );
  }

  @Action(OnCreateChildrenSuccess)
  onCreateChildrenSuccess(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnCreateChildrenSuccess
  ): void {
    console.log('Child is created', payload);
    dispatch([
      new ShowMessageBar({
        message: 'Дякуємо! Дитина була успішно додана.',
        type: 'success',
      }),
      new MarkFormDirty(false),
    ]);
    this.router.navigate(['/personal-cabinet/parent/info']);
  }

  @Action(CreateProvider)
  createProvider(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: CreateProvider
  ): Observable<object> {
    return this.providerService.createProvider(payload).pipe(
      tap((res) => dispatch(new OnCreateProviderSuccess(res))),
      catchError((error) => of(dispatch(new OnCreateProviderFail(error))))
    );
  }

  @Action(OnCreateProviderFail)
  onCreateProviderFail(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnCreateProviderFail
  ): void {
    throwError(payload);
    const message =
      payload.error === Constants.UNABLE_CREATE_PROVIDER || Constants.UNABLE_CREATE_PROVIDER + Constants.THERE_IS_SUCH_DATA
        ? 'Перевірте введені дані. Електрона пошта, номер телефону та ІПН/ЄДПРО мають бути унікальними'
        : 'На жаль виникла помилка';
    dispatch(new ShowMessageBar({ message, type: 'error' }));
  }

  @Action(OnCreateProviderSuccess)
  onCreateProviderSuccess(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnCreateProviderSuccess
  ): void {
    dispatch(new GetProfile()).subscribe(() => this.router.navigate(['']));
    console.log('Provider is created', payload);
    dispatch([
      new ShowMessageBar({
        message: 'Організацію успішно створено',
        type: 'success',
      }),
      new MarkFormDirty(false),
    ]);
  }

  @Action(CreateProviderAdmin)
  createProviderAdmin(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: CreateProviderAdmin
  ): Observable<object> {
    return this.providerAdminService.createProviderAdmin(payload).pipe(
      tap((res) => dispatch(new OnCreateProviderAdminSuccess(res))),
      catchError((error: HttpErrorResponse) =>
        of(dispatch(new OnCreateProviderAdminFail(error)))
      )
    );
  }

  @Action(OnCreateProviderAdminFail)
  onCreateProviderAdminFail(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnCreateProviderAdminFail
  ): void {
    throwError(payload);
    dispatch(
      new ShowMessageBar({
        message: 'На жаль виникла помилка при створенні користувача',
        type: 'error',
      })
    );
  }

  @Action(OnCreateProviderAdminSuccess)
  onCreateProviderAdminSuccess(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnCreateProviderAdminSuccess
  ): void {
    dispatch([
      new ShowMessageBar({
        message: 'Користувача успішно створено',
        type: 'success',
      }),
      new MarkFormDirty(false),
    ]);
    this.router.navigate(['/personal-cabinet/administration']);
  }

  @Action(BlockProviderAdminById)
  blockProviderAdmin(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: BlockProviderAdminById
  ): Observable<object> {
    return this.providerAdminService
      .blockProviderAdmin(payload.userId, payload.providerId)
      .pipe(
        tap((res) => dispatch(new OnBlockProviderAdminSuccess(payload))),
        catchError((error: HttpErrorResponse) =>
          of(dispatch(new OnBlockProviderAdminFail(error)))
        )
      );
  }

  @Action(OnBlockProviderAdminFail)
  onBlockProviderAdminFail(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnBlockProviderAdminFail
  ): void {
    throwError(payload);
    dispatch(
      new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' })
    );
  }

  @Action(OnBlockProviderAdminSuccess)
  onBlockProviderAdminSuccess(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnBlockProviderAdminSuccess
  ): void {
    dispatch([
      new GetAllProviderAdmins(),
      new ShowMessageBar({
        message: `Дякуємо! користувача заблоковано!`,
        type: 'success',
      }),
    ]);
  }

  @Action(DeleteProviderAdminById)
  deleteProviderAdmin(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: DeleteProviderAdminById
  ): Observable<object> {
    return this.providerAdminService
      .deleteProviderAdmin(payload.userId, payload.providerId)
      .pipe(
        tap((res) => dispatch(new OnDeleteProviderAdminSuccess(payload))),
        catchError((error: HttpErrorResponse) =>
          of(dispatch(new OnDeleteProviderAdminFail(error)))
        )
      );
  }

  @Action(OnDeleteProviderAdminFail)
  onDeleteProviderAdminFail(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnDeleteProviderAdminFail
  ): void {
    throwError(payload);
    dispatch(
      new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' })
    );
  }

  @Action(OnDeleteProviderAdminSuccess)
  onDeleteProviderAdminSuccess(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnDeleteProviderAdminSuccess
  ): void {
    dispatch([
      new GetAllProviderAdmins(),
      new ShowMessageBar({
        message: `Дякуємо! користувача видалено!`,
        type: 'success',
      }),
    ]);
  }

  @Action(CreateAchievement)
  createAchievement(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: CreateAchievement
  ): Observable<object> {
    return this.achievementsService.createAchievement(payload).pipe(
      tap((res: HttpResponse<Achievement>) => dispatch(new OnCreateAchievementSuccess(res))),
      catchError((error: HttpErrorResponse) =>
        of(dispatch(new OnCreateAchievementFail(error)))
      )
    );
  }

  @Action(OnCreateAchievementSuccess)
  onCreateAchievementSuccess(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnCreateAchievementSuccess
  ): void {
    console.log('Achievement is created', payload);
    dispatch([
      new ShowMessageBar({ message: 'Новe Досягнення додано!', type: 'success' }),
      new MarkFormDirty(false),
    ]);
    this.router.navigate(['/details/workshop/', payload.body.workshopId]);
  }

  @Action(OnCreateAchievementFail)
  onCreateAchievementFail(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnCreateAchievementFail
  ): void {
    throwError(payload);
    dispatch(
      new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' })
    );
  }

  @Action(CreateApplication)
  createApplication(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: CreateApplication
  ): Observable<object> {
    return this.applicationService.createApplication(payload).pipe(
      tap((res) => dispatch(new OnCreateApplicationSuccess(res))),
      catchError((error: HttpErrorResponse) =>
        of(dispatch(new OnCreateApplicationFail(error)))
      )
    );
  }

  @Action(OnCreateApplicationFail)
  onCreateApplicationFail(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnCreateApplicationFail
  ): void {
    throwError(payload);
    dispatch(
      new ShowMessageBar({
        message:
          payload.error.status === 429
            ? `Перевищено ліміт заявок. Спробуйте ще раз через ${Util.secondsToDh(
                payload.headers.get('retry-after')
              )}`
            : 'На жаль виникла помилка',
        type: 'error',
        info:
          payload.error.status === 429
            ? 'Користувач може подати не більше 2-х заяв в тиждень на людину'
            : '',
      })
    );
  }

  @Action(OnCreateApplicationSuccess)
  onCreateApplicationSuccess(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnCreateApplicationSuccess
  ): void {
    console.log('Application is created', payload);
    dispatch([
      new ShowMessageBar({ message: 'Заявку створено!', type: 'success' }),
      new MarkFormDirty(false),
    ]);
    this.router.navigate(['']);
  }

  @Action(DeleteChildById)
  deleteChildById(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: DeleteChildById
  ): Observable<object> {
    return this.childrenService.deleteChild(payload).pipe(
      tap((res) => dispatch(new OnDeleteChildSuccess(res))),
      catchError((error: HttpErrorResponse) =>
        of(dispatch(new OnDeleteChildFail(error)))
      )
    );
  }

  @Action(OnDeleteChildFail)
  onDeleteChildFail(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnDeleteChildFail
  ): void {
    throwError(payload);
    dispatch(
      new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' })
    );
  }

  @Action(OnDeleteChildSuccess)
  onDeleteChildSuccess(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnDeleteChildSuccess
  ): void {
    console.log('Child is deleted', payload);
    dispatch([
      new ShowMessageBar({ message: 'Дитину видалено!', type: 'success' }),
      new GetUsersChildren(),
    ]);
  }

  @Action(UpdateWorkshop)
  updateWorkshop(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: UpdateWorkshop
  ): Observable<object> {
    return this.userWorkshopService.updateWorkshop(payload).pipe(
      tap((res) => dispatch(new OnUpdateWorkshopSuccess(res))),
      catchError((error: HttpErrorResponse) =>
        of(dispatch(new OnUpdateWorkshopFail(error)))
      )
    );
  }

  @Action(OnUpdateWorkshopFail)
  onUpdateWorkshopFail(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnUpdateWorkshopFail
  ): void {
    throwError(payload);
    dispatch(
      new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' })
    );
  }

  @Action(UpdateChild)
  updateChild(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: UpdateChild
  ): Observable<object> {
    return this.childrenService.updateChild(payload).pipe(
      tap((res) => dispatch(new OnUpdateChildSuccess(res))),
      catchError((error: HttpErrorResponse) =>
        of(dispatch(new OnUpdateChildFail(error)))
      )
    );
  }

  @Action(OnUpdateChildFail)
  onUpdateChildfail(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnUpdateChildFail
  ): void {
    throwError(payload);
    dispatch(
      new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' })
    );
  }

  @Action(OnUpdateWorkshopSuccess)
  onUpdateWorkshopSuccess(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnUpdateWorkshopSuccess
  ): void {
    const message = Util.getWorkshopMessage(payload);
    console.log('Workshop is updated', payload);
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({ message: message.text, type: message.type }),
    ]);
    this.router.navigate(['/personal-cabinet/workshops']);
  }

  @Action(OnUpdateChildSuccess)
  onUpdateChildSuccess(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnUpdateChildSuccess
  ): void {
    console.log('Child is updated', payload);
    dispatch([
      new MarkFormDirty(false),
      new ShowMessageBar({
        message: 'Дитина успішно відредагована',
        type: 'success',
      }),
    ]);
    this.location.back();
  }

  @Action(UpdateProvider)
  updateProvider(
    { dispatch, patchState }: StateContext<UserStateModel>,
    { payload }: UpdateProvider
  ): Observable<object> {
    return this.providerService.updateProvider(payload).pipe(
      tap((res) => dispatch(new OnUpdateProviderSuccess(res))),
      catchError((error: HttpErrorResponse) =>
        of(dispatch(new OnUpdateProviderFail(error)))
      )
    );
  }

  @Action(OnUpdateProviderFail)
  onUpdateProviderfail(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnUpdateProviderFail
  ): void {
    throwError(payload);

    dispatch(
      new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' })
    );
  }

  @Action(OnUpdateProviderSuccess)
  onUpdateProviderSuccess(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnUpdateProviderSuccess
  ): void {
    dispatch(new MarkFormDirty(false));
    console.log('Provider is updated', payload);
    dispatch([
      new ShowMessageBar({
        message: 'Організація успішно відредагована',
        type: 'success',
      }),
    ]);
    dispatch(new GetProfile()).subscribe(() =>
      this.router.navigate(['/personal-cabinet/provider/info'])
    );
  }

  @Action(UpdateUser)
  updateUser(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: UpdateUser
  ): Observable<object> {
    return this.userService.updateUser(payload).pipe(
      tap((res) => dispatch(new OnUpdateUserSuccess(res))),
      catchError((error: HttpErrorResponse) =>
        of(dispatch(new OnUpdateUserFail(error)))
      )
    );
  }

  @Action(OnUpdateUserFail)
  onUpdateUserFail(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnUpdateUserFail
  ): void {
    throwError(payload);
    dispatch(
      new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' })
    );
  }

  @Action(OnUpdateUserSuccess)
  onUpdateUserSuccess(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnUpdateUserSuccess
  ): void {
    dispatch(new MarkFormDirty(false));
    console.log('User is updated', payload);
    dispatch([
      new CheckAuth(),
      new ShowMessageBar({
        message: 'Особиста інформація успішно відредагована',
        type: 'success',
      }),
    ]);
    this.router.navigate(['/personal-cabinet/config']);
  }

  @Action(UpdateApplication)
  updateApplication(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: UpdateApplication
  ): Observable<object> {
    return this.applicationService.updateApplication(payload).pipe(
      tap((res) => dispatch(new OnUpdateApplicationSuccess(res))),
      catchError((error: HttpErrorResponse) =>
        of(dispatch(new OnCreateApplicationFail(error)))
      )
    );
  }

  @Action(OnUpdateApplicationFail)
  onUpdateApplicationfail(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnUpdateApplicationFail
  ): void {
    throwError(payload);
    dispatch(
      new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' })
    );
  }

  @Action(OnUpdateApplicationSuccess)
  onUpdateApplicationSuccess(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnUpdateApplicationSuccess
  ): void {
    dispatch(
      new ShowMessageBar({
        message:
          payload.status === ApplicationStatus.Left
            ? messageStatus.left
            : messageStatus.approved,
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
    return this.applicationService
      .getStatusIsAllowToApply(childId, workshopId)
      .pipe(
        tap((status: boolean) => {
          return patchState({ isAllowChildToApply: status, isLoading: false });
        })
      );
  }

  @Action(CreateRating)
  createRating(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: CreateRating
  ): Observable<object> {
    return this.ratingService.createRate(payload).pipe(
      tap((res) => dispatch(new OnCreateRatingSuccess(res))),
      catchError((error: HttpErrorResponse) =>
        of(dispatch(new OnCreateRatingFail(error)))
      )
    );
  }

  @Action(OnCreateRatingFail)
  onCreateRatingFail(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnCreateRatingFail
  ): void {
    throwError(payload);
    dispatch(
      new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' })
    );
  }

  @Action(OnCreateRatingSuccess)
  onCreateRatingSuccess(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: OnCreateRatingSuccess
  ): void {
    console.log('Rate is created', payload);
    dispatch(
      new ShowMessageBar({
        message: 'Оцінка успішно поставлена!',
        type: 'success',
      })
    );
  }

  @Action(GetFavoriteWorkshops)
  getFavoriteWorkshops(
    { patchState }: StateContext<UserStateModel>,
    {}: GetFavoriteWorkshops
  ): Observable<Favorite[]> {
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
    return this.favoriteWorkshopsService
      .createFavoriteWorkshop(payload)
      .pipe(
        tap(() =>
          dispatch([
            new GetFavoriteWorkshops(),
            new GetFavoriteWorkshopsByUserId(),
          ])
        )
      );
  }

  @Action(DeleteFavoriteWorkshop)
  deleteFavoriteWorkshop(
    { dispatch }: StateContext<UserStateModel>,
    { payload }: DeleteFavoriteWorkshop
  ): Observable<object> {
    return this.favoriteWorkshopsService
      .deleteFavoriteWorkshop(payload)
      .pipe(
        tap(() =>
          dispatch([
            new GetFavoriteWorkshops(),
            new GetFavoriteWorkshopsByUserId(),
          ])
        )
      );
  }

  @Action(ResetProviderWorkshopDetails)
  clearProviderWorkshopDetails({
    patchState,
  }: StateContext<UserStateModel>): void {
    patchState({ selectedWorkshop: null, selectedProvider: null });
  }

  @Action(BlockParent)
  blockParent({ dispatch }: StateContext<UserStateModel>, { payload }: BlockParent): Observable<BlockedParent | Observable<void>> {
    return this.blockService
    .blockParent(payload)
      .pipe(
        tap((res) => dispatch(new BlockParentSuccess(res))),
        catchError((error: Error) => of(dispatch(new BlockParentFail(error))))
      );
  }

  @Action(BlockParentFail)
  blockParentFail({ dispatch }: StateContext<UserStateModel>, { payload }: BlockParentFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(BlockParentSuccess)
  blockParentFailSuccess({ dispatch, patchState }: StateContext<UserStateModel>, { payload }: BlockParentSuccess): void {
    dispatch([
      new GetApplicationsByProviderId(payload.providerId, {
        status: undefined,
        showBlocked: false,
        workshopsId: []}),
      new MarkFormDirty(false),
      new ShowMessageBar({ message: 'Користувач успішно заблокований', type: 'success' })
    ]);
    console.log('parent is blocked', payload);
  }

  @Action(UnBlockParent)
  unBlockParent({ dispatch }: StateContext<UserStateModel>, { payload }: UnBlockParent): Observable<BlockedParent | Observable<void>> {
    return this.blockService
    .unBlockParent( payload )
      .pipe(
        tap((res) => dispatch(new UnBlockParentSuccess(res))),
        catchError((error: Error) => of(dispatch(new UnBlockParentFail(error))))
      );
  }

  @Action(UnBlockParentFail)
  unBlockParentFail({ dispatch }: StateContext<UserStateModel>, { payload }: UnBlockParentFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(UnBlockParentSuccess)
  unBlockParentFailSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: UnBlockParentSuccess): void {
    dispatch([
      new GetApplicationsByProviderId(payload.providerId, {
        status: undefined,
        showBlocked: true,
        workshopsId: []}),
      new MarkFormDirty(false),
      new ShowMessageBar({ message: 'Користувач успішно розблокований', type: 'success' }),
    ]);
    console.log('parent is blocked', payload);
  }

  @Action(GetBlockedParents)
  getBlockedParents({ patchState }: StateContext<UserStateModel>, { providerId, parentId}: GetBlockedParents): Observable<object> {
    patchState({ isLoading: true })
    return this.blockService
      .getBlockedParents(providerId, parentId)
      .pipe(
        tap((blockedParents: BlockedParent) => patchState({ blockedParents: blockedParents, isLoading: false })
        ))
  }
}
