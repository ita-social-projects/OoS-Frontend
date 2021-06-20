import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Category, Subcategory, Subsubcategory } from '../models/category.model';
import { City } from '../models/city.model';
import { KeyWord } from '../models/keyWord,model';
import { SocialGroup } from '../models/socialGroup.model';
import { CategoriesService } from '../services/categories/categories.service';
import { ChildrenService } from '../services/children/children.service';
import {
  CityList,
  GetCategories,
  GetSubcategories,
  GetSubsubcategories,
  KeyWordsList,
  GetSocialGroup
} from './meta-data.actions';

export interface MetaDataStateModel {
  categories: Category[];
  subcategories: Subcategory[];
  subsubcategories: Subsubcategory[];
  filteredCities: City[];
  filteredkeyWords: KeyWord[];
  socialGroups: SocialGroup[],
}

@State<MetaDataStateModel>({
  name: 'metaDataState',
  defaults: {
    categories: [],
    subcategories: [],
    subsubcategories: [],
    filteredCities: [],
    filteredkeyWords: [],
    socialGroups: [],
  }

})
@Injectable()
export class MetaDataState {

  @Selector()
  static filteredCities(state: MetaDataStateModel): City[] { return state.filteredCities }

  @Selector()
  static categories(state: MetaDataStateModel): Category[] { return state.categories }

  @Selector()
  static subcategories(state: MetaDataStateModel): Subcategory[] { return state.subcategories }

  @Selector()
  static subsubcategories(state: MetaDataStateModel): Subsubcategory[] { return state.subsubcategories }

  @Selector()
  static filteredkeyWords(state: MetaDataStateModel): KeyWord[] { return state.filteredkeyWords }

  @Selector()
  static socialGroups(state: MetaDataStateModel): SocialGroup[] { return state.socialGroups }

  constructor(
    private categoriesService: CategoriesService,
    private childrenService: ChildrenService) { }

  @Action(GetCategories)
  getCategories({ patchState }: StateContext<MetaDataStateModel>, { }: GetCategories) {
    return this.categoriesService
      .getCategories()
      .pipe(
        tap((categories: Category[]) => patchState({ categories: categories })
        ))
  }

  @Action(GetSubcategories)
  getSubcategories({ patchState }: StateContext<MetaDataStateModel>, { payload }: GetSubcategories) {
    return this.categoriesService
      .getBySubcategoryByCategoryId(payload)
      .pipe(
        tap((subcategories: Subcategory[]) => patchState({ subcategories: subcategories })
        ))
  }

  @Action(GetSubsubcategories)
  getSubsubcategories({ patchState }: StateContext<MetaDataStateModel>, { payload }: GetSubsubcategories) {
    return this.categoriesService
      .getBySubsubcategoryBySubcategoryId(payload)
      .pipe(
        tap((subsubcategories: Subsubcategory[]) => patchState({ subsubcategories: subsubcategories })
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

  @Action(GetSocialGroup)
  getSocialGroup({ patchState }: StateContext<MetaDataStateModel>, { }: GetSocialGroup) {
    return this.childrenService
      .getSocialGroup()
      .pipe(
        tap((socialGroups: SocialGroup[]) => patchState({ socialGroups: socialGroups })
        ))
  }
}
