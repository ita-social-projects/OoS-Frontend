import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EMPTY_RESULT } from '../constants/constants';
import { ValidationConstants } from '../constants/validation';
import { Direction } from '../models/category.model';
import { Codeficator } from '../models/codeficator.model';
import { FilterStateModel } from '../models/filter-state.model';
import { FilterList } from '../models/filterList.model';
import { SearchResponse } from '../models/search.model';
import { WorkshopCard } from '../models/workshop.model';
import { AppWorkshopsService } from '../services/workshops/app-workshop/app-workshops.service';
import {
  CleanCity,
  ConfirmCity,
  FilterChange,
  FilterClear,
  GetFilteredWorkshops,
  ResetFilteredWorkshops,
  SetCity,
  SetClosedRecruitment,
  SetDirections,
  SetEndTime,
  SetIsAppropriateAge,
  SetIsAppropriateHours,
  SetIsFree,
  SetIsPaid,
  SetIsStrictWorkdays,
  SetMaxAge,
  SetMaxPrice,
  SetMinAge,
  SetMinPrice,
  SetOpenRecruitment,
  SetOrder,
  SetSearchQueryValue,
  SetStartTime,
  SetWithDisabilityOption,
  SetWorkingDays,
} from './filter.actions';

@State<FilterStateModel>({
  name: 'filter',
  defaults: {
    directions: [],
    maxAge: null,
    minAge: null,
    isAppropriateAge: false,
    startTime: null,
    endTime: null,
    workingDays: [],
    isFree: false,
    isPaid: false,
    maxPrice: ValidationConstants.MAX_PRICE,
    minPrice: ValidationConstants.MIN_PRICE,
    statuses: [],
    settlement: null,
    searchQuery: '',
    order: 'Rating',
    filteredWorkshops: null,
    withDisabilityOption: false,
    isStrictWorkdays: false,
    isAppropriateHours: false,
    isLoading: false,
    isConfirmCity: true,
  },
})
@Injectable()
export class FilterState {
  @Selector()
  static filteredWorkshops(state: FilterStateModel): SearchResponse<WorkshopCard[]> {
    return state.filteredWorkshops;
  }

  @Selector()
  static directions(state: FilterStateModel): Direction[] {
    return state.directions;
  }

  @Selector()
  static isLoading(state: FilterStateModel): boolean {
    return state.isLoading;
  }

  @Selector()
  static settlement(state: FilterStateModel): Codeficator {
    return state.settlement;
  }

  @Selector()
  static isConfirmCity(state: FilterStateModel): boolean {
    return state.isConfirmCity;
  }

  @Selector()
  static searchQuery(state: FilterStateModel): string {
    return state.searchQuery;
  }

  @Selector()
  static order(state: FilterStateModel): {} {
    return state.order;
  }

  @Selector()
  static filterList(state: FilterStateModel): FilterList {
    const {
      withDisabilityOption,
      isStrictWorkdays,
      isAppropriateHours,
      isAppropriateAge,
      minAge,
      maxAge,
      directions,
      minPrice,
      maxPrice,
      isFree,
      isPaid,
      workingDays,
      startTime,
      endTime,
      statuses,
      order,
    } = state;
    return {
      withDisabilityOption,
      statuses,
      categoryCheckBox: directions,
      ageFilter: { minAge, maxAge, isAppropriateAge },
      priceFilter: {
        minPrice,
        maxPrice,
        isFree,
        isPaid,
      },
      workingHours: {
        workingDays,
        startTime,
        endTime,
        isStrictWorkdays,
        isAppropriateHours,
      },
      order,
    };
  }

  constructor(private appWorkshopsService: AppWorkshopsService) {}

  @Action(SetCity)
  setCity({ patchState, dispatch, getState }: StateContext<FilterStateModel>, { payload, isConfirmedCity }: SetCity): void {
    patchState({ settlement: payload });
    if (isConfirmedCity) {
      localStorage.setItem('cityConfirmation', JSON.stringify(payload));
    }
    
    dispatch(new FilterChange());
  }

  @Action(CleanCity)
  cleanCity({ patchState }: StateContext<FilterStateModel>): void {
    patchState({ settlement: undefined });
  }

  @Action(ConfirmCity)
  confirmCity({ patchState }: StateContext<FilterStateModel>, { payload }: ConfirmCity): void {
    patchState({ isConfirmCity: payload });
  }

