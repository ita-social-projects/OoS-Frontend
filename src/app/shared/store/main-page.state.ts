import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Direction } from '../models/category.model';
import { WorkshopCard } from '../models/workshop.model';
import { DirectionsService } from '../services/directions/directions.service';
import { GetMainPageInfo, GetTopDirections, GetTopWorkshops } from './main-page.actions';
import { tap } from 'rxjs/operators';
import { AppWorkshopsService } from '../services/workshops/app-workshop/app-workshops.service';
import { CompanyInformation } from '../models/сompanyInformation.model';
import { PlatformService } from '../services/platform/platform.service';
import { AdminTabsTitle } from '../enum/enumUA/tech-admin/admin-tabs';

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

  constructor(
    private categoriesService: DirectionsService,
    private appWorkshopsService: AppWorkshopsService,
    private platformSercice: PlatformService
  ) {}

  @Action(GetMainPageInfo)
  getMainPageInfo({ patchState }: StateContext<MainPageStateModel>): Observable<CompanyInformation> {
    patchState({ isLoadingData: true });
    return this.platformSercice
      .getPlatformInfo(AdminTabsTitle.MainPage)
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
