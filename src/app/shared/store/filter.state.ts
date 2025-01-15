import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { EMPTY_RESULT, Constants } from 'shared/constants/constants';
import { Codeficator } from 'shared/models/codeficator.model';
import { DefaultFilterState } from 'shared/models/default-filter-state.model';
import { FilterList } from 'shared/models/filter-list.model';
import { FilterStateModel } from 'shared/models/filter-state.model';
import { SearchResponse } from 'shared/models/search.model';
import { WorkshopCard } from 'shared/models/workshop.model';
import { AppWorkshopsService } from 'shared/services/workshops/app-workshop/app-workshops.service';
import {
  AddPreviousResult,
  CleanCity,
  ClearCoordsByMap,
  ClearRadiusSize,
  ConfirmCity,
  FilterChange,
  FilterClear,
  GetFilteredWorkshops,
  RemovePreviousResult,
  ResetFilteredWorkshops,
  SetCity,
  SetClosedRecruitment,
  SetCoordsByMap,
  SetDirections,
  SetEndTime,
  SetFilterFromURL,
  SetFilterPagination,
  SetFormsOfLearning,
  SetIsAppropriateAge,
  SetIsAppropriateHours,
  SetIsFree,
  SetIsPaid,
  SetIsStrictWorkdays,
  SetMapView,
  SetMaxAge,
  SetMaxPrice,
  SetMinAge,
  SetMinPrice,
  SetOpenRecruitment,
  SetOrder,
  SetRadiusSize,
  SetSearchQueryValue,
  SetStartTime,
  SetWithDisabilityOption,
  SetWorkingDays
} from './filter.actions';

@State<FilterStateModel>({
  name: 'filter',
  defaults: {
    ...new DefaultFilterState(),
    settlement: null,
    filteredWorkshops: null,
    isLoading: false,
    isConfirmCity: false,
    mapViewCoords: null,
    userRadiusSize: null,
    isMapView: false,
    from: null,
    size: null,
    previousResults: []
  }
})
@Injectable()
export class FilterState {
  constructor(private appWorkshopsService: AppWorkshopsService) {}

  @Selector()
  static FilterState(state: FilterStateModel): FilterStateModel {
    return state;
  }

  @Selector()
  static filteredWorkshops(state: FilterStateModel): SearchResponse<WorkshopCard[]> {
    return state.filteredWorkshops;
  }

  @Selector()
  static directions(state: FilterStateModel): number[] {
    return state.directionIds;
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
  static previousResults(state: FilterStateModel): string[] {
    return state.previousResults;
  }

  @Selector()
  static order(state: FilterStateModel): {} {
    return state.order;
  }

  @Selector()
  static userRadiusSize(state: FilterStateModel): number {
    const meterInKilometer = 1000;
    return state.userRadiusSize * meterInKilometer;
  }

  @Selector()
  static isMapView(state: FilterStateModel): boolean {
    return state.isMapView;
  }

  @Selector()
  static size(state: FilterStateModel): number {
    return state.size;
  }

  @Selector()
  static from(state: FilterStateModel): number {
    return state.from;
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
      directionIds,
      minPrice,
      maxPrice,
      formsOfLearning,
      isFree,
      isPaid,
      workingDays,
      startTime,
      endTime,
      statuses,
      order
    } = state;
    return {
      withDisabilityOption,
      statuses,
      formsOfLearning,
      directionIds,
      ageFilter: { minAge, maxAge, isAppropriateAge },
      priceFilter: {
        minPrice,
        maxPrice,
        isFree,
        isPaid
      },
      workingHours: {
        workingDays,
        startTime,
        endTime,
        isStrictWorkdays,
        isAppropriateHours
      },
      order
    };
  }

  @Action(SetCity)
  setCity({ patchState }: StateContext<FilterStateModel>, { payload, isConfirmedCity }: SetCity): void {
    patchState({ settlement: payload });
    if (isConfirmedCity) {
      localStorage.setItem('cityConfirmation', JSON.stringify(payload));
    }
  }

