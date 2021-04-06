import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CategoriesIconsService } from '../services/categories-icons/categories-icons.service';
import { CityList, GetCategoriesIcons } from './meta-data.actions';


export interface MetaDataStateModel {
  filteredCities: string[];
  categoriesIcons: {};
}

@State<MetaDataStateModel>({
  name: 'metaDataState',
  defaults: {
    filteredCities: [],
    categoriesIcons: {}
  }
    
})
@Injectable()
export class MetaDataState {

  @Selector()
  static filteredCities(state: MetaDataStateModel) {
    return state.filteredCities;
  }
  @Selector()
  static categoriesIcons(state: MetaDataStateModel) {
    return state.categoriesIcons;
  }

  constructor(private categoriesIconsService: CategoriesIconsService) {}

  @Action(CityList)
  cityList({ patchState }: StateContext<MetaDataStateModel>, { payload }: CityList): void {
    patchState({ filteredCities: payload});
  }
  @Action(GetCategoriesIcons)
  getCategoriesIcons({ patchState }: StateContext<MetaDataStateModel>) {
    return this.categoriesIconsService.getIcons()
    .subscribe((categoriesIcons: {}) => patchState({categoriesIcons}))
  }
    
}
