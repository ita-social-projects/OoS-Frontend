import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { SetLocation, SetBreadCrumb } from './user.actions';

export interface UserStateModel {
  city: String;
  lng: Number | null;
  lat: Number | null;
  activeLink: ActiveLink
}

export interface ActiveLink {
  breadCrumb: string;
  urlLink: string;
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    city: "",
    lng: null,
    lat: null,
    activeLink: {
      breadCrumb: '',
      urlLink: ''
    }
  }
})
@Injectable()
export class UserState {
  
  @Selector()
  static activeLink(state: UserStateModel) {
    return state.activeLink;
  }

  constructor(){}

  @Action(SetLocation)
  setLocation({ patchState }: StateContext<UserStateModel>, { payload }: SetLocation): void {
    patchState({ city: payload.city, lng: payload.lng, lat: payload.lat});
  }

  @Action(SetBreadCrumb)
  setBreadCrumb({ patchState }: StateContext<UserStateModel>, { payload }: SetBreadCrumb): void {
    patchState({ activeLink: { breadCrumb: payload.breadCrumb, urlLink: payload.urlLink } })
  }
}
