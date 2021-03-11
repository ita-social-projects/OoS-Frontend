import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';

import { ChildCard } from '../models/child-card.model';
import { ChildCardService } from '../services/child-cards/child-cards.service';

import { ChildActivities } from '../models/child-activities.model';
import { ChildrenActivitiesListService } from '../services/children-activities-list/children-activities-list.service';
// import { GetChildrenActivitiesList } from './user.actions';

import { SetLocation } from './user.actions';


export interface UserStateModel {
  childrenActivitiesList: any;
  childCards: ChildCard[],
  city: String;
  lng: Number | null;
  lat: Number | null;
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    childrenActivitiesList: [],
    childCards: [],
    city: "",
    lng: null,
    lat: null
  }
})

@Injectable()
export class UserState {

  @Selector()
  static childrenCards(state: UserStateModel) {
    return state.childCards
  }
  constructor(private cardsService: ChildCardService, private childrenActivitiesListService: ChildrenActivitiesListService){}

  @Selector()
  static childrenList(state: UserStateModel) {
    return state.childrenActivitiesList
  }



  @Action(SetLocation)
  setLocation({ patchState }: StateContext<UserStateModel>, { payload }: SetLocation): void {
    patchState({ city: payload.city, lng: payload.lng, lat: payload.lat});

  } 
 
  
 
}

