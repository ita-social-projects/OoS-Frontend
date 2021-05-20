import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Category } from '../models/category.model';
import { City } from '../models/city.model';
import { Workshop } from '../models/workshop.model';
import { WorkingHours } from '../models/workingHours.model';
import {
  SetOrder,
  SetCity,
  GetFilteredWorkshops,
  GetTopWorkshops,
  SetCategories,
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
} from './filter.actions';
import { AppWorkshopsService } from '../services/workshops/app-workshop/app-workshops.service';
export interface FilterStateModel {
  categories: Category[];
  ageRange: string[];
  workingHours: WorkingHours[];
  workingDays: WorkingHours[];
  isPaid: boolean;
  isFree: boolean;
  maxPrice: number;
  minPrice: number;
  isOpenRecruitment: boolean;
  isClosedRecruitment: boolean;
  city: City;
  searchQuery: string;
  order: string;
  filteredWorkshops: Workshop[];
  topWorkshops: Workshop[];
}
@State<FilterStateModel>({
  name: 'filter',
  defaults: {
    categories: [],
    ageRange: [''],
    workingDays: [],
    workingHours: [],
    isPaid: false,
    isFree: false,
    maxPrice: 0,
    minPrice: 0,
    isOpenRecruitment: false,
    isClosedRecruitment: false,
    city: { id: null, city: '' },
    searchQuery: '',
    order: '',
    filteredWorkshops: [],
    topWorkshops: []
  }
})
@Injectable()
export class FilterState {

  @Selector()
  static filteredlWorkshops(state: FilterStateModel): Workshop[] { return state.filteredWorkshops }

  @Selector()
  static topWorkshops(state: FilterStateModel): Workshop[] { return state.topWorkshops }

  @Selector()
  static categories(state: FilterStateModel): Category[] { return state.categories }

  constructor(
    private appWorkshopsService: AppWorkshopsService) { }

  @Action(SetCity)
  setCity({ patchState }: StateContext<FilterStateModel>, { payload }: SetCity): void {
    patchState({ city: payload });
  }

  @Action(SetOrder)
  setOrder({ patchState }: StateContext<FilterStateModel>, { payload }: SetOrder) {
    patchState({ order: payload });
  }

  @Action(SetCategories)
  setCategories({ patchState }: StateContext<FilterStateModel>, { payload }: SetCategories): void {
    patchState({ categories: payload });
  }

  @Action(SetAgeRange)
  setAgeRange({ patchState }: StateContext<FilterStateModel>, { payload }: SetAgeRange) {
    patchState({ ageRange: payload });
  }

  @Action(SetWorkingDays)
  setWorkingDays({ patchState }: StateContext<FilterStateModel>, { payload }: SetWorkingDays) {
    patchState({ workingDays: payload });
  }

  @Action(SetWorkingHours)
  setWorkingHours({ patchState }: StateContext<FilterStateModel>, { payload }: SetWorkingHours) {
    patchState({ workingHours: payload });
  }

  @Action(SetIsFree)
  setIsFree({ patchState }: StateContext<FilterStateModel>, { payload }: SetIsFree) {
    patchState({ isFree: payload });
  }

  @Action(SetIsPaid)
  setIsPaid({ patchState }: StateContext<FilterStateModel>, { payload }: SetIsPaid) {
    patchState({ isPaid: payload });
  }

  @Action(SetMinPrice)
  setMinPrice({ patchState }: StateContext<FilterStateModel>, { payload }: SetMinPrice) {
    patchState({ minPrice: payload });
  }

  @Action(SetMaxPrice)
  setMaxPrice({ patchState }: StateContext<FilterStateModel>, { payload }: SetMaxPrice) {
    patchState({ maxPrice: payload });
  }

  @Action(SetSearchQueryValue)
  setSearchQueryValue({ patchState }: StateContext<FilterStateModel>, { payload }: SetSearchQueryValue) {
    patchState({ searchQuery: payload });
  }

  @Action(SetOpenRecruitment)
  setOpenRecruitment({ patchState }: StateContext<FilterStateModel>, { payload }: SetOpenRecruitment) {
    patchState({ isOpenRecruitment: payload });
  }

  @Action(SetClosedRecruitment)
  setClosedRecruitment({ patchState }: StateContext<FilterStateModel>, { payload }: SetClosedRecruitment) {
    patchState({ isClosedRecruitment: payload });
  }

  @Action(GetFilteredWorkshops)
  getFilteredWorkshops({ patchState }: StateContext<FilterStateModel>, { payload }: GetFilteredWorkshops) {
    return this.appWorkshopsService
      .getFilteredWorkshops(payload)
      .subscribe((workshops: Workshop[]) => patchState({ filteredWorkshops: workshops }))
  }

  @Action(GetTopWorkshops)
  getTopWorkshops({ patchState }: StateContext<FilterStateModel>, { }: GetTopWorkshops) {
    return this.appWorkshopsService
      .getTopWorkshops()
      .subscribe((workshops: Workshop[]) => patchState({ topWorkshops: workshops }))
  }
}
