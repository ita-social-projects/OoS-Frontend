import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Workshop } from '../models/workshop.model';
import { AppWorkshopsService } from '../services/workshops/app-workshop/app-workshops.service';
import { ChangePage, GetWorkshops, SetLocation, ToggleLoading } from './app.actions';
import { FilterStateModel } from './filter.state';

export interface AppStateModel {
  isLoading: boolean;
  isMainPage: boolean;
  city: String;
  lng: Number | null;
  lat: Number | null;
  allWorkshops: Workshop[];
}

@State<AppStateModel>({
  name: 'app',
  defaults: {
    isLoading: false,
    isMainPage: true,
    city: "",
    lng: null,
    lat: null,
    allWorkshops: [],
  }
})
@Injectable()
export class AppState {
  @Selector()
  static isMainPage(state: AppStateModel): boolean { return state.isMainPage }

  @Selector()
  static isLoading(state: AppStateModel): boolean { return state.isLoading }

  @Selector()
  static allWorkshops(state: AppStateModel): Workshop[] { return state.allWorkshops }

  constructor(private appWorkshopsService: AppWorkshopsService) { }

  @Action(ToggleLoading)
  toggleLoading({ patchState }: StateContext<AppStateModel>, { payload }: ToggleLoading): void {
    patchState({ isLoading: payload });
  }

  @Action(ChangePage)
  changePage({ patchState }: StateContext<AppStateModel>, { payload }: ToggleLoading): void {
    patchState({ isMainPage: payload });
  }

  @Action(SetLocation)
  setLocation({ patchState }: StateContext<AppStateModel>, { payload }: SetLocation): void {
    patchState({ city: payload.city, lng: payload.lng, lat: payload.lat });
  }

  @Action(GetWorkshops)
  getWorkshops({ patchState }: StateContext<AppStateModel>, { }: GetWorkshops) {
    return this.appWorkshopsService
      .getAllWorkshops()
      .subscribe((workshops: Workshop[]) => patchState({ allWorkshops: workshops }))
  }
}
