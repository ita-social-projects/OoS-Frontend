import { InstitutionsService } from './../services/institutions/institutions.service';
import { InstituitionHierarchy, Institution, InstitutionFieldDescription } from './../models/institution.model';
import { Constants } from './../constants/constants';
import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Direction } from '../models/category.model';
import { City } from '../models/city.model';
import { Rate } from '../models/rating';
import { SocialGroup } from '../models/socialGroup.model';
import { FeaturesList } from '../models/featuresList.model';
import { DirectionsService } from '../services/categories/directions.service';
import { ChildrenService } from '../services/children/children.service';
import { CityService } from '../services/cities/city.service';
import { RatingService } from '../services/rating/rating.service';
import { FeatureManagementService } from '../services/feature-management/feature-management.service';
import {
  GetSocialGroup,
  GetDirections,
  GetCities,
  ClearCities,
  FilteredDirectionsList,
  GetRateByEntityId,
  GetTopDirections,
  GetInstitutionStatus,
  ClearRatings,
  GetFeaturesList,
  GetAllInstitutions,
  GetAchievementsType,
  GetFieldDescriptionByInstitutionId,
  GetAllByInstitutionAndLevel,
  ResetInstitutionHierarchy,
  GetInstitutionHierarchyChildrenById,
  GetInstitutionHierarchyParentsById,
} from './meta-data.actions';
import { Observable } from 'rxjs';
import { InstitutionStatus } from '../models/institutionStatus.model';
import { ProviderService } from '../services/provider/provider.service';
import { AchievementsService } from '../services/achievements/achievements.service';
import { AchievementType } from '../models/achievement.model';
export interface MetaDataStateModel {
  directions: Direction[];
  topDirections: Direction[];
  cities: City[];
  socialGroups: SocialGroup[];
  institutionStatuses: InstitutionStatus[];
  achievementsTypes: AchievementType[];
  filteredDirections: Direction[];
  rating: Rate[];
  isLoading: boolean;
  featuresList: FeaturesList;
  institutions: Institution[];
  institutionFieldDesc: InstitutionFieldDescription[];
  instituitionsHierarchy: InstituitionHierarchy[];
  editInstituitionsHierarchy: InstituitionHierarchy[];
}
@State<MetaDataStateModel>({
  name: 'metaDataState',
  defaults: {
    directions: [],
    topDirections: [],
    cities: null,
    socialGroups: [],
    institutionStatuses: null,
    achievementsTypes: null,
    filteredDirections: [],
    rating: [],
    isLoading: false,
    featuresList: { release1: true, release2: true, release3: false },
    institutions: null,
    institutionFieldDesc: null,
    instituitionsHierarchy: null,
    editInstituitionsHierarchy: null,
  },
})
@Injectable()
export class MetaDataState {
  @Selector()
  static directions(state: MetaDataStateModel): Direction[] {
    return state.directions;
  }

  @Selector()
  static topDirections(state: MetaDataStateModel): Direction[] {
    return state.topDirections;
  }

  @Selector()
  static socialGroups(state: MetaDataStateModel): SocialGroup[] {
    return state.socialGroups;
  }

  @Selector()
  static institutionStatuses(state: MetaDataStateModel): InstitutionStatus[] {
    return state.institutionStatuses;
  }

  @Selector()
  static achievementsTypes(state: MetaDataStateModel): AchievementType[] {
    return state.achievementsTypes;
  }

  @Selector()
  static cities(state: MetaDataStateModel): City[] {
    return state.cities;
  }

  @Selector()
  static filteredDirections(state: MetaDataStateModel): Direction[] {
    return state.filteredDirections;
  }

