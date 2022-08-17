import { ValidationConstants } from 'src/app/shared/constants/validation';
import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { Direction } from '../models/category.model';
import { WorkshopCard, WorkshopFilterCard } from '../models/workshop.model';
import { AppWorkshopsService } from '../services/workshops/app-workshop/app-workshops.service';
import { Codeficator } from '../models/codeficator.model';
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
  ConfirmCity,
  CleanCity,
  FilterClear,
  SetIsPaid,
  ResetFilteredWorkshops,
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
  settlement: Codeficator;
  searchQuery: string;
  order: string;
  filteredWorkshops: WorkshopFilterCard;
  topWorkshops: WorkshopCard[];
  withDisabilityOption: boolean;
  isLoading: boolean;
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
    maxPrice: ValidationConstants.MAX_PRICE,
    minPrice: ValidationConstants.MIN_PRICE,
    isOpenRecruitment: false,
    isClosedRecruitment: false,
    settlement: JSON.parse(localStorage.getItem('cityConfirmation')),
    searchQuery: '',
    order: 'Rating',
    filteredWorkshops: null,
    topWorkshops: [],
    withDisabilityOption: false,
    isLoading: false,
    isConfirmCity: true,
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
  static settlement(state: FilterStateModel): Codeficator { return state.settlement };

  @Selector()
  static isConfirmCity(state: FilterStateModel): boolean { return state.isConfirmCity };

  @Selector()
  static searchQuery(state: FilterStateModel): string { return state.searchQuery };

  @Selector()
  static order(state: FilterStateModel): {} { return state.order };

  @Selector()
  static filterList(state: FilterStateModel): {
    withDisabilityOption: boolean;
    categoryCheckBox: Direction[],
    ageFilter: { minAge: number, maxAge: number },
    priceFilter: {
      minPrice: number,
      maxPrice: number,
      isFree: boolean,
      isPaid: boolean
    },
    workingHours: {
      workingDays: string[],
      startTime: string,
      endTime: string
    },
    order: string
  } {
    const { withDisabilityOption, minAge, maxAge, directions, minPrice, maxPrice, isFree, isPaid, workingDays, startTime, endTime, order } = state
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
      order
    }
  };

  constructor(
    private appWorkshopsService: AppWorkshopsService) { }

  @Action(SetCity)
  setCity({ patchState, dispatch, getState }: StateContext<FilterStateModel>, { payload }: SetCity): void {
    patchState({ settlement: payload });
    localStorage.setItem('cityConfirmation', JSON.stringify(payload));

    dispatch(new FilterChange());
  }

  @Action(CleanCity)
  cleanCity({ patchState }: StateContext<FilterStateModel>): void {
    patchState({ settlement: undefined });
  }

  @Action(ConfirmCity)
  confirmCity({ patchState }: StateContext<FilterStateModel>, { payload }: ConfirmCity): void {
    patchState({ isConfirmCity: payload});
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
      .pipe(tap((filterResult: WorkshopFilterCard) => {
        patchState(filterResult ? { filteredWorkshops: filterResult, isLoading: false } : { filteredWorkshops: {totalAmount: 0, entities: []}, isLoading: false })
      }));
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

  @Action(ResetFilteredWorkshops)
  resetFilteredWorkshops({ patchState }: StateContext<FilterStateModel>, {}: ResetFilteredWorkshops): void {
    patchState({ filteredWorkshops: null});
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
      maxPrice: ValidationConstants.MAX_PRICE,
      minPrice: ValidationConstants.MIN_PRICE,
      isOpenRecruitment: false,
      isClosedRecruitment: false,
      searchQuery: '',
      order: 'Rating',
      withDisabilityOption: false,
    });
  }
}
