import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Department, Direction, IClass } from '../models/category.model';
import { City } from '../models/city.model';
import { Rate } from '../models/rating';
import { SocialGroup } from '../models/socialGroup.model';
import { CategoriesService } from '../services/categories/categories.service';
import { ChildrenService } from '../services/children/children.service';
import { CityService } from '../services/cities/city.service';
import { RatingService } from '../services/rating/rating.service';
import {
  GetSocialGroup,
  ClearCategories,
  GetClasses,
  GetDepartments,
  GetDirections,
  GetCities,
  ClearCities,
  FilteredDirectionsList,
  FilteredDepartmentsList,
  FilteredClassesList,
  GetRateByEntityId,
  GetTopDirections
} from './meta-data.actions';

export interface MetaDataStateModel {
  directions: Direction[];
  departments: Department[];
  classes: IClass[];
  cities: City[],
  socialGroups: SocialGroup[],
  isCity: boolean;
  filteredDirections: Direction[];
  filteredDepartments: Department[];
  filteredClasses: IClass[];
  rating: Rate[];
  isLoading: boolean;
}

@State<MetaDataStateModel>({
  name: 'metaDataState',
  defaults: {
    directions: [],
    departments: [],
    classes: [],
    cities: null,
    socialGroups: [],
    isCity: false,
    filteredDirections: [],
    filteredDepartments: [],
    filteredClasses: [],
    rating: [],
    isLoading: false
  }

})
@Injectable()
export class MetaDataState {

  @Selector()
  static directions(state: MetaDataStateModel): Direction[] { return state.directions }

  @Selector()
  static departments(state: MetaDataStateModel): Department[] { return state.departments }

  @Selector()
  static classes(state: MetaDataStateModel): IClass[] { return state.classes }

  @Selector()
  static socialGroups(state: MetaDataStateModel): SocialGroup[] { return state.socialGroups }

  @Selector()
  static cities(state: MetaDataStateModel): City[] { return state.cities }

  @Selector()
  static isCity(state: MetaDataStateModel): boolean { return state.isCity }

  @Selector()
  static filteredDirections(state: MetaDataStateModel): Direction[] { return state.filteredDirections }

  @Selector()
  static filteredDepartments(state: MetaDataStateModel): Department[] { return state.filteredDepartments }

  @Selector()
  static filteredClasses(state: MetaDataStateModel): IClass[] { return state.filteredClasses }

  @Selector()
  static isLoading(state: MetaDataStateModel): boolean { return state.isLoading }

  static rating(state: MetaDataStateModel): Rate[] { return state.rating }

  constructor(
    private categoriesService: CategoriesService,
    private childrenService: ChildrenService,
    private cityService: CityService,
    private ratingService: RatingService) { }

  @Action(GetDirections)
  getDirections({ patchState }: StateContext<MetaDataStateModel>, { }: GetDirections) {
    patchState({ isLoading: true })
    return this.categoriesService
      .getDirections()
      .pipe(
        tap((directions: Direction[]) => patchState({ directions: directions, isLoading: false })
        ))
  }

  @Action(GetTopDirections)
  getTopDirections({ patchState }: StateContext<MetaDataStateModel>, { }: GetTopDirections) {
    patchState({ isLoading: true })
    return this.categoriesService
      .getDirections()
      .pipe(
        tap((directions: Direction[]) => patchState({ directions: directions, isLoading: false })
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
        tap((classes: IClass[]) => patchState({ classes: classes })
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

  @Action(FilteredDirectionsList)
  filteredDirectionsList({ patchState }: StateContext<MetaDataStateModel>, { payload }: FilteredDirectionsList): void {
    patchState({ filteredDirections: payload });
  }

  @Action(FilteredDepartmentsList)
  filteredDepartmentsList({ patchState }: StateContext<MetaDataStateModel>, { payload }: FilteredDepartmentsList): void {
    patchState({ filteredDepartments: payload });
  }

  @Action(FilteredClassesList)
  FilteredClassesList({ patchState }: StateContext<MetaDataStateModel>, { payload }: FilteredClassesList): void {
    patchState({ filteredClasses: payload });
  }

  @Action(GetRateByEntityId)
  getRateByEntityId({ patchState }: StateContext<MetaDataStateModel>, { enitityType, entitytId }: GetRateByEntityId) {
    return this.ratingService
      .getRateByEntityId(enitityType, entitytId)
      .pipe(
        tap((rating: Rate[]) => patchState({ rating: rating })
        ))
  }

}


