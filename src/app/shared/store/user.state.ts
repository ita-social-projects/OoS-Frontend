import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Application } from '../models/application.model';
import { Child } from '../models/child.model';
import { Workshop } from '../models/workshop.model';
import { ApplicationService } from '../services/applications/application.service';
import { ChildrenService } from '../services/children/children.service';
import { ParentService } from '../services/parent/parent.service';
import { ProviderService } from '../services/provider/provider.service';
import { UserService } from '../services/user/user.service';
import { UserWorkshopService } from '../services/workshops/user-workshop/user-workshop.service';
import { GetWorkshops, MarkFormDirty } from './app.actions';
import { ClearCategories } from './meta-data.actions';
import { CheckAuth, GetProfile } from './registration.actions';
import {
  CreateApplication,
  CreateChildren,
  CreateParent,
  OnCreateParentFail,
  OnCreateParentSuccess,
  CreateProvider,
  CreateWorkshop,
  DeleteChildById,
  DeleteWorkshopById,
  GetApplicationsByUserId,
  GetChildren,
  GetWorkshopsById,
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
  GetApplications,
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
  OnUpdateUserSuccess
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
    private parentService: ParentService,
    private snackBar: MatSnackBar,
    private router: Router,
    private userService: UserService
  ) { }

  @Action(GetWorkshopsById)
  getWorkshopsById({ patchState }: StateContext<UserStateModel>, { payload }: GetWorkshopsById) {
    return this.userWorkshopService
      .getWorkshopsById(payload)
      .pipe(
        tap((userWorkshop: Workshop) => {
          return patchState({ selectedWorkshop: userWorkshop });
        }));
  }

  @Action(GetApplicationsByUserId)
  getApplicationsByUserId({ patchState }: StateContext<UserStateModel>, { payload }: GetApplicationsByUserId) {
    return this.applicationService
      .getApplicationsByUserId(payload)
      .pipe(
        tap((userApplications: Application[]) => {
          return patchState({ applications: userApplications });
        }));
  }

  @Action(GetApplications)
  getApplications({ patchState }: StateContext<UserStateModel>, { }: GetApplications) {
    return this.applicationService
      .getApplications()
      .pipe(
        tap((userApplications: Application[]) => {
          return patchState({ applications: userApplications });
        }));
  }

  @Action(GetChildren)
  getChildren({ patchState }: StateContext<UserStateModel>, { }: GetChildren) {
    return this.childrenService
      .getChildren()
      .pipe(
        tap(
          (userChildren: Child[]) => patchState({ children: userChildren })
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
    console.error('Workshop creation is failed', payload);
    throwError(payload);
    this.showSnackBar('На жаль виникла помилка', 'red-snackbar');
  }

  @Action(OnCreateWorkshopSuccess)
  onCreateWorkshopSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateWorkshopSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Workshop is created', payload);
    this.showSnackBar('Гурток створено!', 'primary');
    this.router.navigate(['/personal-cabinet/workshops']);
    dispatch(new ClearCategories());
  }

  @Action(DeleteWorkshopById)
  deleteWorkshop({ dispatch }: StateContext<UserStateModel>, { payload }: DeleteWorkshopById) {
    return this.userWorkshopService
      .deleteWorkshop(payload)
      .pipe(
        tap((res) => dispatch(new OnDeleteWorkshopSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnDeleteWorkshopFail(error))))
      );
  }

  @Action(OnDeleteWorkshopFail)
  onDeleteWorkshopFail({ dispatch }: StateContext<UserStateModel>, { payload }: OnDeleteWorkshopFail): void {
    console.error('Workshop is not deleted', payload);
    throwError(payload);
    this.showSnackBar('На жаль виникла помилка', 'red-snackbar');
  }

  @Action(OnDeleteWorkshopSuccess)
  onDeleteWorkshopSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnDeleteWorkshopSuccess): void {
    console.log('Workshop is deleted', payload);
    this.showSnackBar('Гурток видалено!', 'primary');
    dispatch(new GetWorkshops());
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
    console.error('Child creation is failed', payload);
    throwError(payload);
    this.showSnackBar('На жаль виникла помилка', 'red-snackbar');
  }

  @Action(OnCreateChildrenSuccess)
  onCreateChildrenSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateChildrenSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Child is created', payload);
    this.showSnackBar('Дитина успішно зареєстрована', 'primary');
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
    console.error('Provider creation is failed', payload);
    throwError(payload);
    this.showSnackBar('На жаль виникла помилка', 'red-snackbar');
  }

  @Action(OnCreateProviderSuccess)
  onCreateProviderSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateProviderSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Provider is created', payload);
    dispatch(new GetProfile());
    this.showSnackBar('Організацію успішно створено', 'primary');
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
    console.error('Application creation is failed', payload);
    throwError(payload);
    this.showSnackBar('На жаль виникла помилка', 'red-snackbar');
  }

  @Action(OnCreateApplicationSuccess)
  onCreateApplicationSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateApplicationSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Application is created', payload);
    this.showSnackBar('Заявку створено!', 'primary');
    this.router.navigate(['']);
  }

  @Action(CreateParent)
  createParent({ dispatch }: StateContext<UserStateModel>, { payload }: CreateParent) {
    return this.parentService
      .createParent(payload)
      .pipe(
        tap((res) => dispatch(new OnCreateParentSuccess(res))),
        catchError((error: Error) => of(dispatch(new OnCreateParentFail(error))))
      );
  }

  @Action(OnCreateParentFail)
  onCreateParentFail({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateParentFail): void {
    console.error('Parent creation is failed', payload);
    throwError(payload);
    this.showSnackBar('На жаль виникла помилка', 'red-snackbar');
  }

  @Action(OnCreateParentSuccess)
  onCreateParentSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateParentSuccess): void {
    dispatch(new GetProfile());
    console.log('Parent is created', payload);
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
    console.error('Child is not deleted', payload);
    throwError(payload);
    this.showSnackBar('На жаль виникла помилка', 'red-snackbar');
  }

  @Action(OnDeleteChildSuccess)
  onDeleteChildSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnDeleteChildSuccess): void {
    console.log('Child is deleted', payload);
    this.showSnackBar('Дитину видалено!', 'primary');
    dispatch(new GetChildren());
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
  onUpdateWorkshopFail({ }: StateContext<UserStateModel>, { payload }: OnUpdateWorkshopFail): void {
    console.log('Workshop updating is failed', payload);
    setTimeout(() => {
      throwError(payload);
      this.showSnackBar('На жаль виникла помилка', 'red-snackbar');
    }, 1000);
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
    console.error('Child updating is failed', payload);
    throwError(payload);
    this.showSnackBar('На жаль виникла помилка', 'red-snackbar');
  }

  @Action(OnUpdateWorkshopSuccess)
  onUpdateWorkshopSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnUpdateWorkshopSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Workshop is updated', payload);
    this.showSnackBar('Гурток оновлено!', 'primary');
    this.router.navigate(['/personal-cabinet/workshops']);
  }

  @Action(OnUpdateChildSuccess)
  onUpdateChildSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnUpdateChildSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Child is updated', payload);
    this.showSnackBar('Дитина успішно відредагована', 'primary');
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
  onUpdateProviderfail({ }: StateContext<UserStateModel>, { payload }: OnUpdateProviderFail): void {
    console.error('Provider updating is failed', payload);
    throwError(payload);
    this.showSnackBar('На жаль виникла помилка', 'red-snackbar');
  }

  @Action(OnUpdateProviderSuccess)
  onUpdateProviderSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnUpdateProviderSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Provider is updated', payload);
    this.showSnackBar('Організація успішно відредагована', 'primary');
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
  onUpdateUserFail({ }: StateContext<UserStateModel>, { payload }: OnUpdateUserFail): void {
    console.error('User updating is failed', payload);
    throwError(payload);
    this.showSnackBar('На жаль виникла помилка', 'red-snackbar');
  }

  @Action(OnUpdateUserSuccess)
  onUpdateUserSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnUpdateUserSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('User is updated', payload);
    this.showSnackBar('Особиста інформація успішно відредагована', 'primary');
    dispatch(new CheckAuth())
    this.router.navigate(['/personal-cabinet/config']);
  }

  showSnackBar(message: string, color: string): void {
    this.snackBar.open(message, '', {
      duration: 2000,
      panelClass: [color],
    });
  }
}