  @Selector()
  static isLoading(state: MetaDataStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  static rating(state: MetaDataStateModel): Rate[] {
    return state.rating;
  }

  @Selector()
  static featuresList(state: MetaDataStateModel): FeaturesList {
    return state.featuresList;
  }

  @Selector()
  static institutions(state: MetaDataStateModel): Institution[] {
    return state.institutions;
  }

  @Selector()
  static institutionFieldDesc(state: MetaDataStateModel): InstitutionFieldDescription[] {
    return state.institutionFieldDesc;
  }

  @Selector()
  static instituitionsHierarchy(state: MetaDataStateModel): InstituitionHierarchy[] {
    return state.instituitionsHierarchy;
  }

  @Selector()
  static editInstituitionsHierarchy(state: MetaDataStateModel): InstituitionHierarchy[] {
    return state.editInstituitionsHierarchy;
  }

  constructor(
    private categoriesService: DirectionsService,
    private childrenService: ChildrenService,
    private providerService: ProviderService,
    private cityService: CityService,
    private ratingService: RatingService,
    private featureManagementService: FeatureManagementService,
    private institutionsService: InstitutionsService,
    private achievementService: AchievementsService
  ) {}

  @Action(GetDirections)
  getDirections({ patchState }: StateContext<MetaDataStateModel>, {}: GetDirections): Observable<Direction[]> {
    patchState({ isLoading: true });
    return this.categoriesService
      .getDirections()
      .pipe(tap((directions: Direction[]) => patchState({ directions: directions, isLoading: false })));
  }

  @Action(GetTopDirections)
  getTopDirections({ patchState }: StateContext<MetaDataStateModel>, {}: GetTopDirections): Observable<Direction[]> {
    patchState({ isLoading: true });
    return this.categoriesService
      .getTopDirections()
      .pipe(tap((topDirections: Direction[]) => patchState({ topDirections: topDirections, isLoading: false })));
  }

  @Action(GetSocialGroup)
  getSocialGroup({ patchState }: StateContext<MetaDataStateModel>, {}: GetSocialGroup): Observable<SocialGroup[]> {
    patchState({ isLoading: true });
    return this.childrenService
      .getSocialGroup()
      .pipe(tap((socialGroups: SocialGroup[]) => patchState({ socialGroups: socialGroups, isLoading: false })));
  }

  @Action(GetInstitutionStatus)
  getInstitutionStatus(
    { patchState }: StateContext<MetaDataStateModel>,
    {}: GetInstitutionStatus
  ): Observable<InstitutionStatus[]> {
    patchState({ isLoading: true });
    return this.providerService
      .getInstitutionStatus()
      .pipe(
        tap((institutionStatuses: InstitutionStatus[]) =>
          patchState({ institutionStatuses: institutionStatuses, isLoading: false })
        )
      );
  }

  @Action(GetCities)
  getCities({ patchState }: StateContext<MetaDataStateModel>, { payload }: GetCities): Observable<City[]> {
    return this.cityService
      .getCities(payload)
      .pipe(
        tap((cities: City[]) =>
          patchState(cities ? { cities: cities } : { cities: [{ name: Constants.NO_CITY } as City] })
        )
      );
  }

  @Action(ClearCities)
  clearCities({ patchState }: StateContext<MetaDataStateModel>, {}: ClearCities): void {
    patchState({ cities: null });
  }

  @Action(ClearRatings)
  clearRatings({ patchState }: StateContext<MetaDataStateModel>, {}: ClearRatings): void {
    patchState({ rating: null });
  }

  @Action(FilteredDirectionsList)
  filteredDirectionsList({ patchState }: StateContext<MetaDataStateModel>, { payload }: FilteredDirectionsList): void {
    patchState({ filteredDirections: payload });
  }

  @Action(GetRateByEntityId)
  getRateByEntityId(
    { patchState }: StateContext<MetaDataStateModel>,
    { enitityType, entitytId }: GetRateByEntityId
  ): Observable<Rate[]> {
    return this.ratingService
      .getRateByEntityId(enitityType, entitytId)
      .pipe(tap((rating: Rate[]) => patchState({ rating: rating })));
  }

  @Action(GetFeaturesList)
  getFeaturesList({ patchState }: StateContext<MetaDataStateModel>, {}: GetFeaturesList): Observable<FeaturesList> {
    return this.featureManagementService
      .getFeaturesList()
      .pipe(tap((featuresList: FeaturesList) => patchState({ featuresList: featuresList })));
  }

  @Action(GetAllInstitutions)
  getAllInstitutions(
    { patchState }: StateContext<MetaDataStateModel>,
    {}: GetAllInstitutions
  ): Observable<Institution[]> {
    patchState({ isLoading: true });
    return this.institutionsService
      .getAllInstitutions()
      .pipe(tap((institutions: Institution[]) => patchState({ institutions: institutions, isLoading: false })));
  }

  @Action(GetAchievementsType)
  getAchievementType(
    { patchState }: StateContext<MetaDataStateModel>,
    {}: GetAchievementsType
  ): Observable<AchievementType[]> {
    patchState({ isLoading: true });
    return this.achievementService
      .getAchievementsType()
      .pipe(
        tap((achievementsTypes: AchievementType[]) =>
          patchState({ achievementsTypes: achievementsTypes, isLoading: false })
        )
      );
  }

  @Action(GetFieldDescriptionByInstitutionId)
  GetFieldDescriptionByInstitutionId(
    { patchState }: StateContext<MetaDataStateModel>,
    { payload }: GetFieldDescriptionByInstitutionId
  ): Observable<InstitutionFieldDescription[]> {
    patchState({ isLoading: true });
    return this.institutionsService
      .getFieldDescriptionByInstitutionId(payload)
      .pipe(
        tap((institutionFieldDesc: InstitutionFieldDescription[]) =>
          patchState({ institutionFieldDesc: institutionFieldDesc, isLoading: false })
        )
      );
  }

  @Action(GetAllByInstitutionAndLevel)
  GetAllByInstitutionAndLevel(
    { patchState }: StateContext<MetaDataStateModel>,
    { institutionId, level }: GetAllByInstitutionAndLevel
  ): Observable<InstituitionHierarchy[]> {
    patchState({ isLoading: true });
    return this.institutionsService
      .getAllByInstitutionAndLevel(institutionId, level)
      .pipe(
        tap((instituitionsHierarchy: InstituitionHierarchy[]) =>
          patchState({ instituitionsHierarchy: instituitionsHierarchy, isLoading: false })
        )
      );
  }

  @Action(GetInstitutionHierarchyChildrenById)
  getInstitutionHierarchyChildrenById(
    { patchState }: StateContext<MetaDataStateModel>,
    { id }: GetInstitutionHierarchyChildrenById
  ): Observable<InstituitionHierarchy[]> {
    patchState({ isLoading: true });
    return this.institutionsService
      .getInstitutionHierarchyChildrenById(id)
      .pipe(
        tap((instituitionsHierarchy: InstituitionHierarchy[]) =>
          patchState({ instituitionsHierarchy: instituitionsHierarchy, isLoading: false })
        )
      );
  }

  @Action(GetInstitutionHierarchyParentsById)
  getInstitutionHierarchyParentsById(
    { patchState }: StateContext<MetaDataStateModel>,
    { id }: GetInstitutionHierarchyParentsById
  ): Observable<InstituitionHierarchy[]> {
    patchState({ isLoading: true });
    return this.institutionsService
      .getInstitutionHierarchyParentsId(id)
      .pipe(
        tap((instituitionsHierarchy: InstituitionHierarchy[]) =>
          patchState({ editInstituitionsHierarchy: instituitionsHierarchy, isLoading: false })
        )
      );
  }

  @Action(ResetInstitutionHierarchy)
  resetInstitutionHierarchy({ patchState }: StateContext<MetaDataStateModel>, {}: ResetInstitutionHierarchy): void {
    patchState({ instituitionsHierarchy: null, editInstituitionsHierarchy: null, institutionFieldDesc: null });
  }
}
