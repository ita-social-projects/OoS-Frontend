import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Address } from '../models/address.model';
import { Application } from '../models/application.model';
import { Teacher } from '../models/teacher.model';
import { Workshop } from '../models/workshop.model';
import { ApplicationsService } from '../services/applications/applications.service';
import { ChildCardService } from '../services/child-cards/child-cards.service';
import { ProviderActivitiesService } from '../services/provider-activities/provider-activities.service';
import { CreateWorkshop, GetActivitiesCards, GetApplications, OnCreateWorkshopFail, OnCreateWorkshopSuccess } from './provider.actions';

export interface ProviderStateModel {
  loading: boolean;
  activitiesList: Workshop[];
  applicationsList: Application[];
}

@State<ProviderStateModel>({
  name: 'provider',
  defaults: {
    loading: false,
    activitiesList: Workshop[''],
    applicationsList: Application['']
  }
})
@Injectable()
export class ProviderState {
  postUrl = '/Workshop/Create';

  @Selector()
  static activitiesList(state: ProviderStateModel) {
    return state.activitiesList
  }
  @Selector()
  static applicationsList(state: ProviderStateModel) {
    return state.applicationsList
  }

  constructor(
    private providerActivititesService: ProviderActivitiesService,
    private childCardsService: ChildCardService,
    private applicationService: ApplicationsService,
  ) { }

  @Action(GetActivitiesCards)
  getActivitiesCards({ patchState }: StateContext<ProviderStateModel>) {
    return this.providerActivititesService.getCards().subscribe(
      (activitiesList: Workshop[]) => patchState({ activitiesList })
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
  createWorkshop({ dispatch, patchState }: StateContext<ProviderStateModel>, { payload }: CreateWorkshop): void {
    patchState({ loading: true })
    this.providerActivititesService
      .createWorkshop(payload)
      .pipe(
        catchError(err => dispatch(new OnCreateWorkshopFail(err)))
      )
      .subscribe(
        res => {
          console.log('HTTP Success', res);
          dispatch(new OnCreateWorkshopSuccess())
        },
        err => console.log('HTTP Error', err),
        () => console.log('HTTP request completed.')
      );
  }
  @Action(OnCreateWorkshopFail)
  onCreateWorkshopFail({ patchState }: StateContext<ProviderStateModel>, { payload }: OnCreateWorkshopFail): void {
    patchState({ loading: false })
    console.log('Workshop creation is failed', payload);
    throwError(payload);
  }
  @Action(OnCreateWorkshopSuccess)
  onCreateWorkshopSuccess({ patchState }: StateContext<ProviderStateModel>, { }: OnCreateWorkshopSuccess): void {
    patchState({ loading: false })
    console.log('Workshop created');
  }


}
