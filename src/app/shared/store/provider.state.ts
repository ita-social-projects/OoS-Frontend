import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { of, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Application } from '../models/application.model';
import { Workshop } from '../models/workshop.model';
import { ApplicationsService } from '../services/applications/applications.service';
import { ChildCardService } from '../services/child-cards/child-cards.service';
import { ProviderWorkshopsService } from '../services/workshops/provider-workshops/provider-workshops';
import { GetWorkshops, SetFilteredWorkshops } from './filter.actions';
import { CreateWorkshop, GetApplications, OnCreateWorkshopFail, OnCreateWorkshopSuccess } from './provider.actions';

export interface ProviderStateModel {
  loading: boolean;
  workshopsList: Workshop[];
  filteredWorkshopsList: Workshop[];
  applicationsList: Application[];
}

@State<ProviderStateModel>({
  name: 'provider',
  defaults: {
    workshopsList: [],
    filteredWorkshopsList: [],
    loading: false,
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
  @Action(SetFilteredWorkshops)
  setFilteredWorkshops({ patchState }: StateContext<ProviderStateModel>, { payload }: SetFilteredWorkshops) {
    patchState({ filteredWorkshopsList: payload });
  }
  @Action(CreateWorkshop)
  createWorkshop({ dispatch, patchState }: StateContext<ProviderStateModel>, { payload }: CreateWorkshop) {
    patchState({ loading: true });
    return this.providerWorkshopsService
      .createWorkshop(payload)
      .pipe(
        tap((res) => dispatch(new OnCreateWorkshopSuccess(res))
        ),
        catchError((error) => of(dispatch(new OnCreateWorkshopFail(error))))
      );
  }
  @Action(OnCreateWorkshopFail)
  onCreateWorkshopFail({ patchState }: StateContext<ProviderStateModel>, { payload }: OnCreateWorkshopFail): void {
    console.log('Workshop creation is failed', payload);
    patchState({ loading: false })
    throwError(payload);

  }
  @Action(OnCreateWorkshopSuccess)
  onCreateWorkshopSuccess({ patchState }: StateContext<ProviderStateModel>, { payload }: OnCreateWorkshopSuccess): void {
    patchState({ loading: false })
    console.log('Workshop is created', payload);
  }


}
