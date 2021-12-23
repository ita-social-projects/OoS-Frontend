import { Constants } from './../constants/constants';
import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Department, Direction, IClass } from '../models/category.model';
import { City } from '../models/city.model';
import { Rate } from '../models/rating';
import { SocialGroup } from '../models/socialGroup.model';
import { FeaturesList } from '../models/featuresList.model';
import { CategoriesService } from '../services/categories/categories.service';
import { ChildrenService } from '../services/children/children.service';
import { CityService } from '../services/cities/city.service';
import { RatingService } from '../services/rating/rating.service';
import { FeatureManagementService } from '../services/feature-management/feature-management.service';
import {
  GetSocialGroup,
  GetClasses,
  GetDepartments,
  GetDirections,
  GetCities,
  ClearCities,
  FilteredDirectionsList,
  FilteredDepartmentsList,
  FilteredClassesList,
  GetRateByEntityId,
  GetTopDirections,
  ClearDepartments,
  ClearClasses,
  GetInstitutionStatus,
  ClearRatings,
  GetFeaturesList
} from './meta-data.actions';
import { Observable } from 'rxjs';
import { InstitutionStatus } from '../models/institutionStatus.model';
import { ProviderService } from '../services/provider/provider.service';

export interface MetaDataStateModel {
  directions: Direction[];
  topDirections: Direction[];
  departments: Department[];
  classes: IClass[];
  cities: City[];
  socialGroups: SocialGroup[];
  institutionStatuses: InstitutionStatus[];
  isCity: boolean;
  filteredDirections: Direction[];
  filteredDepartments: Department[];
  filteredClasses: IClass[];
  rating: Rate[];
  isLoading: boolean;
  featuresList: FeaturesList
}
@State<MetaDataStateModel>({
  name: 'metaDataState',
  defaults: {
    directions: [],
    topDirections: [],
    departments: [],
    classes: [],
    cities: null,
    socialGroups: [],
    institutionStatuses: [],
    isCity: false,
    filteredDirections: [],
    filteredDepartments: [],
    filteredClasses: [],
    rating: [],
    isLoading: false,
    featuresList: null
  }

})
@Injectable()
export class MetaDataState {

  @Selector()
  static directions(state: MetaDataStateModel): Direction[] { return state.directions; }

  @Selector()
  static topDirections(state: MetaDataStateModel): Direction[] { return state.topDirections; }

  @Selector()
  static departments(state: MetaDataStateModel): Department[] { return state.departments; }

  @Selector()
  static classes(state: MetaDataStateModel): IClass[] { return state.classes; }

  @Selector()
  static socialGroups(state: MetaDataStateModel): SocialGroup[] { return state.socialGroups; }

  @Selector()
  static institutionStatuses(state: MetaDataStateModel): InstitutionStatus[] { return state.institutionStatuses; }

  @Selector()
  static cities(state: MetaDataStateModel): City[] { return state.cities; }

  @Selector()
  static isCity(state: MetaDataStateModel): boolean { return state.isCity; }

  @Selector()
  static filteredDirections(state: MetaDataStateModel): Direction[] { return state.filteredDirections; }

  @Selector()
  static filteredDepartments(state: MetaDataStateModel): Department[] { return state.filteredDepartments; }

  @Selector()
  static filteredClasses(state: MetaDataStateModel): IClass[] { return state.filteredClasses; }

  @Selector()
  static isLoading(state: MetaDataStateModel): boolean { return state.isLoading; }

  @Selector()
  static rating(state: MetaDataStateModel): Rate[] { return state.rating; }

  @Selector()
  static featuresList(state: MetaDataStateModel): FeaturesList { return state.featuresList; }

  constructor(
    private categoriesService: CategoriesService,
    private childrenService: ChildrenService,
    private providerService: ProviderService,
    private cityService: CityService,
    private ratingService: RatingService,
    private featureManagementService: FeatureManagementService) { }

