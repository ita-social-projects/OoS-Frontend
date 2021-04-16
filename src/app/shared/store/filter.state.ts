import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import {
  setMinAge,
  setMaxAge,
  SetOrder,
  SelectCity,
  GetWorkshops,
  GetPopWorkshops,
  SetCategory,
  AddCategory,
  GetTeachersCards,
  GetCategories
} from './filter.actions';
import { OrgCardsService } from '../services/org-cards/org-cards.service';
import { patch, append } from '@ngxs/store/operators';
import { TeacherCardsService } from '../services/teachers-cards/teacher-cards.service';
import { TeacherCard } from '../models/teachers-card.model';
import { Category } from '../models/category.model';
import { CategoriesService } from '../services/categories/categories.service';
import { City } from '../models/city.model';
import { Workshop } from '../models/workshop.model';

export interface FilterStateModel {
  searchQuery: string;
  city: City;
  isRecruiting: boolean;
  ageFrom: number;
  ageTo: number;
  categories: number[];
  order: string;
  organizationCards: Workshop[];
  teachersCards: TeacherCard[];
  categoriesCards: Category[];
}
@State<FilterStateModel>({
  name: 'filter',
  defaults: {
    searchQuery: '',
    city: { id: null, city: '' },
    isRecruiting: true,
    ageFrom: 0,
    ageTo: 16,
    categories: [],
    order: 'ratingDesc',
    organizationCards: [],
    teachersCards: [],
    categoriesCards: []
  }
})
@Injectable()
export class FilterState {

  @Selector()
  static orgCards(state: FilterStateModel) {
    return state.organizationCards;
  }
  @Selector()
  static teacherCards(state: FilterStateModel): TeacherCard[] {
    return state.teachersCards;
  }
  @Selector()
  static categoriesCards(state: FilterStateModel): Category[] {
    return state.categoriesCards;
  }

  constructor(
    private cardsService: OrgCardsService,
    private teacherCardService: TeacherCardsService,
    private categoriesService: CategoriesService
  ) { }

  @Action(setMinAge)
  setMinAge({ patchState }: StateContext<FilterStateModel>, { payload }: setMinAge): void {
    patchState({ ageFrom: payload })
  }

  @Action(setMaxAge)
  setMaxAge({ patchState }: StateContext<FilterStateModel>, { payload }: setMaxAge): void {
    patchState({ ageTo: payload })
  }

  @Action(SelectCity)
  selectCity({ patchState }: StateContext<FilterStateModel>, { payload }: SelectCity): void {
    patchState({ city: payload });
  }

  @Action(SetOrder)
  setOrder({ patchState }: StateContext<FilterStateModel>, { payload }: SetOrder) {
    patchState({ order: payload });
  }

  @Action(AddCategory)
  addCategory(ctx: StateContext<FilterStateModel>, { payload }: AddCategory) {
    ctx.setState(
      patch({
        categories: append([payload])
      })
    );
  }

  @Action(SetCategory)
  setCategory(ctx: StateContext<FilterStateModel>, { payload }: SetCategory) {
    ctx.setState(
      patch({
        categories: [payload]
      })
    );
  }

  @Action(GetWorkshops)
  getWorkshops(ctx: StateContext<FilterStateModel>) {
    return this.cardsService.getWorkshops(ctx.getState())
      .subscribe((organizationCards: Workshop[]) => ctx.patchState({ organizationCards }))
  }

  @Action(GetPopWorkshops)
  getPopWorkshops({ patchState }: StateContext<FilterStateModel>) {
    return this.cardsService.getPopWorkshops()
      .subscribe((organizationCards: Workshop[]) => patchState({ organizationCards }))
  }

  @Action(GetTeachersCards)
  GetTeachersCards({ patchState }: StateContext<FilterStateModel>): void {
    this.teacherCardService.getTeachersInfo()
      .subscribe((teachersCards: TeacherCard[]) => {
        patchState({ teachersCards });
      });
  }

  @Action(GetCategories)
  getCategories({ patchState }: StateContext<FilterStateModel>) {
    return this.categoriesService.getCategories()
      .subscribe((categoriesCards: Category[]) => patchState({ categoriesCards }))
  }

}
