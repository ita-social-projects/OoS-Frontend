import { PaginationConstants } from './../constants/constants';
import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { PaginationElement } from "../models/paginationElement.model";
import {
  OnPageChangeAdminTable,
  OnPageChangeApplications,
  OnPageChangeChildrens,
  OnPageChangeDirections,
  OnPageChangeRating,
  OnPageChangeWorkshops,
  OnPageChangeProviders,
  SetAdminsPerPage,
  SetApplicationsPerPage,
  SetChildrensPerPage,
  SetDirectionsPerPage,
  SetFirstPage,
  SetRatingPerPage,
  SetWorkshopsPerPage, 
  SetProvidersPerPage,
  SetHistoryItemsPerPage,
  OnPageChangeHistoryLog,
} from "./paginator.actions";

export interface PaginatorStateModel {
  workshopsPerPage: number;
  directionsPerPage: number;
  childrensPerPage: number;
  applicationsPerPage: number;
  ratingPerPage: number;

  tableItemPerPage: number;

  adminsPerPage: number;
  providersPerPage: number;
  historyItemsPerPage: number;


  currentPage: PaginationElement;
}

@State<PaginatorStateModel>({
  name: 'paginator',
  defaults: {
    workshopsPerPage: 12,
    directionsPerPage: 12,
    childrensPerPage: 12,
    applicationsPerPage: 8,
    ratingPerPage: 12,

    tableItemPerPage: 112,

    adminsPerPage: 8,
    providersPerPage: 12,
    historyItemsPerPage: 12,

    currentPage: PaginationConstants.firstPage,
  }
})

@Injectable()
export class PaginatorState {

  @Selector() static workshopsPerPage(state: PaginatorStateModel): number { return state.workshopsPerPage; };

  @Selector() static directionsPerPage(state: PaginatorStateModel): number { return state.directionsPerPage; };

  @Selector() static childrensPerPage(state: PaginatorStateModel): number { return state.childrensPerPage; };

  @Selector() static applicationsPerPage(state: PaginatorStateModel): number { return state.applicationsPerPage; };
  
  @Selector() static providersPerPage(state: PaginatorStateModel): number { return state.tableItemPerPage; };
  
  @Selector() static adminsPerPage(state: PaginatorStateModel): number { return state.tableItemPerPage; };
  
  @Selector() static historyItemsPerPage(state: PaginatorStateModel): number { return state.tableItemPerPage; };
  
  @Selector() static ratingPerPage(state: PaginatorStateModel): number { return state.ratingPerPage; };

  @Selector() static currentPage(state: PaginatorStateModel): {} { return state.currentPage; }

  constructor() { }

  @Action(SetWorkshopsPerPage)
  setWorkshopsPerPage({ patchState }: StateContext<PaginatorStateModel>, { payload }: SetWorkshopsPerPage): void {
    patchState({ workshopsPerPage: payload });
  }

  @Action(SetDirectionsPerPage)
  setDirectionsPerPage({ patchState }: StateContext<PaginatorStateModel>, { payload }: SetDirectionsPerPage): void {
    patchState({ directionsPerPage: payload });
  }

  @Action(SetChildrensPerPage)
  setChildrensPerPage({ patchState }: StateContext<PaginatorStateModel>, { payload }: SetChildrensPerPage): void {
    patchState({ childrensPerPage: payload });
  }

  @Action(SetApplicationsPerPage)
  setApplicationsPerPage({ patchState }: StateContext<PaginatorStateModel>, { payload }: SetApplicationsPerPage): void {
    patchState({ applicationsPerPage: payload });
  }


  @Action(SetProvidersPerPage)
  setProvidersPerPage({ patchState }: StateContext<PaginatorStateModel>, { payload }: SetProvidersPerPage): void {
    patchState({ tableItemPerPage: payload });
  }
  
  @Action(SetAdminsPerPage)
  setAdminsPerPage({ patchState }: StateContext<PaginatorStateModel>, { payload }: SetAdminsPerPage): void {
    patchState({ tableItemPerPage: payload });

  }

  @Action(SetRatingPerPage)
  SetRatingPerPage({ patchState }: StateContext<PaginatorStateModel>, { payload }: SetRatingPerPage): void {
    patchState({ ratingPerPage: payload });
  }

  @Action(SetHistoryItemsPerPage)
  SetHistoryItemsPerPage({ patchState }: StateContext<PaginatorStateModel>, { payload }: SetHistoryItemsPerPage): void {
    patchState({ tableItemPerPage: payload });
  }

  @Action(OnPageChangeDirections)
  onPageChangeDirections({ patchState}: StateContext<PaginatorStateModel>, { payload }: OnPageChangeDirections): void {
    patchState({ currentPage: payload });
  }

  @Action(OnPageChangeWorkshops)
  onPageChangeWorkshops({ patchState }: StateContext<PaginatorStateModel>, { payload }: OnPageChangeWorkshops): void {
    patchState({ currentPage: payload });
  }

  @Action(OnPageChangeProviders)
  onPageChangeProviders({ patchState }: StateContext<PaginatorStateModel>, { payload }: OnPageChangeProviders): void {
    patchState({ currentPage: payload });
  }

  @Action(SetFirstPage)
  setFirstPage({ patchState }: StateContext<PaginatorStateModel>): void {
    patchState({ currentPage: PaginationConstants.firstPage });
  }

  @Action(OnPageChangeChildrens)
  onPageChange({ patchState}: StateContext<PaginatorStateModel>, { payload }: OnPageChangeChildrens): void {
    patchState({ currentPage: payload });
  }

  @Action(OnPageChangeApplications)
  onPageChangeApplications({ patchState }: StateContext<PaginatorStateModel>, { payload }: OnPageChangeApplications): void {
    patchState({ currentPage: payload });
  }

  @Action(OnPageChangeAdminTable)
  onPageChangeAdminTable({ patchState }: StateContext<PaginatorStateModel>, { payload }: OnPageChangeAdminTable): void {
    patchState({ currentPage: payload });
  }

  @Action(OnPageChangeRating)
  onPageChangeRating({ patchState }: StateContext<PaginatorStateModel>, { payload }: OnPageChangeRating): void {
    patchState({ currentPage: payload });
  }

  @Action(OnPageChangeHistoryLog)
  OnPageChangeHistoryLog({ patchState}: StateContext<PaginatorStateModel>, { payload }: OnPageChangeHistoryLog): void {
    patchState({ currentPage: payload });
  }
}
