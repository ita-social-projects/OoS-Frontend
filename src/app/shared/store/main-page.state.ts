import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AdminTabTypes } from 'shared/enum/admins';
import { Direction } from 'shared/models/category.model';
import { CompanyInformation } from 'shared/models/company-information.model';
import { WorkshopCard } from 'shared/models/workshop.model';
import { DirectionsService } from 'shared/services/directions/directions.service';
import { PlatformService } from 'shared/services/platform/platform.service';
import { AppWorkshopsService } from 'shared/services/workshops/app-workshop/app-workshops.service';
import { GetMainPageInfo, GetTopDirections, GetTopWorkshops } from './main-page.actions';

export interface MainPageStateModel {
  isLoadingData: boolean;
  headerInfo: CompanyInformation;
  topWorkshops: WorkshopCard[];
  topDirections: Direction[];
}

@State<MainPageStateModel>({
  name: 'mainPage',
  defaults: {
    isLoadingData: false,
    headerInfo: null,
    topWorkshops: null,
    topDirections: null
  }
})
@Injectable()
export class MainPageState {
  constructor(
    private categoriesService: DirectionsService,
    private appWorkshopsService: AppWorkshopsService,
    private platformService: PlatformService
  ) {}

  @Selector()
  static isLoadingData(state: MainPageStateModel): boolean {
    return state.isLoadingData;
  }

  @Selector()
  static headerInfo(state: MainPageStateModel): CompanyInformation {
    return state.headerInfo;
  }

  @Selector()
  static topDirections(state: MainPageStateModel): Direction[] {
    return state.topDirections;
  }

  @Selector()
  static topWorkshops(state: MainPageStateModel): WorkshopCard[] {
    return state.topWorkshops;
  }

  @Action(GetMainPageInfo)
  getMainPageInfo({ patchState }: StateContext<MainPageStateModel>): Observable<CompanyInformation> {
    patchState({ isLoadingData: true });
    return this.platformService
      .getPlatformInfo(AdminTabTypes.MainPage)
      .pipe(tap((headerInfo: CompanyInformation) => patchState({ headerInfo, isLoadingData: false })));
  }

  @Action(GetTopDirections)
  getTopDirections({ patchState }: StateContext<MainPageStateModel>, {}: GetTopDirections): Observable<Direction[]> {
    patchState({ isLoadingData: true });
    return this.categoriesService
      .getTopDirections()
      .pipe(tap((topDirections: Direction[]) => patchState({ topDirections, isLoadingData: false })));
  }

  @Action(GetTopWorkshops)
  getTopWorkshops({ patchState }: StateContext<MainPageStateModel>, {}: GetTopWorkshops): Observable<WorkshopCard[]> {
    patchState({ isLoadingData: true });
    return this.appWorkshopsService
      .getTopWorkshops()
      .pipe(tap((topWorkshops: WorkshopCard[]) => patchState({ topWorkshops, isLoadingData: false })));
  }
}
