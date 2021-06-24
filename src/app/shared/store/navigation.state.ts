import { Nav } from './../models/navigation.model';
import { State,Action,StateContext,Selector } from "@ngxs/store";
import { Injectable } from '@angular/core';
import { AddNavPath, DeleteNavPath, RemoveNavPath } from './navigation.actions';


export interface NavStateModel {
    navPath: Nav[];
}

@State<NavStateModel>({
  name:'navPath',
  defaults: {
      navPath:[]
  }
})

@Injectable()
export class NavigationState {

  @Selector()
  static getNavPath(state: NavStateModel): Nav[] {return state.navPath}

  @Action(AddNavPath)
    addNavPath({patchState}:StateContext<NavStateModel>,{payload}:AddNavPath): void {
        patchState({
            navPath: payload
        })
    }
    
    @Action(RemoveNavPath)
    removeNavPath({getState,patchState}:StateContext<NavStateModel>): void {
        const state = getState().navPath
        state.pop();
        patchState({
            navPath: [...state]
        })
    }

    @Action(DeleteNavPath)
    deleteNavPath({patchState}:StateContext<NavStateModel>):void {
        patchState({
            navPath: []
        })
    }

}