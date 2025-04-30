import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageBarComponent } from 'shared/components/message-bar/message-bar.component';
import { TimerData } from 'shared/models/server-error';
import { Parent } from 'shared/models/parent.model';
import { Provider } from 'shared/models/provider.model';
import { Employee } from 'shared/models/employee.model';
import { MinistryAdmin } from 'shared/models/ministry-admin.model';
import { RegionAdmin } from 'shared/models/region-admin.model';
import { AreaAdmin } from 'shared/models/area-admin.model';
import { User } from 'shared/models/user.model';
import {
  ActivateEditMode,
  ClearMessageBar,
  ClearPersonalInfo,
  ClearProfile,
  MarkFormDirty,
  SetErrorTimerData,
  SetPersonalInfo,
  SetProfile,
  ShowMessageBar,
  ToggleMobileScreen
} from './app.actions';

export interface AppStateModel {
  profile: Parent | Provider | Employee | MinistryAdmin | RegionAdmin | AreaAdmin | null;
  personalInfo: User | null;
  isDirtyForm: boolean;
  isEditMode: boolean;
  isMobileScreen: undefined | boolean;
  timerErrorTime: TimerData;
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    profile: undefined,
    personalInfo: undefined,
    isDirtyForm: false,
    isEditMode: false,
    isMobileScreen: undefined,
    timerErrorTime: { timerValue: 1000, time: 0 }
  }
})
@Injectable()
export class AppState {
  constructor(private snackBar: MatSnackBar) {}

  @Selector()
  static profile(state: AppStateModel): Parent | Provider | Employee | MinistryAdmin | RegionAdmin | AreaAdmin | null {
    return state.profile;
  }

  @Selector()
  static personalInfo(state: AppStateModel): User | null {
    return state.personalInfo;
  }

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

  @Selector()
  static timerErrorTime(state: AppStateModel): TimerData {
    return state.timerErrorTime;
  }

  @Action(SetProfile)
  setProfile({ patchState }: StateContext<AppStateModel>, { payload }: SetProfile): void {
    patchState({ profile: payload });
  }

  @Action(ClearProfile)
  clearProfile({ patchState }: StateContext<AppStateModel>): void {
    patchState({ profile: null });
  }

  @Action(SetPersonalInfo)
  setPersonalInfo({ patchState }: StateContext<AppStateModel>, { payload }: SetPersonalInfo): void {
    patchState({ personalInfo: payload });
  }

  @Action(ClearPersonalInfo)
  clearPersonalInfo({ patchState }: StateContext<AppStateModel>): void {
    patchState({ personalInfo: null });
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

  @Action(SetErrorTimerData)
  setErrorTimerData({ patchState }: StateContext<AppStateModel>, { payload }: SetErrorTimerData): void {
    // check if 10 minutes have passed since the last click and change timer values
    const isTimeExpired = payload.time && Date.now() - payload.time >= 10 * 60 * 1000;

    /**
     * Sets values based on the time elapsed since the user's last interaction.
     * - If the user clicks after 10 minutes or more, default values are set.
     * - Otherwise, values are taken from the component's timer.
     *
     * Logic:
     * - @timerValue : If the timer value is >= 32 seconds, it is set to 1 minute.
     *                Else, the timer value is doubled.
     * - @time : If @timerValue is more than one second, the current time is set.
     *          Else, the time is taken from the component.
     */

    const newData: TimerData = isTimeExpired
      ? { timerValue: 1000, time: 0 } // default values
      : {
          timerValue: payload.timerValue / 1000 >= 32 ? 60 * 1000 : payload.timerValue * 2,
          time: payload.timerValue === 1000 ? Date.now() : payload.time
        };
    patchState({ timerErrorTime: newData });
  }
}
