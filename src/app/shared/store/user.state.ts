import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Application } from '../models/application.model';
import { Child } from '../models/child.model';
import { Workshop } from '../models/workshop.model';
import { ApplicationService } from '../services/applications/application.service';
import { ChildrenService } from '../services/children/children.service';
import { ProviderService } from '../services/provider/provider.service';
import { UserService } from '../services/user/user.service';
import { UserWorkshopService } from '../services/workshops/user-workshop/user-workshop.service';
import { MarkFormDirty, ShowMessageBar } from './app.actions';
import { ClearCategories } from './meta-data.actions';
import { CheckAuth, GetProfile } from './registration.actions';
import {
  CreateApplication,
  CreateChildren,
  CreateProvider,
  CreateWorkshop,
  DeleteChildById,
  DeleteWorkshopById,
  GetChildrenByParentId,
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
  GetWorkshopsByParentId,
  GetApplicationsByProviderId,
  GetApplicationsByParentId,
  OnUpdateApplicationSuccess,
  UpdateApplication,
  OnUpdateApplicationFail
} from './user.actions';

export interface UserStateModel {
  workshops: Workshop[];
  selectedWorkshop: Workshop;
  applications: Application[];
  children: Child[];
}
@State<UserStateModel>({
  name: 'user',
  defaults: {
    workshops: Workshop[''],
    selectedWorkshop: null,
    applications: Application[''],
    children: Child[''],
  }
})
@Injectable()
export class UserState {
  postUrl = '/Workshop/Create';

  @Selector()
  static workshops(state: UserStateModel): Workshop[] { return state.workshops }

  @Selector()
  static selectedWorkshop(state: UserStateModel): Workshop { return state.selectedWorkshop }

  @Selector()
  static applications(state: UserStateModel): Application[] { return state.applications }

  @Selector()
  static children(state: UserStateModel): Child[] { return state.children }

  constructor(
    private userWorkshopService: UserWorkshopService,
    private applicationService: ApplicationService,
    private childrenService: ChildrenService,
    private providerService: ProviderService,
    private router: Router,
    private userService: UserService
  ) { }

  @Action(GetWorkshopById)
  getWorkshopById({ patchState }: StateContext<UserStateModel>, { payload }: GetWorkshopById) {
    return this.userWorkshopService
      .getWorkshopById(payload)
      .pipe(
        tap((workshop: Workshop) => {
          return patchState({ selectedWorkshop: workshop });
        }));
  }

  @Action(GetWorkshopsByProviderId)
  getWorkshopsByProviderId({ patchState }: StateContext<UserStateModel>, { payload }: GetWorkshopsByProviderId) {
    return this.userWorkshopService
      .getWorkshopsByProviderId(payload)
      .pipe(
        tap((userWorkshops: Workshop[]) => {
          return patchState({ workshops: userWorkshops });
        }));
  }

  @Action(GetWorkshopsByParentId)
  getWorkshopsByParentId({ patchState }: StateContext<UserStateModel>, { }: GetWorkshopsByParentId) {
    return this.userWorkshopService
      .getWorkshopsByParentId()
      .pipe(
        tap((userWorkshops: Workshop[]) => {
          return patchState({ workshops: userWorkshops });
        }));
  }

  @Action(GetApplicationsByParentId)
  getApplicationsByUserId({ patchState }: StateContext<UserStateModel>, { payload }: GetApplicationsByParentId) {
    return this.applicationService
      .getApplicationsByParentId(payload)
      .pipe(
        tap((applications: Application[]) => {
          return patchState({ applications: applications });
        }));
  }

  @Action(GetApplicationsByProviderId)
  getApplicationsByProviderId({ patchState }: StateContext<UserStateModel>, { payload }: GetApplicationsByProviderId) {
    return this.applicationService
      .getApplicationsByProviderId(payload)
      .pipe(
        tap((applications: Application[]) => {
          return patchState({ applications: applications });
        }));
  }

  @Action(GetChildrenByParentId)
  getChildrenByParentId({ patchState }: StateContext<UserStateModel>, { payload }: GetChildrenByParentId) {
    return this.childrenService
      .getChildrenByParentId(payload)
      .pipe(
        tap(
          (children: Child[]) => patchState({ children: children })
        ))
  }

  @Action(CreateWorkshop)
  createWorkshop({ dispatch }: StateContext<UserStateModel>, { payload }: CreateWorkshop) {
    return this.userWorkshopService
      .createWorkshop(payload)
      .pipe(
        tap((res) => dispatch(new OnCreateWorkshopSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnCreateWorkshopFail(error))))
      );
  }

  @Action(OnCreateWorkshopFail)
  onCreateWorkshopFail({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateWorkshopFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnCreateWorkshopSuccess)
  onCreateWorkshopSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateWorkshopSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Workshop is created', payload);
    dispatch(new ShowMessageBar({ message: 'Гурток створено!', type: 'success' }));
    this.router.navigate(['/personal-cabinet/workshops']);
    dispatch(new ClearCategories());
  }

  @Action(DeleteWorkshopById)
  deleteWorkshop({ dispatch }: StateContext<UserStateModel>, { payload }: DeleteWorkshopById) {
    return this.userWorkshopService
      .deleteWorkshop(payload.id)
      .pipe(
        tap((res) => dispatch(new OnDeleteWorkshopSuccess(payload.title))),
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
    dispatch(new ShowMessageBar({ message: `Дякуємо! Гурток "${payload}" видалено!`, type: 'success' }));
  }

  @Action(CreateChildren)
  createChildren({ dispatch }: StateContext<UserStateModel>, { payload }: CreateChildren) {
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
  createProvider({ dispatch }: StateContext<UserStateModel>, { payload }: CreateProvider) {
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
    dispatch(new MarkFormDirty(false));
    console.log('Provider is created', payload);
    dispatch(new GetProfile());
    dispatch(new ShowMessageBar({ message: 'Організацію успішно створено', type: 'success' }));
    this.router.navigate(['']);
  }

  @Action(CreateApplication)
  createApplication({ dispatch }: StateContext<UserStateModel>, { payload }: CreateApplication) {
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
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnCreateApplicationSuccess)
  onCreateApplicationSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateApplicationSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Application is created', payload);
    dispatch(new ShowMessageBar({ message: 'Заявку створено!', type: 'success' }));
    this.router.navigate(['']);
  }

  @Action(DeleteChildById)
  deleteChildById({ dispatch }: StateContext<UserStateModel>, { payload }: DeleteChildById) {
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
  }

  @Action(UpdateWorkshop)
  updateWorkshop({ dispatch }: StateContext<UserStateModel>, { payload }: UpdateWorkshop) {
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
  updateChild({ dispatch }: StateContext<UserStateModel>, { payload }: UpdateChild) {
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
  updateProvider({ dispatch }: StateContext<UserStateModel>, { payload }: UpdateProvider) {
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
    dispatch(new ShowMessageBar({ message: 'Організація успішно відредагована', type: 'success' }));
    this.router.navigate(['/personal-cabinet/parent/info']);
  }

  @Action(UpdateUser)
  updateUser({ dispatch }: StateContext<UserStateModel>, { payload }: UpdateUser) {
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
  updateApplication({ dispatch }: StateContext<UserStateModel>, { payload }: UpdateApplication) {
    return this.applicationService
      .updateApplication(payload)
      .pipe(
        tap((res) => dispatch(new OnUpdateProviderSuccess(res))),
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
    dispatch(new ShowMessageBar({ message: 'Статус заявки успішно змінений', type: 'success' }));
  }
}
