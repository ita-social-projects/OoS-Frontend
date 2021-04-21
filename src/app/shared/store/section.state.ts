import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {GetWorkshopById} from './section.action';
import {GroupDetailService} from '../services/group-details/group-detail.service';
import {Subscription} from 'rxjs';

export interface SectionStateModel {
  getWorkShopById: GetWorkshopById;
}

@State<SectionStateModel>({
  name: 'workshop',
  defaults: {
    getWorkShopById: {}
  }
})
@Injectable()
export class SectionState {
  @Selector()
  static getWorkShopById(state: SectionStateModel): object {
    return state.getWorkShopById;
  }

  constructor(private groupDetailService: GroupDetailService) {
  }

  @Action(GetWorkshopById)
  GetWorkshopById({patchState}: StateContext<SectionStateModel>): Subscription {
    return this.groupDetailService.getWorkshopDetail().subscribe((getWorkShopById) => {
      patchState({getWorkShopById});
    });
  }

}
