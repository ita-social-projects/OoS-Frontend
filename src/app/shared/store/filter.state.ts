import { Injectable } from '@angular/core';
import { State, Action, StateContext } from '@ngxs/store';
import { tap } from 'rxjs/operators';

import { orgCard } from 'src/app/mock-org-cards';
import { OrgCardsService } from 'src/app/shared/services/org-cards.service';
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
