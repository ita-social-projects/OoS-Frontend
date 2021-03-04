import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
<<<<<<< HEAD
import { ChildCard } from '../models/child-card.model';
import { ChildCardService } from '../services/child-cards/child-cards.service';
import { getCards, SetLocation } from './user.actions';

export interface UserStateModel {
  childCards: ChildCard[],
  city: String,
  lng: Number | null,
  lat: Number | null
 
=======
import { ChildActivities } from '../models/child-activities.model';
import { ChildrenActivitiesListService } from '../services/children-activities-list/children-activities-list.service';
import { GetChildrenActivitiesList, SetLocation } from './user.actions';

export interface UserStateModel {
  city: String;
  lng: Number | null;
  lat: Number | null;
  childrenActivitiesList: ChildActivities[];
>>>>>>> develop
}

@State<UserStateModel>({
  name: 'location',
  defaults: {
    childCards: [],
    city: "",
    lng: null,
    lat: null,
    childrenActivitiesList: []
  }
})
@Injectable()
export class UserState {
  @Selector()
  static childrenCards(state: UserStateModel) {
    return state.childCards
  }
  constructor(private cardsService: ChildCardService){}

  @Selector()
  static childrenList(state: UserStateModel) {
    return state.childrenActivitiesList
  }

  constructor(private childrenActivitiesListService: ChildrenActivitiesListService){}

  @Action(SetLocation)
  setLocation({ patchState }: StateContext<UserStateModel>, { payload }: SetLocation): void {
    patchState({ city: payload.city, lng: payload.lng, lat: payload.lat});
<<<<<<< HEAD
  } 
  @Action(getCards)
    getCards({ patchState }: StateContext<UserStateModel>) {
      return this.cardsService.getCards().subscribe(
        (childCards: ChildCard[]) => patchState({childCards})
      )
    }
=======
  }
  
  @Action(GetChildrenActivitiesList)
  getChildrenList({ patchState }: StateContext<UserStateModel>) {
    return this.childrenActivitiesListService.getChildrenList().subscribe(
      (childrenActivitiesList: ChildActivities[]) => patchState({childrenActivitiesList})
    )
  }
>>>>>>> develop
}
