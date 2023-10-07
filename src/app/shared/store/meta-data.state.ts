import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { Constants, EMPTY_RESULT } from '../constants/constants';
import { AchievementType } from '../models/achievement.model';
import { Direction } from '../models/category.model';
import { Codeficator } from '../models/codeficator.model';
import { FeaturesList } from '../models/featuresList.model';
import { InstituitionHierarchy, Institution, InstitutionFieldDescription } from '../models/institution.model';
import { DataItem } from '../models/item.model';
import { Rate } from '../models/rating';
import { SearchResponse } from '../models/search.model';
import { AchievementsService } from '../services/achievements/achievements.service';
import { ChildrenService } from '../services/children/children.service';
import { CodeficatorService } from '../services/codeficator/codeficator.service';
import { DirectionsService } from '../services/directions/directions.service';
import { FeatureManagementService } from '../services/feature-management/feature-management.service';
import { InstitutionsService } from '../services/institutions/institutions.service';
import { ProviderService } from '../services/provider/provider.service';
import { RatingService } from '../services/rating/rating.service';
import {
  ClearCodeficatorSearch,
  ClearRatings,
  GetAchievementsType,
  GetAllByInstitutionAndLevel,
  GetAllInstitutions,
  GetAllInstitutionsHierarchy,
  GetCodeficatorById,
  GetCodeficatorSearch,
  GetDirections,
  GetFeaturesList,
  GetFieldDescriptionByInstitutionId,
  GetInstitutionHierarchyChildrenById,
  GetInstitutionHierarchyParentsById,
  GetInstitutionStatuses,
  GetProviderTypes,
  GetRateByEntityId,
  GetSocialGroup,
  ResetInstitutionHierarchy,
  UpdateInstitutionHierarchy
} from './meta-data.actions';

export interface MetaDataStateModel {
  directions: Direction[];
  socialGroups: DataItem[];
  institutionStatuses: DataItem[];
  providerTypes: DataItem[];
  achievementsTypes: AchievementType[];
  rating: SearchResponse<Rate[]>;
  isLoading: boolean;
  featuresList: FeaturesList;
  institutions: Institution[];
  institutionFieldDesc: InstitutionFieldDescription[];
  instituitionsHierarchyAll: InstituitionHierarchy[];
  instituitionsHierarchy: InstituitionHierarchy[];
  editInstituitionsHierarchy: InstituitionHierarchy[];
  codeficatorSearch: Codeficator[];
  codeficator: Codeficator;
}

@State<MetaDataStateModel>({
  name: 'metaDataState',
  defaults: {
    directions: null,
    socialGroups: [],
    institutionStatuses: null,
    providerTypes: null,
    achievementsTypes: null,
    rating: null,
    isLoading: false,
    featuresList: null,
    institutions: null,
    institutionFieldDesc: null,
    instituitionsHierarchyAll: null,
    instituitionsHierarchy: null,
    editInstituitionsHierarchy: null,
    codeficatorSearch: [],
    codeficator: null
  }
})
@Injectable()
export class MetaDataState {
  @Selector()
  static directions(state: MetaDataStateModel): Direction[] {
    return state.directions;
  }

  @Selector()
  static socialGroups(state: MetaDataStateModel): DataItem[] {
    return state.socialGroups;
  }

  @Selector()
  static institutionStatuses(state: MetaDataStateModel): DataItem[] {
    return state.institutionStatuses;
  }

  @Selector()
  static providerTypes(state: MetaDataStateModel): DataItem[] {
    return state.providerTypes;
  }

  @Selector()
  static achievementsTypes(state: MetaDataStateModel): AchievementType[] {
    return state.achievementsTypes;
  }