  @Action(GetDirections)
  getDirections({ patchState }: StateContext<MetaDataStateModel>, { }: GetDirections): Observable<Direction[]> {
    patchState({ isLoading: true })
    return this.categoriesService
      .getDirections()
      .pipe(
        tap((directions: Direction[]) => patchState({ directions: directions, isLoading: false })
        ))
  }

  @Action(GetTopDirections)
  getTopDirections({ patchState }: StateContext<MetaDataStateModel>, { }: GetTopDirections): Observable<Direction[]> {
    patchState({ isLoading: true })
    return this.categoriesService
      .getTopDirections()
      .pipe(
        tap((topDirections: Direction[]) => patchState({ topDirections: topDirections, isLoading: false })
        ))
  }

  @Action(GetDepartments)
  getDepartments({ patchState }: StateContext<MetaDataStateModel>, { payload }: GetDepartments): Observable<Department[]> {
    return this.categoriesService
      .getDepartmentsBytDirectionId(payload)
      .pipe(
        tap((departments: Department[]) => patchState({ departments: departments })
        ))
  }

  @Action(GetClasses)
  getClasses({ patchState }: StateContext<MetaDataStateModel>, { payload }: GetClasses): Observable<IClass[]> {
    return this.categoriesService
      .getClassByDepartmentId(payload)
      .pipe(
        tap((classes: IClass[]) => patchState({ classes: classes })
        ))
  }

  @Action(GetSocialGroup)
  getSocialGroup({ patchState }: StateContext<MetaDataStateModel>, { }: GetSocialGroup): Observable<SocialGroup[]> {
    return this.childrenService
      .getSocialGroup()
      .pipe(
        tap((socialGroups: SocialGroup[]) => patchState({ socialGroups: socialGroups })
        ))
  }

  @Action(GetInstitutionStatus)
  getInstitutionStatus({ patchState }: StateContext<MetaDataStateModel>, { }: GetInstitutionStatus): Observable<InstitutionStatus[]> {
    return this.providerService
      .getInstitutionStatus()
      .pipe(
        tap((institutionStatuses: InstitutionStatus[]) => patchState({ institutionStatuses: institutionStatuses })
        ))
  }

  @Action(ClearClasses)
  clearClasses({ patchState }: StateContext<MetaDataStateModel>, { }: ClearClasses): void {
    patchState({ classes: undefined });
  }

  @Action(ClearDepartments)
  clearDepartments({ patchState }: StateContext<MetaDataStateModel>, { }: ClearDepartments): void {
    patchState({ departments: undefined });
  }

  @Action(GetCities)
  getCities({ patchState }: StateContext<MetaDataStateModel>, { payload }: GetCities): Observable<City[]> {
    return this.cityService
      .getCities(payload)
      .pipe(
        tap((cities: City[]) => patchState(cities ? { cities: cities, isCity: true } : { cities: [{ name: 'Такого міста немає' } as City], isCity: false })
        ))
  }

  @Action(ClearCities)
  clearCities({ patchState }: StateContext<MetaDataStateModel>, { }: ClearCities): void {
    patchState({ cities: null });
  }

  @Action(ClearRatings)
  clearRatings({ patchState }: StateContext<MetaDataStateModel>, { }: ClearRatings): void {
    patchState({ rating: null });
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
  getRateByEntityId({ patchState }: StateContext<MetaDataStateModel>, { enitityType, entitytId }: GetRateByEntityId): Observable<Rate[]> {
    return this.ratingService
      .getRateByEntityId(enitityType, entitytId)
      .pipe(
        tap((rating: Rate[]) => patchState({ rating: rating })
        ))
  }

  @Action(GetFeaturesList)
  getFeaturesList({ patchState }: StateContext<MetaDataStateModel>, { }: GetFeaturesList): Observable<FeaturesList> {
    return this.featureManagementService
      .getFeaturesList()
      .pipe(
        tap((featuresList: FeaturesList) => patchState({
          featuresList: {
            release1: true,
            release2: true,
            release3: false
          }
        })
        ))
  }

}
