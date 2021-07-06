import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { Navigation } from './../models/navigation.model';
import { State,Action,StateContext,Selector } from "@ngxs/store";
import { Injectable } from '@angular/core';
import { AddNavPath, DeleteNavPath, RemoveLastNavPath } from './navigation.actions';


export interface NavStateModel {
    navigation: Navigation[];
    isMobileView: boolean;
}

@State<NavStateModel>({
  name:'navigation',
  defaults: {
      navigation:[],
      isMobileView: false,
  }
})

@Injectable()
export class NavigationState {

  @Selector()
  static navigationPaths(state: NavStateModel): Navigation[] {return state.navigation}

  @Selector()
  static navigationPathsMobile(state: NavStateModel): Navigation[] {
    return state.navigation.filter(path => path.name !== NavBarName.MainPage)
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
}