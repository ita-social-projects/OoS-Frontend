import { Navigation } from './../models/navigation.model';
import { State,Action,StateContext,Selector } from "@ngxs/store";
import { Injectable } from '@angular/core';
import { AddNavPath, DeleteNavPath, RemoveLastNavPath } from './navigation.actions';


export interface NavStateModel {
    navigation: Navigation[];
}

@State<NavStateModel>({
  name:'navigation',
  defaults: {
      navigation:[]
  }
})

@Injectable()
export class NavigationState {

  @Selector()
  static navigationPaths(state: NavStateModel): Navigation[] {return state.navigation}

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
}