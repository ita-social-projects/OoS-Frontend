import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { ChildCard } from '../models/child-card.model';
import { ChildCardService } from '../services/child-cards/child-cards.service';
import { getCards, SetLocation } from './user.actions';

export interface UserStateModel {
  childCards: ChildCard[],
  city: String,
  lng: Number | null,
  lat: Number | null
 
}

@State<UserStateModel>({
  name: 'location',
  defaults: {
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
  constructor(private cardsService: ChildCardService){}

  @Action(SetLocation)
  setLocation({ patchState }: StateContext<UserStateModel>, { payload }: SetLocation): void {
    patchState({ city: payload.city, lng: payload.lng, lat: payload.lat});
  } 
  @Action(getCards)
    getCards({ patchState }: StateContext<UserStateModel>) {
      return this.cardsService.getCards().subscribe(
        (childCards: ChildCard[]) => patchState({childCards})
      )
    }
}
