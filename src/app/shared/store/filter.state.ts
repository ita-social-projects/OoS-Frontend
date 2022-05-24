import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Constants } from '../constants/constants';
import { Direction } from '../models/category.model';
import { City } from '../models/city.model';
import { PaginationElement } from '../models/paginationElement.model';
import { WorkshopCard, WorkshopFilterCard } from '../models/workshop.model';
import { AppWorkshopsService } from '../services/workshops/app-workshop/app-workshops.service';
import {
  SetOrder,
  SetCity,
  GetFilteredWorkshops,
  GetTopWorkshops,
  SetDirections,
  SetWorkingDays,
  SetStartTime,
  SetEndTime,
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
  PageChange,
  ConfirmCity,
  FilterClear,
  SetFirstPage,
  SetIsPaid
} from './filter.actions';

export interface FilterStateModel {
  directions: Direction[];
  maxAge: number;
  minAge: number;
  workingDays: string[];
  startTime: string;
  endTime: string;
  isFree: boolean;
  isPaid: boolean;
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
  currentPage: PaginationElement;
  isConfirmCity: boolean;
}
@State<FilterStateModel>({
  name: 'filter',
  defaults: {
    directions: [],
    maxAge: null,
    minAge: null,
    startTime: null,
    endTime: null,
    workingDays: [],
    isFree: false,
    isPaid: false,
    maxPrice: Constants.MAX_PRICE,
    minPrice: Constants.MIN_PRICE,
    isOpenRecruitment: false,
    isClosedRecruitment: false,
    city: undefined,
    searchQuery: '',
    order: 'Rating',
    filteredWorkshops: undefined,
    topWorkshops: [],
    withDisabilityOption: false,
    isLoading: false,
    currentPage: {
      element: 1,
      isActive: true
    },
    isConfirmCity: false,
  }
})
@Injectable()
export class FilterState {

  @Selector()
  static filterState(state: FilterStateModel): FilterStateModel { return state };

  @Selector()
  static filteredWorkshops(state: FilterStateModel): WorkshopFilterCard { return state.filteredWorkshops };

  @Selector()
  static topWorkshops(state: FilterStateModel): WorkshopCard[] { return state.topWorkshops };

  @Selector()
  static directions(state: FilterStateModel): Direction[] { return state.directions };

  @Selector()
  static isLoading(state: FilterStateModel): boolean { return state.isLoading };

  @Selector()
  static city(state: FilterStateModel): City { return state.city };

  @Selector()
  static isConfirmCity(state: FilterStateModel): boolean { return state.isConfirmCity };

  @Selector()
  static searchQuery(state: FilterStateModel): string { return state.searchQuery };

  @Selector()
  static currentPage(state: FilterStateModel): {} { return state.currentPage };

  @Selector()
  static order(state: FilterStateModel): {} { return state.order };

  @Selector()
  static filterList(state: FilterStateModel): any {
    const { withDisabilityOption, minAge, maxAge, directions, minPrice, maxPrice, isFree, isPaid, workingDays, startTime, endTime, currentPage, order } = state
    return {
      withDisabilityOption,
      categoryCheckBox: directions,
      ageFilter: { minAge, maxAge },
      priceFilter: {
        minPrice,
        maxPrice,
        isFree,
        isPaid
      },
      workingHours: {
        workingDays,
        startTime,
        endTime
      },
      currentPage,
      order
    }
  };

  constructor(
    private appWorkshopsService: AppWorkshopsService) { }

  @Action(SetCity)
  setCity({ patchState, getState, dispatch }: StateContext<FilterStateModel>, { payload }: SetCity): void {
    const isConfirmCity = getState().isConfirmCity;
    patchState({ city: payload });
    !isConfirmCity && localStorage.setItem('cityConfirmation', JSON.stringify(payload));
    dispatch(new FilterChange());
  }

  @Action(ConfirmCity)
  confirmCity({ patchState }: StateContext<FilterStateModel>, { payload }: ConfirmCity): void {
    patchState({isConfirmCity: payload});
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

  @Action(SetStartTime)
  setStartTime({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetStartTime) {
    patchState({ startTime: payload });
    dispatch(new FilterChange());
  }
  @Action(SetEndTime)
  setEndTime({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: SetEndTime) {
    patchState({ endTime: payload });
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
  getFilteredWorkshops({ patchState, getState }: StateContext<FilterStateModel>, { payload }: GetFilteredWorkshops) {
    patchState({ isLoading: true });
    const state: FilterStateModel = getState();

    return this.appWorkshopsService
      .getFilteredWorkshops(state, payload)
      .pipe(tap((filterResult: WorkshopFilterCard) => patchState(filterResult ? { filteredWorkshops: filterResult, isLoading: false } : { filteredWorkshops: undefined, isLoading: false }),
        () => patchState({ isLoading: false })));
  }

  @Action(GetTopWorkshops)
  getTopWorkshops({ patchState, getState }: StateContext<FilterStateModel>, { }: GetTopWorkshops) {
    patchState({ isLoading: true });
    const state: FilterStateModel = getState();

    return this.appWorkshopsService
      .getTopWorkshops(state)
      .subscribe((filterResult: WorkshopCard[]) => patchState({ topWorkshops: filterResult, isLoading: false }), () => patchState({ isLoading: false }));
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

  @Action(PageChange)
  pageChange({ patchState, dispatch }: StateContext<FilterStateModel>, { payload }: PageChange) {
    patchState({ currentPage: payload });
    dispatch(new GetFilteredWorkshops());
  }

  @Action(SetFirstPage)
  setFirstPage({ patchState }: StateContext<FilterStateModel>) {
    patchState({ currentPage: { element: 1, isActive: true } });
  }

  @Action(FilterChange)
  filterChange({ }: StateContext<FilterStateModel>, { }: FilterChange) { }

  @Action(FilterClear)
  FilterClear({ patchState }: StateContext<FilterStateModel>, { }: FilterChange) {
    patchState({
      directions: [],
      maxAge: null,
      minAge: null,
      startTime: null,
      endTime: null,
      workingDays: [],
      isFree: false,
      isPaid: false,
      maxPrice: Constants.MAX_PRICE,
      minPrice: Constants.MIN_PRICE,
      isOpenRecruitment: false,
      isClosedRecruitment: false,
      searchQuery: '',
      order: 'Rating',
      withDisabilityOption: false,
      currentPage: {
        element: 1,
        isActive: true
      }
    });
  }
}
