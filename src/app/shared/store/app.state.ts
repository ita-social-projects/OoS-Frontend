import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { ToggleLoading } from './app.actions';

export interface AppStateModel {
    isLoading: boolean;
}

@State<AppStateModel>({
    name: 'app',
    defaults: {
        isLoading: true,
    }
})
@Injectable()
export class AppState {

    @Action(ToggleLoading)
    toggleLoading({ patchState }: StateContext<AppStateModel>, { payload }: ToggleLoading): void {
        patchState({ isLoading: payload});
    }

}
