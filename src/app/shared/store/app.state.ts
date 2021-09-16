import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { ActivateEditMode, MarkFormDirty, SetLocation, ShowMessageBar } from './app.actions';

export interface AppStateModel {
  city: String;
  lng: Number | null;
  lat: Number | null;
  isDirtyForm: boolean,
  isEditMode: boolean
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    city: "",
    lng: null,
    lat: null,
    isDirtyForm: false,
    isEditMode: false
  }
})
@Injectable()
export class AppState {

  @Selector()
  static isDirtyForm(state: AppStateModel): boolean { return state.isDirtyForm }

  @Selector()
  static isEditMode(state: AppStateModel): boolean { return state.isEditMode }

  constructor() { }

  @Action(SetLocation)
  setLocation({ patchState }: StateContext<AppStateModel>, { payload }: SetLocation): void {
    patchState({ city: payload.city, lng: payload.lng, lat: payload.lat });
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
  showMessageBar({ }: StateContext<AppStateModel>, { }: ShowMessageBar): void { }
}
