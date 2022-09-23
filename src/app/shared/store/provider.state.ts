import { Workshop, WorkshopStatus } from 'src/app/shared/models/workshop.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Constants } from '../constants/constants';
import { Achievement } from '../models/achievement.model';
import { ChildCards } from '../models/child.model';
import { Provider } from '../models/provider.model';
import { ProviderAdmin } from '../models/providerAdmin.model';
import { ProviderWorkshopCard } from '../models/workshop.model';
import { AchievementsService } from '../services/achievements/achievements.service';
import { ProviderAdminService } from '../services/provider-admins/provider-admin.service';
import { ProviderService } from '../services/provider/provider.service';
import { UserWorkshopService } from '../services/workshops/user-workshop/user-workshop.service';
import { Util } from '../utils/utils';
import { MarkFormDirty, ShowMessageBar } from './app.actions';
import {
  BlockParent,
  BlockParentFail,
  BlockParentSuccess,
  BlockProviderAdminById,
  CreateAchievement,
  CreateProvider,
  CreateProviderAdmin,
  CreateWorkshop,
  DeleteAchievementById,
  DeleteProviderAdminById,
  DeleteWorkshopById,
  GetAchievementById,
  GetAchievementsByWorkshopId,
  GetAllProviderAdmins,
  GetBlockedParents,
  GetChildrenByWorkshopId,
  GetProviderAdminWorkshops,
  GetProviderWorkshops,
  OnBlockProviderAdminFail,
  OnBlockProviderAdminSuccess,
  OnClearBlockedParents,
  OnCreateAchievementFail,
  OnCreateAchievementSuccess,
  OnCreateProviderAdminFail,
  OnCreateProviderAdminSuccess,
  OnCreateProviderFail,
  OnCreateProviderSuccess,
  OnCreateWorkshopFail,
  OnCreateWorkshopSuccess,
  OnDeleteAchievementFail,
  OnDeleteAchievementSuccess,
  OnDeleteProviderAdminFail,
  OnDeleteProviderAdminSuccess,
  OnDeleteWorkshopFail,
  OnDeleteWorkshopSuccess,
  OnUpdateAchievementFail,
  OnUpdateAchievementSuccess,
  OnUpdateProviderAdminFail,
  OnUpdateProviderAdminSuccess,
  OnUpdateProviderFail,
  OnUpdateProviderSuccess,
  OnUpdateWorkshopFail,
  OnUpdateWorkshopStatusFail,
  OnUpdateWorkshopStatusSuccess,
  OnUpdateWorkshopSuccess,
  ResetAchievements,
  UnBlockParent,
  UnBlockParentFail,
  UnBlockParentSuccess,
  UpdateAchievement,
  UpdateProvider,
  UpdateProviderAdmin,
  UpdateWorkshop,
  UpdateWorkshopStatus,
} from './provider.actions';
import { GetProfile } from './registration.actions';
import { BlockedParent } from '../models/block.model';
import { BlockService } from '../services/block/block.service';
import { GetApplicationsByProviderId } from './shared-user.actions';
import { EntityType } from '../enum/role';

export interface ProviderStateModel {
  isLoading: boolean;
  achievements: Achievement[];
  selectedAchievement: Achievement;
  approvedChildren: ChildCards;
  providerWorkshops: ProviderWorkshopCard[];
  providerAdmins: ProviderAdmin[];
  blockedParent: BlockedParent;
}

