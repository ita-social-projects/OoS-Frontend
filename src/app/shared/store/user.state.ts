import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { SetLocation } from './user.actions';

export interface UserStateModel {
  city: String;
  lng: Number | null;
  lat: Number | null;
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    city: "",
    lng: null,
    lat: null
  }
})
@Injectable()
export class UserState {
  
  constructor(){}

  @Action(SetLocation)
  setLocation({ patchState }: StateContext<UserStateModel>, { payload }: SetLocation): void {
    patchState({ city: payload.city, lng: payload.lng, lat: payload.lat});
  }
}
