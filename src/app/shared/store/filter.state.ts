import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector  } from '@ngxs/store';
import {
  setMinAge,
  setMaxAge,
  SetOrder,
  SelectCity,
  getCards,
  getPopCards,
  GetTeachersCards
} from './filter.actions';
import { OrgCardsService } from 'src/app/shared/services/org-cards/org-cards.service';
import { orgCard } from '../models/org-card.model';
import { actCard } from '../models/activities-card.model';
import { ProviderActivitiesService } from '../services/provider-activities/provider-activities.service';
import {TeacherCardsService} from '../services/teachers-cards/teacher-cards.service';
import { TeacherCard } from '../models/teachers-card.model';

export interface FilterStateModel {
  searchQuery: string;
  city: string;
  stateOwnership: boolean;
  privateOwnership: boolean;
  isRecruiting: boolean;
  ageFrom: number;
  ageTo: number;
  categories: [];
  order: string;
  organizationCards: orgCard[];
  teachersCards: TeacherCard[];
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
    order: 'ratingDesc',
    organizationCards: [],
    teachersCards: [],
  }
})
@Injectable()
export class FilterState {

  @Selector()
  static orgCards(state: FilterStateModel) {
    return state.organizationCards
  }
  @Selector()
  static teacherCards(state: FilterStateModel): TeacherCard[] {
    return state.teachersCards;
  }
  constructor(private cardsService: OrgCardsService, private cardsActivitiesService: ProviderActivitiesService, private teacherCardService: TeacherCardsService){}

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
  setOrder({ patchState }: StateContext<FilterStateModel>, { payload }: SetOrder){
    patchState({ order: payload});
  }
  @Action(getCards)
    getCards({ patchState }: StateContext<FilterStateModel>) {
      return this.cardsService.getCards().subscribe(
        (organizationCards: orgCard[]) => patchState({organizationCards})

      )
    }
  @Action(getPopCards)
    getPopCards({ patchState }: StateContext<FilterStateModel>) {
      return this.cardsService.getCards()
      .subscribe((organizationCards: orgCard[]) => patchState({organizationCards}))
    }

  @Action(GetTeachersCards)
  GetTeachersCards({ patchState }: StateContext<FilterStateModel>): void {
    this.teacherCardService.getTeachersInfo()
      .subscribe(
        (  teachersCards: TeacherCard[]) => {
          patchState({  teachersCards });
        }
      );
  }

}
