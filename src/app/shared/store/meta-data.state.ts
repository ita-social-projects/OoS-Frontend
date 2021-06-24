import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
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
  GetSocialGroup,
  GetCategoryById,
  GetSubcategoryById,
  GetSubsubcategoryById,
  OnGetCategoryByIdSuccess,
  OnGetSubcategoryByIdSuccess,
  OnGetSubsubcategoryByIdSuccess
} from './meta-data.actions';

export interface MetaDataStateModel {
  categories: Category[];
  subcategories: Subcategory[];
  subsubcategories: Subsubcategory[];
  filteredCities: City[];
  filteredkeyWords: KeyWord[];
  socialGroups: SocialGroup[],
  selectedCategory: Category,
  selectedSubcategory: Subcategory,
  selectedSubsubcategory: Subsubcategory,
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
    selectedCategory: undefined,
    selectedSubcategory: undefined,
    selectedSubsubcategory: undefined,
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
  static selectedCategory(state: MetaDataStateModel): Category { return state.selectedCategory }

  @Selector()
  static selectedSubcategory(state: MetaDataStateModel): Subcategory { return state.selectedSubcategory }

  @Selector()
  static selectedSubsubcategory(state: MetaDataStateModel): Subsubcategory { return state.selectedSubsubcategory }

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
      .getSubcategoryByCategoryId(payload)
      .pipe(
        tap((subcategories: Subcategory[]) => patchState({ subcategories: subcategories })
        ))
  }

  @Action(GetSubsubcategories)
  getSubsubcategories({ patchState }: StateContext<MetaDataStateModel>, { payload }: GetSubsubcategories) {
    return this.categoriesService
      .getSubsubcategoryBySubcategoryId(payload)
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

  @Action(GetCategoryById)
  getCategoryById({ dispatch }: StateContext<MetaDataStateModel>, { payload }: GetCategoryById) {
    return this.categoriesService
      .getCategoryById(payload)
      .pipe(
        tap((res) => dispatch(new OnGetCategoryByIdSuccess(res)),
        catchError((error: Error) => of(console.log(error)))
        ))
  }

  @Action(OnGetCategoryByIdSuccess)
  onGetCategoryByIdSuccess({  }: StateContext<MetaDataStateModel>, { payload }: OnGetCategoryByIdSuccess): void {
  }

  @Action(GetSubcategoryById)
  getSubcategoryById({ dispatch }: StateContext<MetaDataStateModel>, { payload }: GetSubcategoryById) {
    return this.categoriesService
      .getSubcategoryById(payload)
      .pipe(
        tap((res) => dispatch(new OnGetSubcategoryByIdSuccess(res)),
        catchError((error: Error) => of(console.log(error)))
        ))
  }

  @Action(OnGetSubcategoryByIdSuccess)
  onGetSubcategoryByIdSuccess({  }: StateContext<MetaDataStateModel>, { payload }: OnGetSubcategoryByIdSuccess): void {
  }

  @Action(GetSubsubcategoryById)
  getSubsubcategoryById({ dispatch }: StateContext<MetaDataStateModel>, { payload }: GetSubsubcategoryById) {
    return this.categoriesService
      .getSubsubCategoryById(payload)
      .pipe(
        tap((res) => dispatch(new OnGetSubsubcategoryByIdSuccess(res)),
        catchError((error: Error) => of(console.log(error)))
        ))
  }

  @Action(OnGetSubsubcategoryByIdSuccess)
  onGetSubsubcategoryByIdSuccess({ patchState }: StateContext<MetaDataStateModel>, { payload }: OnGetSubsubcategoryByIdSuccess): void {
    patchState({ selectedSubsubcategory: payload })
  }
}
