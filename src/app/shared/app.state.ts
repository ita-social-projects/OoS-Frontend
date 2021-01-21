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
    static toggleLoading({ patchState }: StateContext<AppStateModel>, { payload }: ToggleLoading): void {
        patchState({ isLoading: payload});
    }

}
