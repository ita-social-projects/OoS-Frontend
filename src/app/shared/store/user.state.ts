import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Application } from '../models/application.model';
import { Workshop } from '../models/workshop.model';
import { ApplicationService } from '../services/applications/application.service';
import { GetWorkshops, SetFilteredWorkshops } from './filter.actions';
import { ToggleLoading } from './app.actions';
import { CreateWorkshop, DeleteWorkshop, GetApplications, GetWorkshopsById, OnCreateWorkshopFail, OnCreateWorkshopSuccess, OnDeleteWorkshopFail, OnDeleteWorkshopSuccess } from './user.actions';
import { ChildrenService } from '../services/parent/children.service';
import { WorkshopService } from '../services/workshops/workshop.service';

export interface UserStateModel {
  workshops: Workshop[];
  filteredWorkshopsList: Workshop[];
  applicationsList: Application[];
}

@State<UserStateModel>({
  name: 'provider',
  defaults: {
    workshops: [],
    filteredWorkshopsList: [],
    applicationsList: Application['']
  }
})
@Injectable()
export class ProviderState {
  postUrl = '/Workshop/Create';

  @Selector()
  static workshops(state: UserStateModel) {
    return state.workshops
  }

  @Selector()
  static applicationsList(state: UserStateModel) {
    return state.applicationsList
  }
  constructor(
    private workshopService: WorkshopService,
    private applicationService: ApplicationService,
    public snackBar: MatSnackBar, private router: Router
  ) { }

  @Action(GetWorkshopsById)
  getWorkshopsById({ patchState }: StateContext<UserStateModel>, { payload }: GetWorkshopsById) {
    return this.workshopService.getWorkshopsById(payload).subscribe(
      (workshops: Workshop[]) => patchState({ workshops })
    )
  }

  @Action(GetApplications)
  getApplications({ patchState }: StateContext<UserStateModel>) {
    return this.applicationService.getApplications().subscribe(
      (applicationsList: Application[]) =>
        patchState({ applicationsList })
    )
  }
  @Action(SetFilteredWorkshops)
  setFilteredWorkshops({ patchState }: StateContext<UserStateModel>, { payload }: SetFilteredWorkshops) {
    patchState({ filteredWorkshopsList: payload });
  }
  @Action(CreateWorkshop)
  createWorkshop({ dispatch }: StateContext<UserStateModel>, { payload }: CreateWorkshop) {
    dispatch(new ToggleLoading(true));
    return this.providerWorkshopsService
      .createWorkshop(payload)
      .pipe(
        tap((res) => dispatch(new OnCreateWorkshopSuccess(res))
        ),
        catchError((error) => of(dispatch(new OnCreateWorkshopFail(error))))
      );
  }
  @Action(OnCreateWorkshopFail)
  onCreateWorkshopFail({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateWorkshopFail): void {
    console.log('Workshop creation is failed', payload);
    setTimeout(() => {
      throwError(payload);
      this.snackBar.open('На жаль виникла помилка', 'Спробуйте ще раз!', {
        duration: 5000,
        panelClass: ['red-snackbar'],
      });
      this.router.navigate(['/provider/cabinet/workshops']);
      dispatch(new ToggleLoading(false));
    }, 2000);
  }
  @Action(OnCreateWorkshopSuccess)
  onCreateWorkshopSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnCreateWorkshopSuccess): void {
    setTimeout(() => {
      this.snackBar.open('Гурток створено!', '', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['primary'],
      });
      console.log('Workshop is created', payload);
      dispatch(new ToggleLoading(false));
      this.router.navigate(['/provider/cabinet/workshops']);
    }, 2000);
  }
  @Action(DeleteWorkshop)
  deleteWorkshop({ dispatch }: StateContext<UserStateModel>, { payload }: DeleteWorkshop) {
    dispatch(new ToggleLoading(true));
    return this.providerWorkshopsService
      .deleteWorkshop(payload)
      .pipe(
        tap((res) => dispatch(new OnDeleteWorkshopSuccess(res))
        ),
        catchError((error) => of(dispatch(new OnDeleteWorkshopFail(error))))
      );
  }
  @Action(OnDeleteWorkshopFail)
  onDeleteWorkshopFail({ dispatch }: StateContext<UserStateModel>, { payload }: OnDeleteWorkshopFail): void {
    console.log('Workshop is not deleted', payload);
    setTimeout(() => {
      throwError(payload);
      this.snackBar.open('На жаль виникла помилка', 'Спробуйте ще раз!', {
        duration: 5000,
        panelClass: ['red-snackbar'],
      });
      dispatch(new ToggleLoading(false));
    }, 2000);
  }

  @Action(OnDeleteWorkshopSuccess)
  onDeleteWorkshopSuccess({ dispatch }: StateContext<UserStateModel>, { payload }: OnDeleteWorkshopSuccess): void {
    setTimeout(() => {
      this.snackBar.open('Гурток створено!', '', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['primary'],
      });
      console.log('Workshop is deleted', payload);
      dispatch(new ToggleLoading(false));
    }, 2000);
  }
}