@State<ProviderStateModel>({
  name: 'provider',
  defaults: {
    isLoading: false,
    approvedChildren: null,
    achievements: null,
    selectedAchievement: null,
    providerWorkshops: null,
    providerAdmins: null,
    blockedParent: null,
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

  @Selector()
  static providerWorkshops(state: ProviderStateModel): ProviderWorkshopCard[] {
    return state.providerWorkshops;
  }

  @Selector()
  static providerAdmins(state: ProviderStateModel): ProviderAdmin[] {
    return state.providerAdmins;
  }

  @Selector()
  static blockedParent(state: ProviderStateModel): BlockedParent {
    return state.blockedParent;
  }

  constructor(
    private achievementsService: AchievementsService,
    private router: Router,
    private userWorkshopService: UserWorkshopService,
    private providerAdminService: ProviderAdminService,
    private providerService: ProviderService,
    private blockService: BlockService
  ) {}

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

  @Action(GetProviderAdminWorkshops)
  getProviderAdminWorkshops(
    { patchState }: StateContext<ProviderStateModel>,
    {}: GetProviderAdminWorkshops
  ): Observable<ProviderWorkshopCard[]> {
    patchState({ isLoading: true });
    return this.userWorkshopService.getProviderAdminsWorkshops().pipe(
      tap((providerWorkshops: ProviderWorkshopCard[]) => {
        return patchState({ providerWorkshops, isLoading: false });
      })
    );
  }

  @Action(GetProviderWorkshops)
  getProviderWorkshops(
    { patchState }: StateContext<ProviderStateModel>,
    { payload }: GetProviderWorkshops
  ): Observable<ProviderWorkshopCard[]> {
    patchState({ isLoading: true });
    return this.userWorkshopService.getProviderWorkshops(payload).pipe(
      tap((providerWorkshops: ProviderWorkshopCard[]) => {
        return patchState({ providerWorkshops, isLoading: false });
      })
    );
  }

  @Action(GetAllProviderAdmins)
  getAllProviderAdmins(
    { patchState }: StateContext<ProviderStateModel>,
    {}: GetAllProviderAdmins
  ): Observable<ProviderAdmin[]> {
    patchState({ isLoading: true });
    return this.providerAdminService
      .getAllProviderAdmins()
      .pipe(tap((providerAdmins: ProviderAdmin[]) => patchState({ providerAdmins, isLoading: false })));
  }

  @Action(CreateWorkshop)
  createWorkshop(
    { patchState, dispatch }: StateContext<ProviderStateModel>,
    { payload }: CreateWorkshop
  ): Observable<object> {
    patchState({ isLoading: true });
    return this.userWorkshopService.createWorkshop(payload).pipe(
      tap(res => dispatch(new OnCreateWorkshopSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnCreateWorkshopFail(error))))
    );
  }

  @Action(OnCreateWorkshopFail)
  onCreateWorkshopFail(
    { dispatch, patchState }: StateContext<ProviderStateModel>,
    { payload }: OnCreateWorkshopFail
  ): void {
    throwError(payload);
    patchState({ isLoading: false });
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnCreateWorkshopSuccess)
  onCreateWorkshopSuccess(
    { patchState, dispatch }: StateContext<ProviderStateModel>,
    { payload }: OnCreateWorkshopSuccess
  ): void {
    const message = Util.getWorkshopMessage(payload);
    patchState({ isLoading: false });
    dispatch([new MarkFormDirty(false), new ShowMessageBar({ message: message.text, type: message.type })]);
    this.router.navigate(['./personal-cabinet/provider/workshops']);
  }

  @Action(UpdateWorkshop)
  updateWorkshop({ dispatch }: StateContext<ProviderStateModel>, { payload }: UpdateWorkshop): Observable<object> {
    return this.userWorkshopService.updateWorkshop(payload).pipe(
      tap((res: Workshop) => dispatch(new OnUpdateWorkshopSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnUpdateWorkshopFail(error))))
    );
  }

  @Action(OnUpdateWorkshopSuccess)
  onUpdateWorkshopSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateWorkshopSuccess): void {
    const message = Util.getWorkshopMessage(payload);
    dispatch([new MarkFormDirty(false), new ShowMessageBar({ message: message.text, type: message.type })]);
    this.router.navigate(['/personal-cabinet/provider/workshops']);
  }

  @Action(OnUpdateWorkshopFail)
  onUpdateWorkshopFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateWorkshopFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(DeleteWorkshopById)
  deleteWorkshop({ dispatch }: StateContext<ProviderStateModel>, { payload }: DeleteWorkshopById): Observable<object> {
    return this.userWorkshopService.deleteWorkshop(payload.workshopId).pipe(
      tap(res => dispatch(new OnDeleteWorkshopSuccess(payload))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnDeleteWorkshopFail(error))))
    );
  }

  @Action(OnDeleteWorkshopFail)
  onDeleteWorkshopFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnDeleteWorkshopFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnDeleteWorkshopSuccess)
  onDeleteWorkshopSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnDeleteWorkshopSuccess): void {
    dispatch([
      new ShowMessageBar({
        message: `Дякуємо! Гурток "${payload.title}" видалено!`,
        type: 'success',
      }),
      new GetProviderWorkshops(payload.providerId),
    ]);
  }

  @Action(CreateProvider)
  createProvider(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, isRelease3 }: CreateProvider
  ): Observable<object> {
    return this.providerService.createProvider(payload, isRelease3).pipe(
      tap((res: Provider) => dispatch(new OnCreateProviderSuccess(res))),
      catchError(error => of(dispatch(new OnCreateProviderFail(error))))
    );
  }

  @Action(OnCreateProviderFail)
  onCreateProviderFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnCreateProviderFail): void {
    throwError(payload);
    const message =
      payload.error === Constants.UNABLE_CREATE_PROVIDER ||
      Constants.UNABLE_CREATE_PROVIDER + Constants.THERE_IS_SUCH_DATA
        ? 'Перевірте введені дані. Електрона пошта, номер телефону та ІПН/ЄДПРО мають бути унікальними'
        : 'На жаль виникла помилка';
    dispatch(new ShowMessageBar({ message, type: 'error' }));
  }

  @Action(OnCreateProviderSuccess)
  onCreateProviderSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnCreateProviderSuccess): void {
    dispatch(new GetProfile()).subscribe(() => this.router.navigate(['']));
    dispatch([
      new ShowMessageBar({
        message: 'Організацію успішно створено',
        type: 'success',
      }),
      new MarkFormDirty(false),
    ]);
  }

  @Action(UpdateProvider)
  updateProvider(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, isRelease3 }: UpdateProvider
  ): Observable<object> {
    return this.providerService.updateProvider(payload, isRelease3).pipe(
      tap(res => dispatch(new OnUpdateProviderSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnUpdateProviderFail(error))))
    );
  }

  @Action(OnUpdateProviderFail)
  onUpdateProviderfail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateProviderFail): void {
    throwError(payload);

    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnUpdateProviderSuccess)
  onUpdateProviderSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateProviderSuccess): void {
    dispatch(new MarkFormDirty(false));
    dispatch([
      new ShowMessageBar({
        message: 'Організація успішно відредагована',
        type: 'success',
      }),
    ]);
    dispatch(new GetProfile()).subscribe(() => this.router.navigate(['/personal-cabinet/provider/info']));
  }

  @Action(CreateProviderAdmin)
  createProviderAdmin(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: CreateProviderAdmin
  ): Observable<object> {
    return this.providerAdminService.createProviderAdmin(payload).pipe(
      tap((res: ProviderAdmin) => dispatch(new OnCreateProviderAdminSuccess(res))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnCreateProviderAdminFail(error))))
    );
  }

  @Action(OnCreateProviderAdminFail)
  onCreateProviderAdminFail(
    { dispatch }: StateContext<ProviderStateModel>,
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
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: OnCreateProviderAdminSuccess
  ): void {
    dispatch([
      new ShowMessageBar({
        message: 'Користувача успішно створено',
        type: 'success',
      }),
      new MarkFormDirty(false),
    ]);
    this.router.navigate(['/personal-cabinet/provider/administration']);
  }

  @Action(BlockProviderAdminById)
  blockProviderAdmin(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: BlockProviderAdminById
  ): Observable<object> {
    return this.providerAdminService.blockProviderAdmin(payload.userId, payload.providerId).pipe(
      tap(res => dispatch(new OnBlockProviderAdminSuccess(payload))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnBlockProviderAdminFail(error))))
    );
  }

  @Action(OnBlockProviderAdminFail)
  onBlockProviderAdminFail(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: OnBlockProviderAdminFail
  ): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnBlockProviderAdminSuccess)
  onBlockProviderAdminSuccess(
    { dispatch }: StateContext<ProviderStateModel>,
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
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: DeleteProviderAdminById
  ): Observable<object> {
    return this.providerAdminService.deleteProviderAdmin(payload.userId, payload.providerId).pipe(
      tap(res => dispatch(new OnDeleteProviderAdminSuccess(payload))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnDeleteProviderAdminFail(error))))
    );
  }

  @Action(OnDeleteProviderAdminFail)
  onDeleteProviderAdminFail(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: OnDeleteProviderAdminFail
  ): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnDeleteProviderAdminSuccess)
  onDeleteProviderAdminSuccess(
    { dispatch }: StateContext<ProviderStateModel>,
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

  @Action(UpdateProviderAdmin)
  updateProviderAdmin(
    { dispatch }: StateContext<ProviderStateModel>,
    { providerId, providerAdmin }: UpdateProviderAdmin
  ): Observable<void | ProviderAdmin> {
    return this.providerAdminService.updateProviderAdmin(providerId, providerAdmin).pipe(
      tap((res: ProviderAdmin) => dispatch(new OnUpdateProviderAdminSuccess(providerAdmin))),
      catchError((error: HttpErrorResponse) => dispatch(new OnUpdateProviderAdminFail(error)))
    );
  }

  @Action(OnUpdateProviderAdminFail)
  onUpdateProviderAdminfail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateProviderAdminFail): void {
    throwError(payload);

    dispatch(new ShowMessageBar({ 
      message: 'На жаль виникла помилка', 
      type: 'error' 
    }));
  }

  @Action(OnUpdateProviderAdminSuccess)
  onUpdateProviderAdminSuccess(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: OnUpdateProviderAdminSuccess
  ): void {
    dispatch([
      new ShowMessageBar({
        message: payload.isDeputy ? 'Заступника директора успішно відредаговано!' : 'Адміністратора гуртка успішно відредаговано!',
        type: 'success',
      }),
      new MarkFormDirty(false)
    ]);
    this.router.navigate(['/personal-cabinet/provider/administration']);
  }

  @Action(UpdateWorkshopStatus)
  updateStatus(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, providerId }: UpdateWorkshopStatus
  ): Observable<object> {
    return this.userWorkshopService.updateWorkshopStatus(payload).pipe(
      tap((res: WorkshopStatus) => dispatch(new OnUpdateWorkshopStatusSuccess(providerId))),
      catchError((error: HttpErrorResponse) => of(dispatch(new OnUpdateWorkshopStatusFail(error))))
    );
  }

  @Action(OnUpdateWorkshopStatusFail)
  onUpdateStatusFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnUpdateWorkshopStatusFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnUpdateWorkshopStatusSuccess)
  onUpdateStatusSuccess(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload }: OnUpdateWorkshopStatusSuccess
  ): void {}

  @Action(BlockParent)
  blockParent(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, entityType }: BlockParent
  ): Observable<BlockedParent | Observable<void>> {
    return this.blockService.blockParent(payload).pipe(
      tap(res => dispatch(new BlockParentSuccess(res, entityType))),
      catchError((error: HttpErrorResponse) => of(dispatch(new BlockParentFail(error))))
    );
  }

  @Action(BlockParentFail)
  blockParentFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: BlockParentFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(BlockParentSuccess)
  blockParentFailSuccess({ dispatch }: StateContext<ProviderStateModel>,  { payload, entityType }: BlockParentSuccess): void {
    dispatch([
      new GetApplicationsByProviderId(payload.providerId, {
        property: entityType,
        statuses: [],
        showBlocked: false,
        workshops: [],
      }),
      new MarkFormDirty(false),
      new ShowMessageBar({ message: 'Користувач успішно заблокований', type: 'success' }),
    ]);
  }

  @Action(UnBlockParent)
  unBlockParent(
    { dispatch }: StateContext<ProviderStateModel>,
    { payload, entityType }: UnBlockParent
  ): Observable<BlockedParent | Observable<void>> {
    return this.blockService.unBlockParent(payload).pipe(
      tap(res => dispatch(new UnBlockParentSuccess(res, entityType))),
      catchError((error: Error) => of(dispatch(new UnBlockParentFail(error))))
    );
  }

  @Action(UnBlockParentFail)
  unBlockParentFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: UnBlockParentFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(UnBlockParentSuccess)
  unBlockParentFailSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload, entityType }: UnBlockParentSuccess): void {
    dispatch([
      new GetApplicationsByProviderId(payload.providerId, {
        property: entityType,
        statuses: [],
        showBlocked: true,
        workshops: [],
      }),
      new MarkFormDirty(false),
      new ShowMessageBar({ message: 'Користувач успішно розблокований', type: 'success' }),
    ]);
  }

  @Action(GetBlockedParents)
  getBlockedParents(
    { patchState }: StateContext<ProviderStateModel>,
    { providerId, parentId }: GetBlockedParents
  ): Observable<object> {
    return this.blockService
      .getBlockedParents(providerId, parentId)
      .pipe(tap((blockedParent: BlockedParent) => patchState({ blockedParent: blockedParent })));
  }

  @Action(OnClearBlockedParents)
  onClearBlockedParents({ patchState }: StateContext<ProviderStateModel>, {}: OnClearBlockedParents): void {
    patchState({ blockedParent: null });
  }

  @Action(ResetAchievements)
  resetAchievement({ patchState }: StateContext<ProviderStateModel>, {}: ResetAchievements): void {
    patchState({ selectedAchievement: null, achievements: null });
  }
}
