import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { ChildActivities } from '../models/child-activities.model';
import { ChildrenActivitiesListService } from '../services/children-activities-list/children-activities-list.service';
import { GetChildrenActivitiesList, SetLocation } from './user.actions';

export interface UserStateModel {
  city: String;
  lng: Number | null;
  lat: Number | null;
  childrenActivitiesList: ChildActivities[];
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    city: "",
    lng: null,
    lat: null,
    childrenActivitiesList: []
  }
})
@Injectable()
export class UserState {

  @Selector()
  static childrenList(state: UserStateModel) {
    return state.childrenActivitiesList
  }

  constructor(private childrenActivitiesListService: ChildrenActivitiesListService){}

  @Action(SetLocation)
  setLocation({ patchState }: StateContext<UserStateModel>, { payload }: SetLocation): void {
    patchState({ city: payload.city, lng: payload.lng, lat: payload.lat});
  }
  
  @Action(GetChildrenActivitiesList)
  getChildrenList({ patchState }: StateContext<UserStateModel>) {
    return this.childrenActivitiesListService.getChildrenList().subscribe(
      (childrenActivitiesList: ChildActivities[]) => patchState({childrenActivitiesList})
    )
  }
}
