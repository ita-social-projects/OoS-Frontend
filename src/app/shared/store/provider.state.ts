import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { actCard } from '../models/activities-card.model';
import { ChildCardService } from '../services/child-cards/child-cards.service';
import { ProviderActivitiesService } from '../services/provider-activities/provider-activities.service';
import { GetActivitiesCards } from './provider.actions';

export interface ProviderStateModel {
  activitiesList: actCard[];

}
@State<ProviderStateModel>({
  name: 'provider',
  defaults: {
    activitiesList: []
  }
})
@Injectable()
export class ProviderState {
  @Selector()
  static activitiesList(state: ProviderStateModel) {
    return state.activitiesList
  }

  constructor(private providerActivititesService: ProviderActivitiesService, private childCardsService : ChildCardService){}
  @Action(GetActivitiesCards)
  GetActivitiesCards({ patchState }: StateContext<ProviderStateModel>) {
      return  this.providerActivititesService.getCards().subscribe(
        (activitiesList: actCard[]) => patchState({activitiesList})
      )
  } 
}
