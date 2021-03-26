import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { setMinAge, setMaxAge, SetOrder, SelectCity, GetWorkshops, GetPopWorkshops, SetCategory, AddCategory } from './filter.actions';
import { OrgCardsService } from 'src/app/shared/services/org-cards/org-cards.service';
import { orgCard } from '../models/org-card.model';
import { actCard } from '../models/activities-card.model';
import { ProviderActivitiesService } from '../services/provider-activities/provider-activities.service';
import { patch, append } from '@ngxs/store/operators';

export interface FilterStateModel {
  searchQuery: string;
  city: string;
  isRecruiting: boolean;
  ageFrom: number;
  ageTo: number;
  categories: string[];
  order: string;
  organizationCards: orgCard[];
}
@State<FilterStateModel>({
  name: 'filter',
  defaults: {
    searchQuery: '',
    city: '',
    isRecruiting: true,
    ageFrom: 0,
    ageTo: 16,
    categories: [],
    order: 'ratingDesc',
    organizationCards: []
  }
})
@Injectable()
export class FilterState {

  @Selector()
  static orgCards(state: FilterStateModel) {
    return state.organizationCards
  }

  constructor(private cardsService: OrgCardsService, private cardsActivitiesService: ProviderActivitiesService){}

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
    patchState({ city: payload});
  }
  
  @Action(SetOrder)
  setOrder({ patchState }: StateContext<FilterStateModel>, { payload }: SetOrder) {
    patchState({ order: payload});
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

  @Action(GetPopWorkshops)
  getPopCards({ patchState }: StateContext<FilterStateModel>) {
    return this.cardsService.getPopWorkshops()
    .subscribe((organizationCards: orgCard[]) => patchState({organizationCards}))
  }

  @Action(GetWorkshops)
  getWorkshops(ctx: StateContext<FilterStateModel>) {
    return this.cardsService.getWorkshops(ctx.getState())
    .subscribe((organizationCards: orgCard[]) => ctx.patchState({organizationCards}))
  }
}
