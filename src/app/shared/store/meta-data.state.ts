import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Class, Department, Direction } from '../models/category.model';
import { City } from '../models/city.model';
import { KeyWord } from '../models/keyWord,model';
import { SocialGroup } from '../models/socialGroup.model';
import { CategoriesService } from '../services/categories/categories.service';
import { ChildrenService } from '../services/children/children.service';
import {
  CityList,
  KeyWordsList,
  GetSocialGroup,
  ClearCategories,
  GetClasses,
  GetDepartments,
  GetDirections
} from './meta-data.actions';

export interface MetaDataStateModel {
  directions: Direction[];
  departments: Department[];
  classes: Class[];
  filteredCities: City[];
  filteredkeyWords: KeyWord[];
  socialGroups: SocialGroup[],
}

@State<MetaDataStateModel>({
  name: 'metaDataState',
  defaults: {
    directions: [],
    departments: [],
    classes: [],
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
  static directions(state: MetaDataStateModel): Direction[] { return state.directions }

  @Selector()
  static departments(state: MetaDataStateModel): Department[] { return state.departments }

  @Selector()
  static classes(state: MetaDataStateModel): Class[] { return state.classes }

  @Selector()
  static filteredkeyWords(state: MetaDataStateModel): KeyWord[] { return state.filteredkeyWords }

  @Selector()
  static socialGroups(state: MetaDataStateModel): SocialGroup[] { return state.socialGroups }

  constructor(
    private categoriesService: CategoriesService,
    private childrenService: ChildrenService) { }

  @Action(GetDirections)
  getDirections({ patchState }: StateContext<MetaDataStateModel>, { }: GetDirections) {
    return this.categoriesService
      .getDirections()
      .pipe(
        tap((directions: Direction[]) => patchState({ directions: directions })
        ))
  }

  @Action(GetDepartments)
  getDepartments({ patchState }: StateContext<MetaDataStateModel>, { payload }: GetDepartments) {
    return this.categoriesService
      .getDepartmentsBytDirectionId(payload)
      .pipe(
        tap((departments: Department[]) => patchState({ departments: departments })
        ))
  }

  @Action(GetClasses)
  getClasses({ patchState }: StateContext<MetaDataStateModel>, { payload }: GetClasses) {
    return this.categoriesService
      .getClassByDepartmentId(payload)
      .pipe(
        tap((classes: Class[]) => patchState({ classes: classes })
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

  @Action(ClearCategories)
  clearCategories({ patchState }: StateContext<MetaDataStateModel>, { }: ClearCategories) {
    patchState({ directions: undefined });
    patchState({ departments: undefined });
    patchState({ classes: undefined });
  }

}
