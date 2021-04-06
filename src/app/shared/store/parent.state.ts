import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { ChildActivities } from 'src/app/shared/models/child-activities.model';
import { ChildCard } from 'src/app/shared/models/child-card.model';
import { ChildrenActivitiesListService } from 'src/app/shared/services/children-activities-list/children-activities-list.service';
import { ChildCardService } from '../services/child-cards/child-cards.service';
import { GetChildCards, GetChildrenActivitiesList } from './parent.actions';

export interface ParentStateModel {
  childActivities: ChildActivities[];
  children: ChildCard[];

}
@State<ParentStateModel>({
  name: 'parent',
  defaults: {
    childActivities: [],
    children: []
  }
})
@Injectable()
export class ParentState {
  @Selector()
  static childrenList(state: ParentStateModel) {
    return state.childActivities
  }
  @Selector()
  static children(state: ParentStateModel) {
    return state.children
  }

  constructor(private childrenActivitiesListService: ChildrenActivitiesListService, private childCardsService : ChildCardService){}
  @Action(GetChildrenActivitiesList)
  GetChildrenActivitiesList({ patchState }: StateContext<ParentStateModel>) {
      return this.childrenActivitiesListService.getChildrenList().subscribe(
        (childActivities: ChildActivities[]) => patchState({childActivities})
      )
  }
  @Action(GetChildCards)
  GetChildCards({ patchState }: StateContext<ParentStateModel>) {
      return this.childCardsService.getCards().subscribe(
        (children: ChildCard[]) => patchState({children})
      )
  }
}
