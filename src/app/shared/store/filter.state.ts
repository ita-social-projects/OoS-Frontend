import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { EMPTY_RESULT } from '../constants/constants';
import { Codeficator } from '../models/codeficator.model';
import { DefaultFilterFormState } from '../models/defaultFilterFormState.model';
import { FilterStateModel } from '../models/filterState.model';
import { FilterList } from '../models/filterList.model';
import { SearchResponse } from '../models/search.model';
import { WorkshopCard } from '../models/workshop.model';
import { AppWorkshopsService } from '../services/workshops/app-workshop/app-workshops.service';
import {
  CleanCity,
  ClearCoordsByMap,
  ClearRadiusSize,
  ConfirmCity,
  FilterChange,
  FilterClear,
  GetFilteredWorkshops,
  ResetFilteredWorkshops,
  SetCity,
  SetClosedRecruitment,
  SetCoordsByMap,
  SetDirections,
  SetEndTime,
  SetFilterFromURL,
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
import { SetFirstPage } from './paginator.actions';
import { WorkshopOpenStatus } from '../enum/workshop';

@State<FilterStateModel>({
  name: 'filter',
  defaults: {
    filterForm: new DefaultFilterFormState(),
    settlement: null,
    filteredWorkshops: null,
    isLoading: false,
    isConfirmCity: false,
    mapViewCoords: null,
    userRadiusSize: null,
    isMapView: false
  }
})
@Injectable()
export class FilterState {
  @Selector()
  static filterForm(state: FilterStateModel): DefaultFilterFormState {
    return state.filterForm;
  }

  @Selector()
  static filteredWorkshops(state: FilterStateModel): SearchResponse<WorkshopCard[]> {
    return state.filteredWorkshops;
  }

  @Selector()
  static searchQuery(state: FilterStateModel): string {
    return state.filterForm.searchQuery;
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
  static userRadiusSize(state: FilterStateModel) {
    const meterInKilometer = 1000;
    return state.userRadiusSize * meterInKilometer;
  }

  @Selector()
  static isMapView(state: FilterStateModel) {
    return state.isMapView;
  }

  @Selector()
  static filterList(state: FilterStateModel): any {
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
      isFree,
      isPaid,
      workingDays,
      startTime,
      endTime,
      statuses,
      order
    } = state.filterForm;
    return {
      withDisabilityOption,
      statuses,
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

  constructor(private appWorkshopsService: AppWorkshopsService) {}

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
  setOrder({ patchState, getState }: StateContext<FilterStateModel>, { payload }: SetOrder): void {
    const filterForm = JSON.parse(JSON.stringify(getState().filterForm));
    filterForm.order = payload;
    patchState({ filterForm });
  }

  @Action(SetDirections)
  setDirections({ patchState, getState }: StateContext<FilterStateModel>, { payload }: SetDirections): void {
    const filterForm = JSON.parse(JSON.stringify(getState().filterForm));
    filterForm.directionIds = payload;
    patchState({ filterForm });
  }

  @Action(SetWorkingDays)
  setWorkingDays({ patchState, getState }: StateContext<FilterStateModel>, { payload }: SetWorkingDays): void {
    const filterForm = JSON.parse(JSON.stringify(getState().filterForm));
    filterForm.workingDays = payload;
    patchState({ filterForm });
  }

  @Action(SetStartTime)
  setStartTime({ patchState, getState }: StateContext<FilterStateModel>, { payload }: SetStartTime): void {
    const filterForm = JSON.parse(JSON.stringify(getState().filterForm));
    filterForm.startTime = payload;
    patchState({ filterForm });
  }
  @Action(SetEndTime)
  setEndTime({ patchState, getState }: StateContext<FilterStateModel>, { payload }: SetEndTime): void {
    const filterForm = JSON.parse(JSON.stringify(getState().filterForm));
    filterForm.endTime = payload;
    patchState({ filterForm });
  }

  @Action(SetIsFree)
  setIsFree({ patchState, getState }: StateContext<FilterStateModel>, { payload }: SetIsFree): void {
    const filterForm = JSON.parse(JSON.stringify(getState().filterForm));
    filterForm.isFree = payload;
    patchState({ filterForm });
  }
  @Action(SetIsPaid)
  setIsPaid({ patchState, getState }: StateContext<FilterStateModel>, { payload }: SetIsPaid): void {
    const filterForm = JSON.parse(JSON.stringify(getState().filterForm));
    filterForm.isPaid = payload;
    patchState({ filterForm });
  }

  @Action(SetMinPrice)
  setMinPrice({ patchState, getState }: StateContext<FilterStateModel>, { payload }: SetMinPrice): void {
    const filterForm = JSON.parse(JSON.stringify(getState().filterForm));
    filterForm.minPrice = payload;
    patchState({ filterForm });
  }

  @Action(SetMaxPrice)
  setMaxPrice({ patchState, getState }: StateContext<FilterStateModel>, { payload }: SetMaxPrice): void {
    const filterForm = JSON.parse(JSON.stringify(getState().filterForm));
    filterForm.maxPrice = payload;
    patchState({ filterForm });
  }

  @Action(SetSearchQueryValue)
  setSearchQueryValue({ patchState, getState }: StateContext<FilterStateModel>, { payload }: SetSearchQueryValue): void {
    const filterForm = JSON.parse(JSON.stringify(getState().filterForm));
    filterForm.searchQuery = payload;
    patchState({ filterForm });
  }

  @Action(SetOpenRecruitment)
  setOpenRecruitment({ patchState, getState }: StateContext<FilterStateModel>, { payload }: SetOpenRecruitment): void {
    const filterForm = JSON.parse(JSON.stringify(getState().filterForm));
    filterForm.statuses = payload;
    patchState({ filterForm });
  }

  @Action(SetClosedRecruitment)
  setClosedRecruitment({ patchState, getState }: StateContext<FilterStateModel>, { payload }: SetClosedRecruitment): void {
    const filterForm = JSON.parse(JSON.stringify(getState().filterForm));
    filterForm.statuses = payload;
    patchState({ filterForm });
  }

  @Action(GetFilteredWorkshops)
  getFilteredWorkshops(
    { patchState, getState }: StateContext<FilterStateModel>,
    { payload }: GetFilteredWorkshops
  ): Observable<SearchResponse<WorkshopCard[]>> {
    patchState({ isLoading: true });
    const state: FilterStateModel = getState();

    return this.appWorkshopsService.getFilteredWorkshops(state, payload).pipe(
      tap((filterResult: SearchResponse<WorkshopCard[]>) => {
        patchState(
          filterResult ? { filteredWorkshops: filterResult, isLoading: false } : { filteredWorkshops: EMPTY_RESULT, isLoading: false }
        );
      })
    );
  }

  @Action(SetWithDisabilityOption)
  setWithDisabilityOption({ patchState, getState }: StateContext<FilterStateModel>, { payload }: SetWithDisabilityOption): void {
    const filterForm = JSON.parse(JSON.stringify(getState().filterForm));
    filterForm.withDisabilityOption = payload;
    patchState({ filterForm });
  }

  @Action(SetIsStrictWorkdays)
  setIsStrictWorkdays({ patchState, getState }: StateContext<FilterStateModel>, { payload }: SetIsStrictWorkdays): void {
    const filterForm = JSON.parse(JSON.stringify(getState().filterForm));
    filterForm.isStrictWorkdays = payload;
    patchState({ filterForm });
  }

  @Action(SetIsAppropriateHours)
  setIsAppropriateHours({ patchState, getState }: StateContext<FilterStateModel>, { payload }: SetIsAppropriateHours): void {
    const filterForm = JSON.parse(JSON.stringify(getState().filterForm));
    filterForm.isAppropriateHours = payload;
    patchState({ filterForm });
  }

  @Action(SetMinAge)
  setMinAge({ patchState, getState }: StateContext<FilterStateModel>, { payload }: SetMinAge): void {
    const filterForm = JSON.parse(JSON.stringify(getState().filterForm));
    filterForm.minAge = payload;
    patchState({ filterForm });
  }

  @Action(SetMaxAge)
  setMaxAge({ patchState, getState }: StateContext<FilterStateModel>, { payload }: SetMaxAge): void {
    const filterForm = JSON.parse(JSON.stringify(getState().filterForm));
    filterForm.maxAge = payload;
    patchState({ filterForm });
  }

  @Action(SetIsAppropriateAge)
  setIsAppropriateAge({ patchState, getState }: StateContext<FilterStateModel>, { payload }: SetIsAppropriateAge): void {
    const filterForm = JSON.parse(JSON.stringify(getState().filterForm));
    filterForm.isAppropriateAge = payload;
    patchState({ filterForm });
  }

  @Action(ResetFilteredWorkshops)
  resetFilteredWorkshops({ patchState }: StateContext<FilterStateModel>, {}: ResetFilteredWorkshops): void {
    patchState({ filteredWorkshops: null });
  }

  @Action(FilterChange)
  filterChange({ getState, dispatch }: StateContext<FilterStateModel>): void {
    const isMapView = getState().isMapView;
    dispatch([new SetFirstPage(), new GetFilteredWorkshops(isMapView)]);
  }

  @Action(FilterClear)
  FilterClear({ patchState, dispatch }: StateContext<FilterStateModel>, {}: FilterChange): void {
    patchState({ filterForm: new DefaultFilterFormState() });
  }

  @Action(SetCoordsByMap)
  SetCoordsByMap({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetCoordsByMap): void {
    patchState({ mapViewCoords: payload });
    dispatch(new FilterChange());
  }

  @Action(ClearCoordsByMap)
  ClearCoordsByMap({ patchState }: StateContext<FilterStateModel>): void {
    patchState({ mapViewCoords: null });
  }

  @Action(SetRadiusSize)
  SetRadiusSize({ patchState }: StateContext<FilterStateModel>, { payload }: SetRadiusSize): void {
    patchState({ userRadiusSize: payload });
  }

  @Action(ClearRadiusSize)
  ClearRadiusSize({ patchState }: StateContext<FilterStateModel>): void {
    patchState({ userRadiusSize: null });
  }

  @Action(SetMapView)
  SetMapView({ patchState }: StateContext<FilterStateModel>, { payload }: SetMapView): void {
    patchState({ isMapView: payload });
  }

  @Action(SetFilterFromURL)
  setFilterFromURL({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetFilterFromURL): void {
    if (!this.appWorkshopsService.checkFilterForChanges(payload)) {
      patchState({ filterForm: payload });
    }
    dispatch(new FilterChange());
  }
}
