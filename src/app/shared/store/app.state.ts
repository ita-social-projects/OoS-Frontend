import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { ChangePage, ToggleLoading } from './app.actions';

export interface AppStateModel {
  isLoading: boolean;
  isMainPage:boolean;
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    isLoading: true,
    isMainPage: true
  }
})
@Injectable()
export class AppState {
  @Selector()
    static isMainPage(state: AppStateModel) {
    return state.isMainPage;
  }
  @Action(ToggleLoading)
  toggleLoading({ patchState }: StateContext<AppStateModel>, { payload }: ToggleLoading): void {
    patchState({ isLoading: payload});
  }
  @Action(ChangePage)
  changePage({ patchState }: StateContext<AppStateModel>, { payload }: ToggleLoading): void {
    patchState({ isMainPage: payload});
  }
}
