import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageBarComponent } from 'shared/components/message-bar/message-bar.component';
import { ActivateEditMode, ClearMessageBar, MarkFormDirty, ShowMessageBar, ToggleMobileScreen } from './app.actions';

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
  constructor(private snackBar: MatSnackBar) {}

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

  @Action(MarkFormDirty)
  markFormDirty({ patchState }: StateContext<AppStateModel>, { payload }: MarkFormDirty): void {
    patchState({ isDirtyForm: payload });
  }

  @Action(ActivateEditMode)
  activateEditMode({ patchState }: StateContext<AppStateModel>, { payload }: ActivateEditMode): void {
    patchState({ isEditMode: payload });
  }

  @Action(ShowMessageBar)
  showMessageBar({}: StateContext<AppStateModel>, { payload }: ShowMessageBar): void {
    this.snackBar.openFromComponent(MessageBarComponent, {
      duration: payload.infinityDuration ? null : payload.duration || 5000,
      verticalPosition: payload.verticalPosition || 'top',
      horizontalPosition: payload.horizontalPosition || 'center',
      panelClass: payload.type,
      data: payload
    });
  }

  @Action(ClearMessageBar)
  clearMessageBar({}: StateContext<AppStateModel>): void {
    this.snackBar.dismiss();
  }

  @Action(ToggleMobileScreen)
  ToggleMobileScreen({ patchState }: StateContext<AppStateModel>, { payload }: ActivateEditMode): void {
    patchState({ isMobileScreen: payload });
  }
}
