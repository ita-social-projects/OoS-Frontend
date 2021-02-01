import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { SelectCity, ToggleLoading } from './app.actions';

export interface AppStateModel {
  isLoading: boolean;
  city:string;
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    isLoading: true,
    city:''
  }
})
@Injectable()
export class AppState {

  @Action(ToggleLoading)
  toggleLoading({ patchState }: StateContext<AppStateModel>, { payload }: ToggleLoading): void {
      patchState({ isLoading: payload});
  }
  @Action(SelectCity)
    selectCity({ patchState }: StateContext<AppStateModel>, { payload }: SelectCity): void {
      patchState({ city: payload});
  }

}
