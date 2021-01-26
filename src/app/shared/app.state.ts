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
    // tslint:disable-next-statement
    toggleLoading({ patchState }: StateContext<AppStateModel>, { payload }: ToggleLoading): void {
        patchState({ isLoading: payload});
    }

}
