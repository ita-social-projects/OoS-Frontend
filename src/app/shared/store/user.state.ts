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
import { UserWorkshopService } from '../services/workshops/user-workshop/user-workshop.service';
import { ToggleLoading } from './app.actions';
import {
  CreateChildren,
  CreateWorkshop,
  DeleteWorkshopById,
  GetApplicationsById,
  GetChildrenById,
  GetWorkshopsById,
  OnCreateChildrenFail,
  OnCreateChildrenSuccess,
  OnCreateWorkshopFail,
  OnCreateWorkshopSuccess,
  OnDeleteWorkshopFail,
  OnDeleteWorkshopSuccess
} from './user.actions';

export interface UserStateModel {
  workshops: Workshop[];
  applications: Application[];
  children: Child[];
}
@State<UserStateModel>({
  name: 'user',
  defaults: {
    workshops: Workshop[''],
    applications: Application[''],
    children: Child['']
  }
})
@Injectable()
export class UserState {
  postUrl = '/Workshop/Create';

  @Selector()
  static workshops(state: UserStateModel): Workshop[] { return state.workshops }

  @Selector()
  static applications(state: UserStateModel): Application[] { return state.applications }

  @Selector()
  static children(state: UserStateModel): Child[] { return state.children }

  constructor(
    private userWorkshopService: UserWorkshopService,
    private applicationService: ApplicationService,
    private childrenService: ChildrenService,
    public snackBar: MatSnackBar, private router: Router
  ) { }

  @Action(GetWorkshopsById)
  getWorkshopsById({ patchState }: StateContext<UserStateModel>, { payload }: GetWorkshopsById) {
    return this.userWorkshopService
      .getWorkshopsById(payload)
      .pipe(
        tap(
          (userWorkshops: Workshop[]) => patchState({ workshops: userWorkshops })
        ))
  }

  @Action(GetApplicationsById)
  getApplicationsById({ patchState }: StateContext<UserStateModel>, { payload }: GetApplicationsById) {
    return this.applicationService
      .getApplicationsById(payload)
      .pipe(
        tap((userApplications: Application[]) => {
          return patchState({ applications: userApplications })
        }))
  }

  @Action(GetChildrenById)
  getChildrenById({ patchState }: StateContext<UserStateModel>, { payload }: GetChildrenById) {
    return this.childrenService
      .getChildrenById(payload)
      .pipe(
        tap(
          (userChildren: Child[]) => patchState({ children: userChildren })
        ))
  }

  @Action(CreateWorkshop)
  createWorkshop({ dispatch }: StateContext<UserStateModel>, { payload }: CreateWorkshop) {
    dispatch(new ToggleLoading(true));
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
      this.router.navigate(['/personal-cabinet/workshops']);
      dispatch(new ToggleLoading(false));
    }, 2000);
  }

  @Action(OnCreateWorkshopSuccess)
  onCreateWorkshopSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateWorkshopSuccess): void {
    console.log('Workshop is created', payload);
    setTimeout(() => {
      this.showSnackBar('Гурток створено!', 'primary', 'top');
      dispatch(new ToggleLoading(false));
      this.router.navigate(['/personal-cabinet/workshops']);
    }, 2000);
  }

  @Action(DeleteWorkshopById)
  deleteWorkshop({ dispatch }: StateContext<UserStateModel>, { payload }: DeleteWorkshopById) {
    dispatch(new ToggleLoading(true));
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
      dispatch(new ToggleLoading(false));
    }, 2000);
  }

  @Action(OnDeleteWorkshopSuccess)
  onDeleteWorkshopSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnDeleteWorkshopSuccess): void {
    console.log('Workshop is deleted', payload);
    setTimeout(() => {
      this.showSnackBar('Гурток видалено!', 'primary', 'top');
      dispatch(new ToggleLoading(false));
    }, 2000);
  }

  @Action(CreateChildren)
  createChildren({ dispatch }: StateContext<UserStateModel>, { payload }: CreateChildren) {
    dispatch(new ToggleLoading(true));
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
      this.router.navigate(['/personal-cabinet/parent/info']);
      dispatch(new ToggleLoading(false));
    }, 2000);
  }

  @Action(OnCreateChildrenSuccess)
  onCreateChildrenSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateChildrenSuccess): void {
    console.log('Child is created', payload);
    setTimeout(() => {
      this.showSnackBar('Дитина усіпшно зареєстрована', 'primary', 'top');
      dispatch(new ToggleLoading(false));
      this.router.navigate(['/personal-cabinet/parent/info']);
    }, 2000);
  }

  showSnackBar(
    message: string,
    color: string,
    vertical: MatSnackBarVerticalPosition = 'bottom',
    horizontal: MatSnackBarHorizontalPosition = 'center'): void {

    this.snackBar.open(message, '', {
      duration: 5000,
      horizontalPosition: horizontal,
      verticalPosition: vertical,
      panelClass: [color],
    });
  }
}
