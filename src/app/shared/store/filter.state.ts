import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Direction } from '../models/category.model';
import { City } from '../models/city.model';
import { WorkshopCard, WorkshopFilterCard } from '../models/workshop.model';
import { WorkingHours } from '../models/workingHours.model';
import {
  SetOrder,
  SetCity,
  GetFilteredWorkshops,
  GetTopWorkshops,
  SetDirections,
  SetWorkingDays,
  SetWorkingHours,
  SetIsFree,
  SetMinPrice,
  SetMaxPrice,
  SetSearchQueryValue,
  SetOpenRecruitment,
  SetClosedRecruitment,
  SetWithDisabilityOption,
  FilterChange,
  SetMinAge,
  SetMaxAge,
} from './filter.actions';
import { AppWorkshopsService } from '../services/workshops/app-workshop/app-workshops.service';
export interface FilterStateModel {
  directions: Direction[];
  maxAge: number;
  minAge: number;
  workingHours: WorkingHours[];
  workingDays: WorkingHours[];
  isFree: boolean;
  maxPrice: number;
  minPrice: number;
  isOpenRecruitment: boolean;
  isClosedRecruitment: boolean;
  city: City;
  searchQuery: string;
  order: string;
  filteredWorkshops: WorkshopFilterCard;
  topWorkshops: WorkshopCard[];
  withDisabilityOption: boolean;
  isLoading: boolean;
}
@State<FilterStateModel>({
  name: 'filter',
  defaults: {
    directions: [],
    maxAge: null,
    minAge: null,
    workingDays: [],
    workingHours: [],
    isFree: false,
    maxPrice: 0,
    minPrice: 0,
    isOpenRecruitment: false,
    isClosedRecruitment: false,
    city: undefined,
    searchQuery: '',
    order: '',
    filteredWorkshops: undefined,
    topWorkshops: [],
    withDisabilityOption: false,
    isLoading: false
  }
})
@Injectable()
export class FilterState {

  @Selector()
  static filteredWorkshops(state: FilterStateModel): WorkshopFilterCard { return state.filteredWorkshops }

  @Selector()
  static topWorkshops(state: FilterStateModel): WorkshopCard[] { return state.topWorkshops }

  @Selector()
  static directions(state: FilterStateModel): Direction[] { return state.directions }

  @Selector()
  static isLoading(state: FilterStateModel): boolean { return state.isLoading }

  @Selector()
  static city(state: FilterStateModel): City { return state.city }


  constructor(
    private appWorkshopsService: AppWorkshopsService) { }

  @Action(SetCity)
  setCity({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetCity): void {
    patchState({ city: payload });
    dispatch(new FilterChange());
  }

  @Action(SetOrder)
  setOrder({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetOrder) {
    patchState({ order: payload });
    dispatch(new FilterChange());
  }

  @Action(SetDirections)
  setDirections({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetDirections): void {
    patchState({ directions: payload });
    dispatch(new FilterChange());
  }

  @Action(SetWorkingDays)
  setWorkingDays({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetWorkingDays) {
    patchState({ workingDays: payload });
    dispatch(new FilterChange());
  }

  @Action(SetWorkingHours)
  setWorkingHours({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetWorkingHours) {
    patchState({ workingHours: payload });
    dispatch(new FilterChange());
  }

  @Action(SetIsFree)
  setIsFree({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetIsFree) {
    patchState({ isFree: payload });
    dispatch(new FilterChange());
  }

  @Action(SetMinPrice)
  setMinPrice({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetMinPrice) {
    patchState({ minPrice: payload });
    dispatch(new FilterChange());
  }

  @Action(SetMaxPrice)
  setMaxPrice({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetMaxPrice) {
    patchState({ maxPrice: payload });
    dispatch(new FilterChange());
  }

  @Action(SetSearchQueryValue)
  setSearchQueryValue({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetSearchQueryValue) {
    patchState({ searchQuery: payload });
    dispatch(new FilterChange());
  }

  @Action(SetOpenRecruitment)
  setOpenRecruitment({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetOpenRecruitment) {
    patchState({ isOpenRecruitment: payload });
    dispatch(new FilterChange());

  }

  @Action(SetClosedRecruitment)
  setClosedRecruitment({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetClosedRecruitment) {
    patchState({ isClosedRecruitment: payload });
    dispatch(new FilterChange());
  }

  @Action(GetFilteredWorkshops)
  getFilteredWorkshops({ patchState, getState }: StateContext<FilterStateModel>, { }: GetFilteredWorkshops) {
    patchState({ isLoading: true });
    const state: FilterStateModel = getState();

    return this.appWorkshopsService
      .getFilteredWorkshops(state)
      .subscribe((filterResult: WorkshopFilterCard) => patchState(filterResult ? { filteredWorkshops: filterResult, isLoading: false } : { filteredWorkshops: undefined, isLoading: false }),
        () => patchState({ isLoading: false }))
  }

  @Action(GetTopWorkshops)
  getTopWorkshops({ patchState, getState }: StateContext<FilterStateModel>, { }: GetTopWorkshops) {
    patchState({ isLoading: true });
    const state: FilterStateModel = getState();

    return this.appWorkshopsService
      .getTopWorkshops(state)
      .subscribe((filterResult: WorkshopFilterCard) => patchState({ topWorkshops: filterResult?.entities, isLoading: false }), () => patchState({ isLoading: false }))
  }

  @Action(SetWithDisabilityOption)
  setWithDisabilityOption({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetWithDisabilityOption) {
    patchState({ withDisabilityOption: payload });
    dispatch(new FilterChange());
  }

  @Action(SetMinAge)
  setMinAge({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetMinAge) {
    patchState({ minAge: payload });
    dispatch(new FilterChange());
  }

  @Action(SetMaxAge)
  setMaxAge({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetMaxAge) {
    patchState({ maxAge: payload });
    dispatch(new FilterChange());
  }

  @Action(FilterChange)
  filterChange({ }: StateContext<FilterStateModel>, { }: FilterChange) { }
}
