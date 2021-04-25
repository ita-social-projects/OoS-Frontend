import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Child } from '../models/child.model';
import { Workshop } from '../models/workshop.model';
import { ChildCardService } from '../services/child-cards/child-cards.service';
import { ParentWorkshopsService } from '../services/workshops/parent-workshops/parent-workshops';
import { CreateChildren, GetChildCards, GetParentWorkshops } from './parent.actions';

export interface ParentStateModel {
  parentWorkshops: Workshop[];
  children: Child[];

}
@State<ParentStateModel>({
  name: 'parent',
  defaults: {
    parentWorkshops: [],
    children: [],
  }
})
@Injectable()
export class ParentState {
  @Selector()
  static parentWorkshops(state: ParentStateModel) {
    return state.parentWorkshops
  }
  @Selector()
  static children(state: ParentStateModel) {
    return state.children
  }

  constructor(private parentWorkshopsService: ParentWorkshopsService, private childCardsService : ChildCardService){}
  @Action(GetParentWorkshops)
  getParentWorkshops({ patchState }: StateContext<ParentStateModel>) {
      return this.parentWorkshopsService.getWorkshops().subscribe(
        (parentWorkshops: Workshop[]) => patchState({parentWorkshops})
      )
  }
  @Action(GetChildCards)
  GetChildCards({ patchState }: StateContext<ParentStateModel>) {
      return this.childCardsService.getCards().subscribe(
        (children: Child[]) => patchState({children})
      )
  }
  @Action(CreateChildren)
  createChildren({}: StateContext<ParentStateModel>, { payload }: CreateChildren): void {
    for(let i=0; i< payload.controls.length; i++ ){
      let child: Child = new Child(payload.controls[i].value);
      this.childCardsService.createChildren(child);
   }
      
  }
}