  @Action(CleanCity)
  cleanCity({ patchState }: StateContext<FilterStateModel>): void {
    patchState({ settlement: null });
  }

  @Action(ConfirmCity)
  confirmCity({ patchState }: StateContext<FilterStateModel>, { payload }: ConfirmCity): void {
    patchState({ isConfirmCity: payload });
  }

  @Action(SetOrder)
  setOrder({ patchState }: StateContext<FilterStateModel>, { payload }: SetOrder): void {
    patchState({ order: payload, from: 0 });
  }

  @Action(SetDirections)
  setDirections({ patchState }: StateContext<FilterStateModel>, { payload }: SetDirections): void {
    patchState({ directionIds: payload, from: 0 });
  }

  @Action(SetWorkingDays)
  setWorkingDays({ patchState }: StateContext<FilterStateModel>, { payload }: SetWorkingDays): void {
    patchState({ workingDays: payload, from: 0 });
  }

  @Action(SetStartTime)
  setStartTime({ patchState }: StateContext<FilterStateModel>, { payload }: SetStartTime): void {
    patchState({ startTime: payload, from: 0 });
  }

  @Action(SetEndTime)
  setEndTime({ patchState }: StateContext<FilterStateModel>, { payload }: SetEndTime): void {
    patchState({ endTime: payload, from: 0 });
  }

  @Action(SetFormsOfLearning)
  setFormsOfLearning({ patchState }: StateContext<FilterStateModel>, { payload }: SetFormsOfLearning): void {
    patchState({ formsOfLearning: payload, from: 0 });
  }

  @Action(SetIsFree)
  setIsFree({ patchState }: StateContext<FilterStateModel>, { payload }: SetIsFree): void {
    patchState({ isFree: payload, from: 0 });
  }

  @Action(SetIsPaid)
  setIsPaid({ patchState }: StateContext<FilterStateModel>, { payload }: SetIsPaid): void {
    patchState({ isPaid: payload, from: 0 });
  }

  @Action(SetMinPrice)
  setMinPrice({ patchState }: StateContext<FilterStateModel>, { payload }: SetMinPrice): void {
    patchState({ minPrice: payload, from: 0 });
  }

  @Action(SetMaxPrice)
  setMaxPrice({ patchState }: StateContext<FilterStateModel>, { payload }: SetMaxPrice): void {
    patchState({ maxPrice: payload, from: 0 });
  }

  @Action(SetSearchQueryValue)
  setSearchQueryValue({ patchState }: StateContext<FilterStateModel>, { payload }: SetSearchQueryValue): void {
    patchState({ searchQuery: payload, from: 0 });
  }

  @Action(AddPreviousResult)
  addPreviousResult(ctx: StateContext<FilterStateModel>, { result }: AddPreviousResult): void {
    const state = ctx.getState();
    const normalizedResult = result.trim().toLowerCase();
    const normalizedResults = state.previousResults.map((res) => res.trim().toLowerCase());

    if (normalizedResult && !normalizedResults.includes(normalizedResult)) {
      const updatedResults = [result, ...state.previousResults.slice(0, Constants.MAX_PREVIOUS_SEARCH_RESULTS - 1)];
      ctx.patchState({ previousResults: updatedResults });
    }
  }

  @Action(RemovePreviousResult)
  removePreviousResult(ctx: StateContext<FilterStateModel>, { previousResult }: RemovePreviousResult): void {
    const updatedResults = ctx.getState().previousResults.filter((result) => result !== previousResult);
    ctx.patchState({ previousResults: updatedResults });
  }

  @Action(SetOpenRecruitment)
  setOpenRecruitment({ patchState }: StateContext<FilterStateModel>, { payload }: SetOpenRecruitment): void {
    patchState({ statuses: payload, from: 0 });
  }

  @Action(SetClosedRecruitment)
  setClosedRecruitment({ patchState }: StateContext<FilterStateModel>, { payload }: SetClosedRecruitment): void {
    patchState({ statuses: payload, from: 0 });
  }

