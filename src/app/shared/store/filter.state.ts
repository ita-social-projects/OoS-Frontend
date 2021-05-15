import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { AppWorkshopsService } from '../services/workshops/app-workshop/app-workshops.service';
import { Category } from '../models/category.model';
import { CategoriesService } from '../services/categories/categories.service';
import { City } from '../models/city.model';
import { Workshop } from '../models/workshop.model';
import { WorkingHours } from '../models/workingHours.model';
import {
  SetOrder,
  GetWorkshops,
  SetCity,
  GetFilteredWorkshops,
  GetTopWorkshops,
  GetCategories
} from './filter.actions';
export interface FilterStateModel {
  categories: Category[];
  ageRange: string[];
  workingHours: WorkingHours[];
  workingDays: WorkingHours[];
  isPaid: boolean;
  isFree: boolean;
  maxPrice: number;
  minPrice: number;
  isRecruiting: boolean;
  isNotRecruiting: boolean;
  city: City;
  searchQuery: string;
  order: string;
  allWorkshops: Workshop[];
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
    isRecruiting: false,
    isNotRecruiting: false,
    city: { id: null, city: '' },
    searchQuery: '',
    order: '',
    allWorkshops: [],
    filteredWorkshops: [],
    topWorkshops: []
  }
})
@Injectable()
export class FilterState {

  @Selector()
  static allWorkshops(state: FilterStateModel): Workshop[] { return state.allWorkshops };
  @Selector()
  static filteredlWorkshops(state: FilterStateModel): Workshop[] { return state.filteredWorkshops };
  @Selector()
  static topWorkshops(state: FilterStateModel): Workshop[] { return state.topWorkshops };
  @Selector()
  static categories(state: FilterStateModel): Category[] { return state.categories };
  // @Selector()
  // static categoriesCards(state: FilterStateModel): Category[] {
  //   return state.categoriesCards;
  // }

  constructor(
    private appWorkshopsService: AppWorkshopsService,
    private categoriesService: CategoriesService) { }

  @Action(SetCity)
  setCity({ patchState }: StateContext<FilterStateModel>, { payload }: SetCity): void {
    patchState({ city: payload });
  }

  @Action(SetOrder)
  setOrder({ patchState }: StateContext<FilterStateModel>, { payload }: SetOrder) {
    patchState({ order: payload });
  }

  @Action(GetWorkshops)
  getWorkshops({ patchState }: StateContext<FilterStateModel>, { }: GetWorkshops) {
    return this.appWorkshopsService
      .getAllWorkshops()
      .subscribe((workshops: Workshop[]) => patchState({ allWorkshops: workshops }))
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

  @Action(GetCategories)
  getCategories({ patchState }: StateContext<FilterStateModel>, { }: GetCategories) {
    return this.categoriesService
      .getCategories()
      .subscribe((appCategories: Category[]) => patchState({ categories: appCategories }))
  }

  // @Action(AddCategory)
  // addCategory(ctx: StateContext<FilterStateModel>, { payload }: AddCategory) {
  //   ctx.setState(
  //     patch({
  //       categories: append([payload])
  //     })
  //   );
  // }

  // @Action(SetCategory)
  // setCategory(ctx: StateContext<FilterStateModel>, { payload }: SetCategory) {
  //   ctx.setState(
  //     patch({
  //       categories: [payload]
  //     })
  //   );
  // }

}
