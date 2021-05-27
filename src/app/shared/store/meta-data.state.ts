import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Category, Subcategory, Subsubcategory } from '../models/category.model';
import { City } from '../models/city.model';
import { KeyWord } from '../models/keyWord,model';
import { CategoriesService } from '../services/categories/categories.service';
import { CityList, GetCategories, KeyWordsList } from './meta-data.actions';

export interface MetaDataStateModel {
  categories: Category[];
  subcategory: Subcategory[];
  subsubcategory: Subsubcategory[];
  filteredCities: City[];
  filteredkeyWords: KeyWord[];
}

@State<MetaDataStateModel>({
  name: 'metaDataState',
  defaults: {
    categories: [],
    subcategory: [],
    subsubcategory: [],
    filteredCities: [],
    filteredkeyWords: [],
  }

})
@Injectable()
export class MetaDataState {

  @Selector()
  static filteredCities(state: MetaDataStateModel): City[] { return state.filteredCities }

  @Selector()
  static categories(state: MetaDataStateModel): Category[] { return state.categories }

  @Selector()
  static subcategory(state: MetaDataStateModel): Subcategory[] { return state.subcategory }

  @Selector()
  static subsubcategory(state: MetaDataStateModel): Subsubcategory[] { return state.subsubcategory }

  @Selector()
  static filteredkeyWords(state: MetaDataStateModel): KeyWord[] { return state.filteredkeyWords }

  constructor(
    private categoriesService: CategoriesService) { }

  @Action(GetCategories)
  getCategories({ patchState }: StateContext<MetaDataStateModel>, { }: GetCategories) {
    return this.categoriesService
      .getCategories()
      .pipe(
        tap((appCategories: Category[]) => patchState({ categories: appCategories })
        ))
  }

  @Action(GetCategories)
  getCategories({ patchState }: StateContext<MetaDataStateModel>, { }: GetCategories) {
    return this.categoriesService
      .getCategories()
      .pipe(
        tap((appCategories: Category[]) => patchState({ categories: appCategories })
        ))
  }

  @Action(GetCategories)
  getCategories({ patchState }: StateContext<MetaDataStateModel>, { }: GetCategories) {
    return this.categoriesService
      .getCategories()
      .pipe(
        tap((appCategories: Category[]) => patchState({ categories: appCategories })
        ))
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
