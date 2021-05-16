import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Category } from '../models/category.model';
import { City } from '../models/city.model';
import { KeyWord } from '../models/keyWord,model';
import { CategoriesService } from '../services/categories/categories.service';
import { CityList, GetCategories, GetCategoriesIcons, KeyWordsList } from './meta-data.actions';

export interface MetaDataStateModel {
  categories: Category[];
  categoriesIcons: {};
  filteredCities: City[];
  filteredkeyWords: KeyWord[];
}

@State<MetaDataStateModel>({
  name: 'metaDataState',
  defaults: {
    categories: [],
    categoriesIcons: {},
    filteredCities: [],
    filteredkeyWords: [],
  }

})
@Injectable()
export class MetaDataState {

  @Selector()
  static filteredCities(state: MetaDataStateModel) { return state.filteredCities }

  @Selector()
  static categories(state: MetaDataStateModel) { return state.categories }

  @Selector()
  static categoriesIcons(state: MetaDataStateModel) { return state.categoriesIcons }

  @Selector()
  static filteredkeyWords(state: MetaDataStateModel) { return state.filteredkeyWords }

  constructor(
    private categoriesService: CategoriesService) { }

  @Action(GetCategories)
  getCategories({ patchState }: StateContext<MetaDataStateModel>, { }: GetCategories) {
    return this.categoriesService
      .getCategories()
      .subscribe((appCategories: Category[]) => patchState({ categories: appCategories }))
  }

  @Action(GetCategoriesIcons)
  getCategoriesIcons({ patchState }: StateContext<MetaDataStateModel>) {
    return this.categoriesService.getCategoriesIcons()
      .subscribe((categoriesIcons: {}) => patchState({ categoriesIcons }))
  }

  @Action(CityList)
  cityList({ patchState }: StateContext<MetaDataStateModel>, { payload }: CityList): void {
    patchState({ filteredCities: payload });
  }

  @Action(KeyWordsList)
  keyWordsList({ patchState }: StateContext<MetaDataStateModel>, { payload }: KeyWordsList): void {
    patchState({ filteredkeyWords: payload });
  }
}
