import { Navigation } from './../models/navigation.model';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Injectable } from '@angular/core';
import { AddNavPath, SidenavToggle, DeleteNavPath, RemoveLastNavPath, FiltersSidenavToggle } from './navigation.actions';
export interface NavStateModel {
  navigation: Navigation[];
  sidenavOpen: boolean;
  filtersSidenavOpen: boolean;
}
@State<NavStateModel>({
  name: 'navigation',
  defaults: {
    navigation: [],
    sidenavOpen: false,
    filtersSidenavOpen: false
  }
})

@Injectable()
export class NavigationState {

  @Selector()
  static navigationPaths(state: NavStateModel): Navigation[] { return state.navigation; }

  @Selector()
  static sidenavOpenTrue(state: NavStateModel): boolean { return state.sidenavOpen; }

  @Selector()
  static filtersSidenavOpenTrue(state: NavStateModel): boolean { return state.filtersSidenavOpen; }

  @Selector()
  static navigationPathsMobile(state: NavStateModel): Navigation[] {
    const navigation = [...state.navigation];
    return [navigation.pop()];
  }

  @Action(AddNavPath)
  addNavPath({ patchState }: StateContext<NavStateModel>, { payload }: AddNavPath): void {
    patchState({
      navigation: payload
    });
  }

  @Action(RemoveLastNavPath)
  removeNavPath({ getState, patchState }: StateContext<NavStateModel>): void {
    const state = getState().navigation;
    state.pop();
    patchState({
      navigation: [...state]
    });
  }

  @Action(DeleteNavPath)
  deleteNavPath({ patchState }: StateContext<NavStateModel>): void {
    patchState({
      navigation: []
    });
  }

  @Action(SidenavToggle)
  SidenavToggle({ patchState, getState }: StateContext<NavStateModel>): void {
    const sidenavOpenState = getState().sidenavOpen;
    patchState({
      sidenavOpen: !sidenavOpenState
    });
  }

  @Action(FiltersSidenavToggle)
  FiltersSidenavToggle({ patchState, getState }: StateContext<NavStateModel>): void {
    const filtersSidenavOpenState = getState().filtersSidenavOpen;
    patchState({
      filtersSidenavOpen: !filtersSidenavOpenState
    });
  }

}
