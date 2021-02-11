import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { ChangeAuthorization, ToggleLoading } from './app.actions';

export interface AppStateModel {
  isLoading: boolean;
  isAuthorized: boolean;
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    isLoading: true,
    isAuthorized: false,
  }
})
@Injectable()
export class AppState {

  @Action(ToggleLoading)
  toggleLoading({ patchState }: StateContext<AppStateModel>, { payload }: ToggleLoading): void {
    patchState({ isLoading: payload});
  } 
  @Action(ChangeAuthorization)
      changeAuthorization({ patchState }: StateContext<AppStateModel>, { payload }: ChangeAuthorization): void {
      patchState({ isAuthorized: payload});
  }
  @Selector()
  static isAuthorized(state: AppStateModel) {
      return state.isAuthorized;
  }
  
}
