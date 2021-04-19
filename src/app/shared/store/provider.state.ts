import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Address } from '../models/address.model';
import { Application } from '../models/application.model';
import { Teacher } from '../models/teacher.model';
import { Workshop } from '../models/workshop.model';
import { ApplicationsService } from '../services/applications/applications.service';
import { ChildCardService } from '../services/child-cards/child-cards.service';
import { ProviderActivitiesService } from '../services/provider-activities/provider-activities.service';
import { CreateAddress, CreateTeachers, CreateWorkshop, GetActivitiesCards, GetApplications } from './provider.actions';

export interface ProviderStateModel {
  activitiesList: Workshop[];
  applicationsList: Application[];
}

@State<ProviderStateModel>({
  name: 'provider',
  defaults: {
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
  createWorkshop({ dispatch }: StateContext<ProviderStateModel>, { about, description, address, teachers }: CreateWorkshop): void {
    let adr, tchrs;
    dispatch(new CreateAddress(address)).subscribe(data => adr = data);
    dispatch(new CreateTeachers(teachers)).subscribe(data => tchrs = data);

    const workshop = new Workshop(about.value, description.value, adr, tchrs);

    this.providerActivititesService.createWorkshop(workshop);
  }

  @Action(CreateAddress)
  createAddress({ }: StateContext<ProviderStateModel>, { payload }: CreateAddress): Address {
    return new Address(payload.value);
  }

  @Action(CreateTeachers)
  createTeachers({ }: StateContext<ProviderStateModel>, { payload }: CreateTeachers): Teacher[] {
    const teachers: Teacher[] = [];
    for (let i = 0; i < payload.controls.length; i++) {
      let teacher: Teacher = new Teacher(payload.controls[i].value);
      teachers.push(teacher)
    }
    return teachers;
  }


}
