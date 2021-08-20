import { Navigation } from './../models/navigation.model';
import { State,Action,StateContext,Selector } from "@ngxs/store";
import { Injectable } from '@angular/core';
import { AddNavPath, ChangeVisible, DeleteNavPath, RemoveLastNavPath } from './navigation.actions';

export interface NavStateModel {
  navigation: Navigation[];
  isVisible: boolean;
}

@State<NavStateModel>({
  name:'navigation',
  defaults: {
    navigation: [],
    isVisible: false
  }
})

@Injectable()
export class NavigationState {

  @Selector()
  static navigationPaths(state: NavStateModel): Navigation[] { return state.navigation }

  @Selector()
  static isVisibleTrue(state: NavStateModel): boolean {return state.isVisible}

  @Selector()
  static navigationPathsMobile(state: NavStateModel): Navigation[] {
     const navigation = [...state.navigation]
     return [navigation.pop()]
  }

  @Action(AddNavPath)
    addNavPath({patchState}:StateContext<NavStateModel>,{payload}: AddNavPath): void {
      patchState({
        navigation: payload
      })
    }

  @Action(RemoveLastNavPath)
  removeNavPath({getState,patchState}:StateContext<NavStateModel>): void {
    const state = getState().navigation
    state.pop();
    patchState({
      navigation: [...state]
    })
  }

  @Action(DeleteNavPath)
  deleteNavPath({patchState}:StateContext<NavStateModel>): void {
    patchState({
      navigation: []
    })
  }

  @Action(ChangeVisible)
  changeVisible({patchState,getState}:StateContext<NavStateModel>): void {
    const isVisibleState = getState().isVisible
        patchState({
          isVisible: !isVisibleState
        })
      }

}


