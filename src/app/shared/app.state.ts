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
export class AppState {

    @Action(ToggleLoading)
    static toggleLoading({ getState, patchState }: StateContext<AppStateModel>): void {
        patchState({ isLoading: !getState().isLoading});
    }

}
