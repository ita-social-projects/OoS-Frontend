import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { OrgCardsService } from 'src/app/shared/services/org-cards/org-cards.service';
import { orgCard } from '../models/org-card.model';
import { setMinAge, setMaxAge, getCards } from './filter.actions';

export interface FilterStateModel {
  searchQuery: string;
  city: string;
  stateOwnership: boolean;
  privateOwnership: boolean;
  isRecruiting: boolean;
  ageFrom: number;
  ageTo: number;
  categories: [];
  organizationCards: orgCard[];
}

@State<FilterStateModel>({
  name: 'filter',
  defaults: {
    searchQuery: '',
    city: '',
    stateOwnership: true,
    privateOwnership: true,
    isRecruiting: true,
    ageFrom: null,
    ageTo: null,
    categories: [],
    organizationCards: []
  }
})
@Injectable()
export class FilterState {

  @Selector()
  static orgCards(state: FilterStateModel) {
    return state.organizationCards
  }

  constructor(private cardsService: OrgCardsService){}

  @Action(setMinAge)
    setMinAge({ patchState }: StateContext<FilterStateModel>, { payload }: setMinAge): void {
      patchState({ ageFrom: payload })
    }

  @Action(setMaxAge)
    setMaxAge({ patchState }: StateContext<FilterStateModel>, { payload }: setMaxAge): void {
      patchState({ ageTo: payload })
    }

  @Action(getCards)
    getCards({ patchState }: StateContext<FilterStateModel>) {
      return this.cardsService.getCards().pipe(
        tap(organizationCards => {
          patchState({ organizationCards })
        })
      )
    }
}