  @Selector()
  static isLoading(state: MetaDataStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  static rating(state: MetaDataStateModel): SearchResponse<Rate[]> {
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
  static instituitionsHierarchyAll(state: MetaDataStateModel): InstituitionHierarchy[] {
    return state.instituitionsHierarchyAll;
  }

  @Selector()
  static instituitionsHierarchy(state: MetaDataStateModel): InstituitionHierarchy[] {
    return state.instituitionsHierarchy;
  }

  @Selector()
  static editInstituitionsHierarchy(state: MetaDataStateModel): InstituitionHierarchy[] {
    return state.editInstituitionsHierarchy;
  }

  @Selector()
  static codeficatorSearch(state: MetaDataStateModel): Codeficator[] {
    return state.codeficatorSearch;
  }

  @Selector()
  static codeficator(state: MetaDataStateModel): Codeficator {
    return state.codeficator;
  }

  constructor(
    private categoriesService: DirectionsService,
    private childrenService: ChildrenService,
    private providerService: ProviderService,
    private ratingService: RatingService,
    private featureManagementService: FeatureManagementService,
    private institutionsService: InstitutionsService,
    private achievementService: AchievementsService,
    private codeficatorService: CodeficatorService
  ) {}

  @Action(GetDirections)
  getDirections({ patchState }: StateContext<MetaDataStateModel>, {}: GetDirections): Observable<Direction[]> {
    patchState({ isLoading: true });
    return this.categoriesService.getDirections().pipe(tap((directions: Direction[]) => patchState({ directions, isLoading: false })));
  }

  @Action(GetSocialGroup)
  getSocialGroup({ patchState }: StateContext<MetaDataStateModel>, {}: GetSocialGroup): Observable<DataItem[]> {
    patchState({ isLoading: true });
    return this.childrenService
      .getSocialGroup({ uk: 0, en: 1 }[localStorage.getItem('ui-culture') || 'uk'])
      .pipe(tap((socialGroups: DataItem[]) => patchState({ socialGroups, isLoading: false })));
  }

  @Action(GetInstitutionStatuses)
  getInstitutionStatuses({ patchState }: StateContext<MetaDataStateModel>, {}: GetInstitutionStatuses): Observable<DataItem[]> {
    patchState({ isLoading: true });
    return this.providerService
      .getInstitutionStatuses()
      .pipe(tap((institutionStatuses: DataItem[]) => patchState({ institutionStatuses, isLoading: false })));
  }

  @Action(GetProviderTypes)
  getProviderTypes({ patchState }: StateContext<MetaDataStateModel>, {}: GetProviderTypes): Observable<DataItem[]> {
    patchState({ isLoading: true });
    return this.providerService
      .getProviderTypes()
      .pipe(tap((providerTypes: DataItem[]) => patchState({ providerTypes, isLoading: false })));
  }

  @Action(ClearRatings)
  clearRatings({ patchState }: StateContext<MetaDataStateModel>, {}: ClearRatings): void {
    patchState({ rating: null });
  }

  @Action(GetRateByEntityId)
  getRateByEntityId(
    { patchState }: StateContext<MetaDataStateModel>,
    { rateParameters }: GetRateByEntityId
  ): Observable<SearchResponse<Rate[]>> {
    patchState({ isLoading: true });
    return this.ratingService
      .getRateByEntityId(rateParameters)
      .pipe(tap((rating: SearchResponse<Rate[]>) => patchState({ rating: rating ?? EMPTY_RESULT, isLoading: false })));
  }

  @Action(GetFeaturesList)
  getFeaturesList({ patchState }: StateContext<MetaDataStateModel>, {}: GetFeaturesList): Observable<FeaturesList> {
    return this.featureManagementService.getFeaturesList().pipe(tap((featuresList: FeaturesList) => patchState({ featuresList })));
  }

  @Action(GetAllInstitutions)
  getAllInstitutions(
    { patchState }: StateContext<MetaDataStateModel>,
    { filterNonGovernment }: GetAllInstitutions
  ): Observable<Institution[]> {
    patchState({ isLoading: true });
    return this.institutionsService
      .getAllInstitutions(filterNonGovernment)
      .pipe(tap((institutions: Institution[]) => patchState({ institutions, isLoading: false })));
  }

  @Action(GetAllInstitutionsHierarchy)
  getAllInstitutionsHierarchy(
    { patchState }: StateContext<MetaDataStateModel>,
    {}: GetAllInstitutionsHierarchy
  ): Observable<InstituitionHierarchy[]> {
    patchState({ isLoading: true });
    return this.institutionsService.getAllInstitutionHierarchies().pipe(
      tap((instituitionsHierarchyAll: InstituitionHierarchy[]) =>
        patchState({
          instituitionsHierarchyAll,
          isLoading: false
        })
      )
    );
  }

  @Action(GetAchievementsType)
  getAchievementType({ patchState }: StateContext<MetaDataStateModel>, {}: GetAchievementsType): Observable<AchievementType[]> {
    patchState({ isLoading: true });
    return this.achievementService
      .getAchievementsType()
      .pipe(tap((achievementsTypes: AchievementType[]) => patchState({ achievementsTypes, isLoading: false })));
  }

  @Action(GetFieldDescriptionByInstitutionId)
  GetFieldDescriptionByInstitutionId(
    { patchState }: StateContext<MetaDataStateModel>,
    { payload }: GetFieldDescriptionByInstitutionId
  ): Observable<InstitutionFieldDescription[]> {
    patchState({ isLoading: true });
    return this.institutionsService.getFieldDescriptionByInstitutionId(payload).pipe(
      tap((institutionFieldDesc: InstitutionFieldDescription[]) =>
        patchState({
          institutionFieldDesc,
          isLoading: false
        })
      )
    );
  }

  @Action(GetAllByInstitutionAndLevel)
  GetAllByInstitutionAndLevel(
    { patchState }: StateContext<MetaDataStateModel>,
    { institutionId, level }: GetAllByInstitutionAndLevel
  ): Observable<InstituitionHierarchy[]> {
    patchState({ isLoading: true });
    return this.institutionsService.getAllByInstitutionAndLevel(institutionId, level).pipe(
      tap((instituitionsHierarchy: InstituitionHierarchy[]) =>
        patchState({
          instituitionsHierarchy,
          isLoading: false
        })
      )
    );
  }

  @Action(GetInstitutionHierarchyChildrenById)
  getInstitutionHierarchyChildrenById(
    { patchState }: StateContext<MetaDataStateModel>,
    { id }: GetInstitutionHierarchyChildrenById
  ): Observable<InstituitionHierarchy[]> {
    patchState({ isLoading: true });
    return this.institutionsService.getInstitutionHierarchyChildrenById(id).pipe(
      tap((instituitionsHierarchy: InstituitionHierarchy[]) =>
        patchState({
          instituitionsHierarchy,
          isLoading: false
        })
      )
    );
  }

  @Action(GetInstitutionHierarchyParentsById)
  getInstitutionHierarchyParentsById(
    { patchState }: StateContext<MetaDataStateModel>,
    { id }: GetInstitutionHierarchyParentsById
  ): Observable<InstituitionHierarchy[]> {
    patchState({ isLoading: true });
    return this.institutionsService.getInstitutionHierarchyParentsId(id).pipe(
      tap((editInstituitionsHierarchy: InstituitionHierarchy[]) =>
        patchState({
          editInstituitionsHierarchy,
          isLoading: false
        })
      )
    );
  }

  @Action(ResetInstitutionHierarchy)
  resetInstitutionHierarchy({ patchState }: StateContext<MetaDataStateModel>, {}: ResetInstitutionHierarchy): void {
    patchState({
      instituitionsHierarchy: null,
      editInstituitionsHierarchy: null,
      institutionFieldDesc: null
    });
  }

  @Action(UpdateInstitutionHierarchy)
  updateInstitutionHierarchy(
    { patchState }: StateContext<MetaDataStateModel>,
    { payload }: UpdateInstitutionHierarchy
  ): Observable<InstituitionHierarchy | Observable<void>> {
    return this.institutionsService.editInstitutionHierarchy(payload).pipe();
  }

  @Action(GetCodeficatorSearch)
  getCodeficatorSearch(
    { patchState }: StateContext<MetaDataStateModel>,
    { name, categories, parentId }: GetCodeficatorSearch
  ): Observable<Codeficator[]> {
    patchState({ isLoading: true });
    return this.codeficatorService.searchCodeficator(name, categories, parentId).pipe(
      tap((codeficatorSearch: Codeficator[]) => {
        patchState({
          codeficatorSearch: codeficatorSearch ?? [{ settlement: Constants.NO_SETTLEMENT } as Codeficator],
          isLoading: false
        });
      })
    );
  }

  @Action(GetCodeficatorById)
  getCodeficator({ patchState }: StateContext<MetaDataStateModel>, { id }: GetCodeficatorById): Observable<Codeficator> {
    patchState({ isLoading: true });
    return this.codeficatorService
      .getCodeficatorById(id)
      .pipe(tap((codeficator: Codeficator) => patchState({ codeficator, isLoading: false })));
  }

  @Action(ClearCodeficatorSearch)
  clearCodeficatorSearch({ patchState }: StateContext<MetaDataStateModel>, {}: ClearCodeficatorSearch): void {
    patchState({ codeficatorSearch: [] });
  }
}
