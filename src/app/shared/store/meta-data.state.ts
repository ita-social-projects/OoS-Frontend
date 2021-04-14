import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { CategoriesIconsService } from '../services/categories-icons/categories-icons.service';
import { City } from '../services/filters-services/city-filter/city-filter.service';
import { keyWord } from '../services/key-words/key-words.service';
import { CityList, GetCategoriesIcons, KeyWordsList } from './meta-data.actions';


export interface MetaDataStateModel {
  filteredCities: City[];
  categoriesIcons: {};
  filteredkeyWords: keyWord[];
}

@State<MetaDataStateModel>({
  name: 'metaDataState',
  defaults: {
    filteredCities: [],
    categoriesIcons: {},
    filteredkeyWords: [],
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
  @Selector()
  static filteredkeyWords(state: MetaDataStateModel) {
    return state.filteredkeyWords;
  }

  constructor(
    private categoriesIconsService: CategoriesIconsService) {}

  @Action(CityList)
  cityList({ patchState }: StateContext<MetaDataStateModel>, { payload }: CityList): void {
    patchState({ filteredCities: payload});
  }
  @Action(GetCategoriesIcons)
  getCategoriesIcons({ patchState }: StateContext<MetaDataStateModel>) {
    return this.categoriesIconsService.getIcons()
    .subscribe((categoriesIcons: {}) => patchState({categoriesIcons}))
  }
  @Action(KeyWordsList)
  keyWordsList({ patchState }: StateContext<MetaDataStateModel>, { payload }: KeyWordsList): void {
    patchState({ filteredkeyWords: payload});
  }
    
}
