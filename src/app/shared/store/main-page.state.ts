import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Direction } from '../models/category.model';
import { WorkshopCard } from '../models/workshop.model';
import { DirectionsService } from '../services/directions/directions.service';
import { GetTopDirections, GetTopWorkshops } from './main-page.actions';
import { tap } from 'rxjs/operators';
import { AppWorkshopsService } from '../services/workshops/app-workshop/app-workshops.service';

export interface MainPageStateModel {
  isLoadingData: boolean;
  topWorkshops: WorkshopCard[];
  topDirections: Direction[];
}

@State<MainPageStateModel>({
  name: 'mainPage',
  defaults: {
    isLoadingData: false,
    topWorkshops: null,
    topDirections: null,
  },
})
@Injectable()
export class MainPageState {
  @Selector()
  static isLoadingData(state: MainPageStateModel): boolean {
    return state.isLoadingData;
  }

  @Selector()
  static topDirections(state: MainPageStateModel): Direction[] {
    return state.topDirections;
  }

  @Selector()
  static topWorkshops(state: MainPageStateModel): WorkshopCard[] {
    return state.topWorkshops;
  }

  constructor(private categoriesService: DirectionsService, private appWorkshopsService: AppWorkshopsService) {}

  @Action(GetTopDirections)
  getTopDirections({ patchState }: StateContext<MainPageStateModel>, {}: GetTopDirections): Observable<Direction[]> {
    patchState({ isLoadingData: true });
    return this.categoriesService
      .getTopDirections()
      .pipe(tap((topDirections: Direction[]) => patchState({ topDirections: topDirections, isLoadingData: false })));
  }

  @Action(GetTopWorkshops)
  getTopWorkshops({ patchState }: StateContext<MainPageStateModel>, { }: GetTopWorkshops) {
    patchState({ isLoadingData: true });
    return this.appWorkshopsService
      .getTopWorkshops()
      .pipe(
        tap((filterResult: WorkshopCard[]) =>
          patchState({ topWorkshops: filterResult ? filterResult : [], isLoadingData: false })
        )
      );
  }
}