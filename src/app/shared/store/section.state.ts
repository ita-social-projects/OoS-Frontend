import {Action, Selector, State, StateContext} from '@ngxs/store';
import {Injectable} from '@angular/core';
import {GetWorkshopById} from './section.action';
import {GroupDetailService} from '../services/group-details/group-detail.service';


export interface SectionStateModel {
  getWorkShopById: object;
}

@State({
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
  GetWorkshopById({patchState}: StateContext<SectionStateModel>): any {
    return this.groupDetailService.getWorkshopDetail().subscribe((getWorkShopById) => {
      patchState({getWorkShopById});
      console.log(getWorkShopById);
    });
  }

}
