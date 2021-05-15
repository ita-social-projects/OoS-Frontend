import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { ChangePage, SetLocation, ToggleLoading } from './app.actions';

export interface AppStateModel {
  isLoading: boolean;
  isMainPage: boolean;
  city: String;
  lng: Number | null;
  lat: Number | null;
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    isLoading: false,
    isMainPage: true,
    city: "",
    lng: null,
    lat: null
  }
})
@Injectable()
export class AppState {
  @Selector()
  static isMainPage(state: AppStateModel) { return state.isMainPage }

  @Selector()
  static isLoading(state: AppStateModel) { return state.isLoading }
  constructor() { }

  @Action(ToggleLoading)
  toggleLoading({ patchState }: StateContext<AppStateModel>, { payload }: ToggleLoading): void {
    patchState({ isLoading: payload });
  }

  @Action(ChangePage)
  changePage({ patchState }: StateContext<AppStateModel>, { payload }: ToggleLoading): void {
    patchState({ isMainPage: payload });
  }

  @Action(SetLocation)
  setLocation({ patchState }: StateContext<AppStateModel>, { payload }: SetLocation): void {
    patchState({ city: payload.city, lng: payload.lng, lat: payload.lat });
  }
}
