import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Application } from '../models/application.model';
import { Workshop } from '../models/workshop.model';
import { ApplicationsService } from '../services/applications/applications.service';
import { ChildCardService } from '../services/child-cards/child-cards.service';
import { ProviderWorkshopsService } from '../services/workshops/provider-workshops/provider-workshops';
import { ToggleLoading } from './app.actions';
import { GetWorkshops } from './filter.actions';
import { CreateWorkshop, DeleteWorkshop, GetApplications, OnCreateWorkshopFail, OnCreateWorkshopSuccess, OnDeleteWorkshopFail, OnDeleteWorkshopSuccess } from './provider.actions';

export interface ProviderStateModel {
  workshopsList: Workshop[];
  applicationsList: Application[];
}

@State<ProviderStateModel>({
  name: 'provider',
  defaults: {
    workshopsList: [],
    applicationsList: Application['']
  }
})
@Injectable()
export class ProviderState {
  postUrl = '/Workshop/Create';

  @Selector()
  static workshopsList(state: ProviderStateModel) {
    return state.workshopsList
  }
  @Selector()
  static applicationsList(state: ProviderStateModel) {
    return state.applicationsList
  }
  constructor(
    private providerWorkshopsService: ProviderWorkshopsService,
    private childCardsService: ChildCardService,
    private applicationService: ApplicationsService,
    public snackBar: MatSnackBar, private router: Router
  ) { }

  @Action(GetWorkshops)
  getActivitiesCards({ patchState }: StateContext<ProviderStateModel>) {
    return this.providerWorkshopsService.getWorkshops().subscribe(
      (workshopsList: Workshop[]) => patchState({ workshopsList })
    )
  }
  @Action(GetApplications)
  getApplications({ patchState }: StateContext<ProviderStateModel>) {
    return this.applicationService.getApplications().subscribe(
      (applicationsList: Application[]) =>
        patchState({ applicationsList })
    )
  }

  @Action(CreateWorkshop)
  createWorkshop({ dispatch }: StateContext<ProviderStateModel>, { payload }: CreateWorkshop) {
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
  onCreateWorkshopFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnCreateWorkshopFail): void {
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
  onCreateWorkshopSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnCreateWorkshopSuccess): void {
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
  deleteWorkshop({ dispatch }: StateContext<ProviderStateModel>, { payload }: DeleteWorkshop) {
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
  onDeleteWorkshopFail({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnDeleteWorkshopFail): void {
    console.log('Workshop is not deleted', payload);
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

  @Action(OnDeleteWorkshopSuccess)
  onDeleteWorkshopSuccess({ dispatch }: StateContext<ProviderStateModel>, { payload }: OnDeleteWorkshopSuccess): void {
    setTimeout(() => {
      this.snackBar.open('Гурток створено!', '', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['primary'],
      });
      console.log('Workshop is deleted', payload);
      dispatch(new ToggleLoading(false));
      this.router.navigate(['/provider/cabinet/workshops']);
    }, 2000);
  }


}