  @Action(GetFilteredWorkshops)
  getFilteredWorkshops(
    { patchState, getState }: StateContext<FilterStateModel>,
    { payload }: GetFilteredWorkshops
  ): Observable<SearchResponse<WorkshopCard[]>> {
    patchState({ isLoading: true });
    const state: FilterStateModel = getState();

    return this.appWorkshopsService.getFilteredWorkshops(state, payload).pipe(
      tap((filteredWorkshops: SearchResponse<WorkshopCard[]>) => {
        patchState({ filteredWorkshops: filteredWorkshops ?? EMPTY_RESULT, isLoading: false });
      })
    );
  }

  @Action(SetWithDisabilityOption)
  setWithDisabilityOption({ patchState }: StateContext<FilterStateModel>, { payload }: SetWithDisabilityOption): void {
    patchState({ withDisabilityOption: payload, from: 0 });
  }

  @Action(SetIsStrictWorkdays)
  setIsStrictWorkdays({ patchState }: StateContext<FilterStateModel>, { payload }: SetIsStrictWorkdays): void {
    patchState({ isStrictWorkdays: payload, from: 0 });
  }

  @Action(SetIsAppropriateHours)
  setIsAppropriateHours({ patchState }: StateContext<FilterStateModel>, { payload }: SetIsAppropriateHours): void {
    patchState({ isAppropriateHours: payload, from: 0 });
  }

  @Action(SetMinAge)
  setMinAge({ patchState }: StateContext<FilterStateModel>, { payload }: SetMinAge): void {
    patchState({ minAge: payload, from: 0 });
  }

  @Action(SetMaxAge)
  setMaxAge({ patchState }: StateContext<FilterStateModel>, { payload }: SetMaxAge): void {
    patchState({ maxAge: payload, from: 0 });
  }

  @Action(SetIsAppropriateAge)
  setIsAppropriateAge({ patchState }: StateContext<FilterStateModel>, { payload }: SetIsAppropriateAge): void {
    patchState({ isAppropriateAge: payload, from: 0 });
  }

  @Action(ResetFilteredWorkshops)
  resetFilteredWorkshops({ patchState }: StateContext<FilterStateModel>, {}: ResetFilteredWorkshops): void {
    patchState({ filteredWorkshops: null, from: 0 });
  }

  @Action(FilterChange)
  filterChange({ getState, dispatch }: StateContext<FilterStateModel>): void {
    const isMapView = getState().isMapView;
    dispatch(new GetFilteredWorkshops(isMapView));
  }

  @Action(FilterClear)
  FilterClear({ patchState, dispatch }: StateContext<FilterStateModel>, {}: FilterChange): void {
    patchState(new DefaultFilterState());
    dispatch(new FilterChange());
  }

  @Action(SetCoordsByMap)
  SetCoordsByMap({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetCoordsByMap): void {
    patchState({ mapViewCoords: payload, from: 0 });
    dispatch(new FilterChange());
  }

  @Action(ClearCoordsByMap)
  ClearCoordsByMap({ patchState }: StateContext<FilterStateModel>): void {
    patchState({ mapViewCoords: null, from: 0 });
  }

  @Action(SetRadiusSize)
  SetRadiusSize({ patchState }: StateContext<FilterStateModel>, { payload }: SetRadiusSize): void {
    patchState({ userRadiusSize: payload, from: 0 });
  }

  @Action(ClearRadiusSize)
  ClearRadiusSize({ patchState }: StateContext<FilterStateModel>): void {
    patchState({ userRadiusSize: null, from: 0 });
  }

  @Action(SetMapView)
  SetMapView({ patchState }: StateContext<FilterStateModel>, { payload }: SetMapView): void {
    patchState({ isMapView: payload, from: 0 });
  }

  @Action(SetFilterFromURL)
  setFilterFromURL({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetFilterFromURL): void {
    patchState(payload);
    dispatch(new FilterChange());
  }

  @Action(SetFilterPagination)
  setSize({ patchState }: StateContext<FilterStateModel>, { paginationParameters }: SetFilterPagination): void {
    patchState({ size: paginationParameters.size, from: paginationParameters.from });
  }
}
