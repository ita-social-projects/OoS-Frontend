import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Address } from '../models/address.model';
import { Teacher } from '../models/teacher.model';
import { Workshop } from '../models/workshop.model';
import { ChildCardService } from '../services/child-cards/child-cards.service';
import { ProviderWorkshopsService } from '../services/workshops/provider-workshops/provider-workshops';
import { CreateAddress, CreateTeachers, CreateWorkshop, GetWorkshop } from './provider.actions';

export interface ProviderStateModel {
  workshopsList: Workshop[];
}

@State<ProviderStateModel>({
  name: 'provider',
  defaults: {
  workshopsList: []
  }
})
@Injectable()
export class ProviderState {
  postUrl = '/Workshop/Create';

  @Selector()
  static workshopsList(state: ProviderStateModel) {
    return state.workshopsList
  }

  constructor(
    private providerWorkshopsService: ProviderWorkshopsService, 
    private childCardsService : ChildCardService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  @Action(GetWorkshop)
  getWorkshop({ patchState }: StateContext<ProviderStateModel>) {
      return  this.providerWorkshopsService.getWorkshops().subscribe(
        (workshopsList: Workshop[]) => patchState({workshopsList})
      )
  }

  @Action(CreateWorkshop)
  createWorkshop({ dispatch }: StateContext<ProviderStateModel>, { about, description, address, teachers }: CreateWorkshop): void {
    let adr, tchrs;
    dispatch(new CreateAddress(address)).subscribe(data => adr = data);
    dispatch(new CreateTeachers(teachers)).subscribe(data => tchrs = data);

    const workshop = new Workshop(about.value, description.value, adr, tchrs);

    this.providerWorkshopsService.createWorkshop(workshop);
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
