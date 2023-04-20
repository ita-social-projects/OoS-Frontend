import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { ActivateEditMode, MarkFormDirty, ShowMessageBar, ToggleMobileScreen } from './app.actions';

export interface AppStateModel {
  isDirtyForm: boolean;
  isEditMode: boolean;
  isMobileScreen: undefined | boolean;
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    isDirtyForm: false,
    isEditMode: false,
    isMobileScreen: undefined
  }
})
@Injectable()
export class AppState {
  @Selector()
  static isMobileScreen(state: AppStateModel): boolean {
    return state.isMobileScreen;
  }

  @Selector()
  static isDirtyForm(state: AppStateModel): boolean {
    return state.isDirtyForm;
  }

  @Selector()
  static isEditMode(state: AppStateModel): boolean {
    return state.isEditMode;
  }

  constructor() {}

  @Action(MarkFormDirty)
  markFormDirty({ patchState }: StateContext<AppStateModel>, { payload }: MarkFormDirty): void {
    patchState({ isDirtyForm: payload });
  }

  @Action(ActivateEditMode)
  activateEditMode({ patchState }: StateContext<AppStateModel>, { payload }: ActivateEditMode): void {
    patchState({ isEditMode: payload });
  }

  @Action(ShowMessageBar)
  showMessageBar({}: StateContext<AppStateModel>, {}: ShowMessageBar): void {}

  @Action(ToggleMobileScreen)
  ToggleMobileScreen({ patchState }: StateContext<AppStateModel>, { payload }: ActivateEditMode): void {
    patchState({ isMobileScreen: payload });
  }
}
