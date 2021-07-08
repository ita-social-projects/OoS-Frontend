import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Class, Department, Direction } from '../models/category.model';
import { City } from '../models/city.model';
import { SocialGroup } from '../models/socialGroup.model';
import { CategoriesService } from '../services/categories/categories.service';
import { ChildrenService } from '../services/children/children.service';
import { CityService } from '../services/cities/city.service';
import {
  CityList,
  GetSocialGroup,
  ClearCategories,
  GetClasses,
  GetDepartments,
  GetDirections,
  GetCities,
  ClearCities
} from './meta-data.actions';

export interface MetaDataStateModel {
  directions: Direction[];
  departments: Department[];
  classes: Class[];
  cities: City[],
  socialGroups: SocialGroup[],
  isCity: boolean;
}

@State<MetaDataStateModel>({
  name: 'metaDataState',
  defaults: {
    directions: [],
    departments: [],
    classes: [],
    cities: null,
    socialGroups: [],
    isCity: false
  }

})
@Injectable()
export class MetaDataState {

  @Selector()
  static directions(state: MetaDataStateModel): Direction[] { return state.directions }

  @Selector()
  static departments(state: MetaDataStateModel): Department[] { return state.departments }

  @Selector()
  static classes(state: MetaDataStateModel): Class[] { return state.classes }

  @Selector()
  static socialGroups(state: MetaDataStateModel): SocialGroup[] { return state.socialGroups }

  @Selector()
  static cities(state: MetaDataStateModel): City[] { return state.cities }

  @Selector()
  static isCity(state: MetaDataStateModel): boolean { return state.isCity }

  constructor(
    private categoriesService: CategoriesService,
    private childrenService: ChildrenService,
    private cityService: CityService) { }

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
  @Action(GetCities)
  getCities({ patchState }: StateContext<MetaDataStateModel>, { payload }: GetCities) {
    return this.cityService
      .getCities(payload)
      .pipe(
        tap((cities: City[]) => patchState(cities ? { cities: cities, isCity: true } : { cities: [{ name: 'Такого міста немає' } as City], isCity: false })
        ))
  }

  @Action(ClearCities)
  clearCities({ patchState }: StateContext<MetaDataStateModel>, { }: ClearCities) {
    patchState({ cities: null });
  }

}
