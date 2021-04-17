import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { actCard } from '../models/activities-card.model';
import { Address } from '../models/address.model';
import { Teacher } from '../models/teacher.model';
import { Workshop } from '../models/workshop.model';
import { ChildCardService } from '../services/child-cards/child-cards.service';
import { ProviderActivitiesService } from '../services/provider-activities/provider-activities.service';
import { CreateAddress, CreateTeachers, CreateWorkshop, GetActivitiesCards } from './provider.actions';

export interface ProviderStateModel {
  activitiesList: actCard[];
}

@State<ProviderStateModel>({
  name: 'provider',
  defaults: {
    activitiesList: []
  }
})
@Injectable()
export class ProviderState {
  postUrl = '/Workshop/Create';

  @Selector()
  static activitiesList(state: ProviderStateModel) {
    return state.activitiesList
  }

  constructor(
    private providerActivititesService: ProviderActivitiesService,
    private childCardsService: ChildCardService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  @Action(GetActivitiesCards)
  GetActivitiesCards({ patchState }: StateContext<ProviderStateModel>) {
    return this.providerActivititesService.getCards().subscribe(
      (activitiesList: actCard[]) => patchState({ activitiesList })
    )
  }

  @Action(CreateWorkshop)
  createWorkshop({ dispatch }: StateContext<ProviderStateModel>, { about, description, address, teachers }: CreateWorkshop): void {
    let adr, tchrs;
    dispatch(new CreateAddress(address)).subscribe(data => adr = data);
    dispatch(new CreateTeachers(teachers)).subscribe(data => tchrs = data);

    const workshop = new Workshop(about.value, description.value, adr, tchrs);
    console.log(workshop)

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