  @Action(SetOrder)
  setOrder({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetOrder): void {
    patchState({ order: payload });
    dispatch(new FilterChange());
  }

  @Action(SetDirections)
  setDirections({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetDirections): void {
    patchState({ directions: payload });
    dispatch(new FilterChange());
  }

  @Action(SetWorkingDays)
  setWorkingDays({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetWorkingDays): void {
    patchState({ workingDays: payload });
    dispatch(new FilterChange());
  }

  @Action(SetStartTime)
  setStartTime({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetStartTime): void {
    patchState({ startTime: payload });
    dispatch(new FilterChange());
  }
  @Action(SetEndTime)
  setEndTime({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetEndTime): void {
    patchState({ endTime: payload });
    dispatch(new FilterChange());
  }

  @Action(SetIsFree)
  setIsFree({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetIsFree): void {
    patchState({ isFree: payload });
    dispatch(new FilterChange());
  }
  @Action(SetIsPaid)
  setIsPaid({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetIsPaid): void {
    patchState({ isPaid: payload });
    dispatch(new FilterChange());
  }

  @Action(SetMinPrice)
  setMinPrice({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetMinPrice): void {
    patchState({ minPrice: payload });
    dispatch(new FilterChange());
  }

  @Action(SetMaxPrice)
  setMaxPrice({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetMaxPrice): void {
    patchState({ maxPrice: payload });
    dispatch(new FilterChange());
  }

  @Action(SetSearchQueryValue)
  setSearchQueryValue({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetSearchQueryValue): void {
    patchState({ searchQuery: payload });
    dispatch(new FilterChange());
  }

  @Action(SetOpenRecruitment)
  setOpenRecruitment({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetOpenRecruitment): void {
    patchState({ statuses: payload });
    dispatch(new FilterChange());
  }

  @Action(SetClosedRecruitment)
  setClosedRecruitment({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetClosedRecruitment): void {
    patchState({ statuses: payload });
    dispatch(new FilterChange());
  }

  @Action(GetFilteredWorkshops)
  getFilteredWorkshops({ patchState, getState }: StateContext<FilterStateModel>, { payload }: GetFilteredWorkshops): Observable<SearchResponse<WorkshopCard[]>> {
    patchState({ isLoading: true });
    const state: FilterStateModel = getState();

    return this.appWorkshopsService.getFilteredWorkshops(state, payload).pipe(
      tap((filterResult: SearchResponse<WorkshopCard[]>) => {
        patchState(
          filterResult
            ? { filteredWorkshops: filterResult, isLoading: false }
            : { filteredWorkshops: EMPTY_RESULT, isLoading: false }
        );
      })
    );
  }

  @Action(SetWithDisabilityOption)
  setWithDisabilityOption(
    { patchState, dispatch }: StateContext<FilterStateModel>,
    { payload }: SetWithDisabilityOption
  ): void {
    patchState({ withDisabilityOption: payload });
    dispatch(new FilterChange());
  }

  @Action(SetIsStrictWorkdays)
  setIsStrictWorkdays({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetIsStrictWorkdays): void {
    patchState({ isStrictWorkdays: payload });
    dispatch(new FilterChange());
  }

  @Action(SetIsAppropriateHours)
  setIsAppropriateHours({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetIsAppropriateHours): void {
    patchState({ isAppropriateHours: payload });
    dispatch(new FilterChange());
  }

  @Action(SetMinAge)
  setMinAge({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetMinAge): void {
    patchState({ minAge: payload });
    dispatch(new FilterChange());
  }

  @Action(SetMaxAge)
  setMaxAge({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetMaxAge): void {
    patchState({ maxAge: payload });
    dispatch(new FilterChange());
  }

  @Action(SetIsAppropriateAge)
  setIsAppropriateAge({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetIsAppropriateAge): void {
    patchState({ isAppropriateAge: payload });
    dispatch(new FilterChange());
  }

  @Action(ResetFilteredWorkshops)
  resetFilteredWorkshops({ patchState }: StateContext<FilterStateModel>, {}: ResetFilteredWorkshops): void {
    patchState({ filteredWorkshops: null });
  }

  @Action(FilterChange)
  filterChange({}: StateContext<FilterStateModel>, {}: FilterChange): void {}

  @Action(FilterClear)
  FilterClear({ patchState }: StateContext<FilterStateModel>, {}: FilterChange): void {
    patchState({
      directions: [],
      maxAge: null,
      minAge: null,
      isAppropriateAge: false,
      startTime: null,
      endTime: null,
      workingDays: [],
      isFree: false,
      isPaid: false,
      maxPrice: ValidationConstants.MAX_PRICE,
      minPrice: ValidationConstants.MIN_PRICE,
      statuses: [],
      searchQuery: '',
      order: 'Rating',
      withDisabilityOption: false,
      isStrictWorkdays: false,
      isAppropriateHours: false,
    });
  }
}
