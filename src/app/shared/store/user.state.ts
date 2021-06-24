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
import { UserWorkshopService } from '../services/workshops/user-workshop/user-workshop.service';
import { GetWorkshops } from './app.actions';
import { ClearCategories } from './meta-data.actions';
import { GetProfile, RegisterUser } from './registration.actions';
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
  GetApplications
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
    private router: Router
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
    console.log('Workshop creation is failed', payload);
    setTimeout(() => {
      throwError(payload);
      this.showSnackBar('На жаль виникла помилка', 'red-snackbar');
    }, 1000);
  }

  @Action(OnCreateWorkshopSuccess)
  onCreateWorkshopSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateWorkshopSuccess): void {
    console.log('Workshop is created', payload);
    setTimeout(() => {
      this.showSnackBar('Гурток створено!', 'primary', 'top');
      this.router.navigate(['/personal-cabinet/workshops']);
    }, 1000);
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
    console.log('Workshop is not deleted', payload);
    setTimeout(() => {
      throwError(payload);
      this.showSnackBar('На жаль виникла помилка', 'red-snackbar');
    }, 1000);
  }

  @Action(OnDeleteWorkshopSuccess)
  onDeleteWorkshopSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnDeleteWorkshopSuccess): void {
    console.log('Workshop is deleted', payload);
    setTimeout(() => {
      this.showSnackBar('Гурток видалено!', 'primary', 'top');
    }, 1000);
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
    console.log('Child creation is failed', payload);
    setTimeout(() => {
      throwError(payload);
      this.showSnackBar('На жаль виникла помилка', 'red-snackbar');
    }, 1000);
  }

  @Action(OnCreateChildrenSuccess)
  onCreateChildrenSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateChildrenSuccess): void {
    console.log('Child is created', payload);
    setTimeout(() => {
      this.showSnackBar('Дитина усіпшно зареєстрована', 'primary', 'top');
      this.router.navigate(['/personal-cabinet/parent/info']);
    }, 1000);
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
    console.log('Provider creation is failed', payload);
    setTimeout(() => {
      throwError(payload);
      this.showSnackBar('На жаль виникла помилка', 'red-snackbar');
    }, 1000);
  }

  @Action(OnCreateProviderSuccess)
  onCreateProviderSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateProviderSuccess): void {
    console.log('Provider is created', payload);
    dispatch(new GetProfile());
    setTimeout(() => {
      this.showSnackBar('Організацію успішно створено', 'primary');
      this.router.navigate(['']);
    }, 1000);
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
    console.log('Application creation is failed', payload);
    setTimeout(() => {
      throwError(payload);
      this.showSnackBar('На жаль виникла помилка', 'red-snackbar');
    }, 1000);
  }

  @Action(OnCreateApplicationSuccess)
  onCreateApplicationSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateApplicationSuccess): void {
    console.log('Application is created', payload);
    setTimeout(() => {
      this.showSnackBar('Заявку створено!', 'primary', 'top');
      this.router.navigate(['']);
    }, 1000);
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
    console.log('Parent creation is failed', payload);
    setTimeout(() => {
      throwError(payload);
      this.showSnackBar('На жаль виникла помилка', 'red-snackbar');
    }, 1000);
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
    console.log('Child is not deleted', payload);
    setTimeout(() => {
      throwError(payload);
      this.showSnackBar('На жаль виникла помилка', 'red-snackbar');
    }, 1000);
  }

  @Action(OnDeleteChildSuccess)
  onDeleteChildSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnDeleteChildSuccess): void {
    console.log('Child is deleted', payload);
    setTimeout(() => {
      this.showSnackBar('Дитину видалено!', 'primary', 'top');
    }, 1000);
    dispatch(new GetChildren());
  }

  showSnackBar(
    message: string,
    color: string,
    vertical: MatSnackBarVerticalPosition = 'bottom',
    horizontal: MatSnackBarHorizontalPosition = 'center'): void {

    this.snackBar.open(message, '', {
      duration: 2000,
      horizontalPosition: horizontal,
      verticalPosition: vertical,
      panelClass: [color],
    });
  }
}
