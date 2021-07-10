import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { SnackBarComponent } from '../components/snack-bar/snack-bar.component';
import { Application } from '../models/application.model';
import { Child } from '../models/child.model';
import { Workshop } from '../models/workshop.model';
import { ApplicationService } from '../services/applications/application.service';
import { ChildrenService } from '../services/children/children.service';
import { ParentService } from '../services/parent/parent.service';
import { ProviderService } from '../services/provider/provider.service';
import { UserService } from '../services/user/user.service';
import { UserWorkshopService } from '../services/workshops/user-workshop/user-workshop.service';
import { MarkFormDirty } from './app.actions';
import { ClearCategories } from './meta-data.actions';
import { CheckAuth, GetProfile } from './registration.actions';
import {
  CreateApplication,
  CreateChildren,
  CreateProvider,
  CreateWorkshop,
  DeleteChildById,
  DeleteWorkshopById,
  GetApplicationsByUserId,
  GetChildren,
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
  OnUpdateUserSuccess,
  GetWorkshopById,
  GetWorkshopsByParentId
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
    this.showSnackBar('На жаль виникла помилка', 'error');
  }

  @Action(OnCreateWorkshopSuccess)
  onCreateWorkshopSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateWorkshopSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Workshop is created', payload);
    this.showSnackBar('Гурток створено!', 'success');
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
    this.showSnackBar('На жаль виникла помилка', 'error');
  }

  @Action(OnDeleteWorkshopSuccess)
  onDeleteWorkshopSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnDeleteWorkshopSuccess): void {
    console.log('Workshop is deleted', payload);
    this.showSnackBar('Гурток видалено!', 'success');
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
    this.showSnackBar('На жаль виникла помилка', 'error');
  }

  @Action(OnCreateChildrenSuccess)
  onCreateChildrenSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateChildrenSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Child is created', payload);
    this.showSnackBar('Дитина успішно зареєстрована', 'success');
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
    this.showSnackBar('На жаль виникла помилка', 'error');
  }

  @Action(OnCreateProviderSuccess)
  onCreateProviderSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateProviderSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Provider is created', payload);
    dispatch(new GetProfile());
    this.showSnackBar('Організацію успішно створено', 'success');
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
    this.showSnackBar('На жаль виникла помилка', 'error');
  }

  @Action(OnCreateApplicationSuccess)
  onCreateApplicationSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateApplicationSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Application is created', payload);
    this.showSnackBar('Заявку створено!', 'success');
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
    console.error('Child is not deleted', payload);
    throwError(payload);
    this.showSnackBar('На жаль виникла помилка', 'error');
  }

  @Action(OnDeleteChildSuccess)
  onDeleteChildSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnDeleteChildSuccess): void {
    console.log('Child is deleted', payload);
    this.showSnackBar('Дитину видалено!', 'success');
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
      this.showSnackBar('На жаль виникла помилка', 'error');
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
    this.showSnackBar('На жаль виникла помилка', 'error');
  }

  @Action(OnUpdateWorkshopSuccess)
  onUpdateWorkshopSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnUpdateWorkshopSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Workshop is updated', payload);
    this.showSnackBar('Гурток оновлено!', 'error');
    this.router.navigate(['/personal-cabinet/workshops']);
  }

  @Action(OnUpdateChildSuccess)
  onUpdateChildSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnUpdateChildSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Child is updated', payload);
    this.showSnackBar('Дитина успішно відредагована', 'success');
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
    this.showSnackBar('На жаль виникла помилка', 'error');
  }

  @Action(OnUpdateProviderSuccess)
  onUpdateProviderSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnUpdateProviderSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('Provider is updated', payload);
    this.showSnackBar('Організація успішно відредагована', 'success');
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
    this.showSnackBar('На жаль виникла помилка', 'error');
  }

  @Action(OnUpdateUserSuccess)
  onUpdateUserSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnUpdateUserSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('User is updated', payload);
    this.showSnackBar('Особиста інформація успішно відредагована', 'success');
    dispatch(new CheckAuth());
    this.router.navigate(['/personal-cabinet/config']);
  }

  showSnackBar(message: string, type: string): void {
    this.snackBar.openFromComponent(SnackBarComponent, {
      duration: 5000,
      panelClass: type,
      data: { message, type },
    });
  }
}
