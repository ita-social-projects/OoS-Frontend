import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { setMinAge, setMaxAge, SetOrder } from './filter.actions';

export interface FilterStateModel {
  searchQuery: string;
  city: string;
  stateOwnership: boolean;
  privateOwnership: boolean;
  isRecruiting: boolean;
  ageFrom: number;
  ageTo: number;
  categories: [];
  order: string;
}

@State<FilterStateModel>({
  name: 'filter',
  defaults: {
    searchQuery: '',
    city: '',
    stateOwnership: true,
    privateOwnership: true,
    isRecruiting: true,
    ageFrom: null,
    ageTo: null,
    categories: [],
    order: 'ratingDesc'
  }
})
@Injectable()
export class FilterState {

  @Action(setMinAge)
    setMinAge({ patchState }: StateContext<FilterStateModel>, { payload }: setMinAge): void {
      patchState({ ageFrom: payload })
    }
  @Action(setMaxAge)
    setMaxAge({ patchState }: StateContext<FilterStateModel>, { payload }: setMaxAge): void {
      patchState({ ageTo: payload })
    }
  @Action(SetOrder)
  setOrder({ patchState }: StateContext<FilterStateModel>, { payload }: SetOrder){
    patchState({ order: payload});
  }

}
