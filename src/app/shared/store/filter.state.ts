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
  SetAgeRange,
  SetWorkingDays,
  SetWorkingHours,
  SetIsFree,
  SetIsPaid,
  SetMinPrice,
  SetMaxPrice,
  SetSearchQueryValue,
  SetOpenRecruitment,
  SetClosedRecruitment,
  SetWithDisabilityOption,
  SetWithoutDisabilityOption,
  FilterChange,
} from './filter.actions';
import { AppWorkshopsService } from '../services/workshops/app-workshop/app-workshops.service';
import { AgeRange } from '../models/ageRange.model';
export interface FilterStateModel {
  directions: Direction[];
  ageRange: AgeRange[];
  workingHours: WorkingHours[];
  workingDays: WorkingHours[];
  isPaid: boolean;
  isFree: boolean;
  maxPrice: number;
  minPrice: number;
  isOpenRecruitment: boolean;
  isClosedRecruitment: boolean;
  city: string;
  searchQuery: string;
  order: string;
  filteredWorkshops: WorkshopCard[];
  topWorkshops: WorkshopCard[];
  withDisabilityOption: boolean;
  withoutDisabilityOption: boolean;
  isLoading: boolean;
}
@State<FilterStateModel>({
  name: 'filter',
  defaults: {
    directions: [],
    ageRange: [],
    workingDays: [],
    workingHours: [],
    isPaid: false,
    isFree: false,
    maxPrice: 0,
    minPrice: 0,
    isOpenRecruitment: false,
    isClosedRecruitment: false,
    city: undefined,
    searchQuery: '',
    order: '',
    filteredWorkshops: [],
    topWorkshops: [],
    withDisabilityOption: false,
    withoutDisabilityOption: false,
    isLoading: false,
  }
})
@Injectable()
export class FilterState {

  @Selector()
  static filteredWorkshops(state: FilterStateModel): WorkshopCard[] { return state.filteredWorkshops }

  @Selector()
  static topWorkshops(state: FilterStateModel): WorkshopCard[] { return state.topWorkshops }

  @Selector()
  static directions(state: FilterStateModel): Direction[] { return state.directions }

  @Selector()
  static isLoading(state: FilterStateModel): boolean { return state.isLoading }


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

  @Action(SetAgeRange)
  setAgeRange({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetAgeRange) {
    patchState({ ageRange: payload });
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

  @Action(SetIsPaid)
  setIsPaid({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetIsPaid) {
    patchState({ isPaid: payload });
    dispatch(new FilterChange());
    ;
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
      .subscribe((filterResult: WorkshopFilterCard) => patchState(filterResult ? { filteredWorkshops: filterResult.entities, isLoading: false } : { filteredWorkshops: [], isLoading: false }),
        () => patchState({ isLoading: false }))
  }

  @Action(GetTopWorkshops)
  getTopWorkshops({ patchState }: StateContext<FilterStateModel>, { payload }: GetTopWorkshops) {
    patchState({ isLoading: true });
    return this.appWorkshopsService
      .getTopWorkshops(payload)
      .subscribe((filterResult: WorkshopFilterCard) => patchState({ topWorkshops: filterResult?.entities, isLoading: false }), () => patchState({ isLoading: false }))
  }

  @Action(SetWithDisabilityOption)
  setWithDisabilityOption({ patchState }: StateContext<FilterStateModel>, { payload }: SetWithDisabilityOption) {
    patchState({ withDisabilityOption: payload });
  }

  @Action(SetWithoutDisabilityOption)
  setWithoutDisabilityOption({ patchState }: StateContext<FilterStateModel>, { payload }: SetWithoutDisabilityOption) {
    patchState({ withoutDisabilityOption: payload });
  }

  @Action(FilterChange)
  filterChange({ }: StateContext<FilterStateModel>, { }: FilterChange) { }
}
