import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { PaginationElement } from "../models/paginationElement.model";
import { GetFilteredDirections } from "./admin.actions";
import { GetFilteredWorkshops } from "./filter.actions";
import { OnPageChangeApplications, OnPageChangeChildrens, OnPageChangeDirections, OnPageChangeWorkshops, SetApplicationsPerPage, SetChildrensPerPage, SetDirectionsPerPage, SetFirstPage, SetWorkshopsPerPage, } from "./paginator.actions";
import { GetUsersChildren } from "./user.actions";

export interface PaginatorStateModel {
  workshopsPerPage: number;
  directionsPerPage: number;
  childrensPerPage: number;
  applicationsPerPage: number;
  currentPage: PaginationElement;
}
@State<PaginatorStateModel>({
  name: 'paginator',
  defaults: {
    workshopsPerPage: 12,
    directionsPerPage: 10,
    childrensPerPage: 12,
    applicationsPerPage: 8,
    currentPage: {
      element: 1,
      isActive: true
    },
  }
})

@Injectable()
export class PaginatorState {

  @Selector() static workshopsPerPage(state: PaginatorStateModel): number { return state.workshopsPerPage; };

  @Selector() static directionsPerPage(state: PaginatorStateModel): number { return state.directionsPerPage; };

  @Selector() static childrensPerPage(state: PaginatorStateModel): number { return state.childrensPerPage; };

  @Selector() static applicationsPerPage(state: PaginatorStateModel): number { return state.applicationsPerPage; };

  @Selector() static currentPage(state: PaginatorStateModel): {} { return state.currentPage; }

  constructor() { }

  @Action(SetWorkshopsPerPage)
  setWorkshopsPerPage({ patchState, dispatch }: StateContext<PaginatorStateModel>, { payload }: SetWorkshopsPerPage): void {
    patchState({ workshopsPerPage: payload });
    dispatch(new GetFilteredWorkshops());
  }

  @Action(SetDirectionsPerPage)
  setDirectionsPerPage({ patchState, dispatch }: StateContext<PaginatorStateModel>, { payload }: SetDirectionsPerPage): void {
    patchState({ directionsPerPage: payload });
    dispatch(new GetFilteredDirections());
  }

  @Action(SetChildrensPerPage)
  setChildrensPerPage({ patchState, dispatch }: StateContext<PaginatorStateModel>, { payload }: SetChildrensPerPage): void {
    patchState({ childrensPerPage: payload });
    dispatch(new GetUsersChildren());
  }

  @Action(SetApplicationsPerPage)
  setApplicationsPerPage({ patchState }: StateContext<PaginatorStateModel>, { payload }: SetApplicationsPerPage): void {
    patchState({ applicationsPerPage: payload });

  }

  @Action(OnPageChangeDirections)
  onPageChangeDirections({ patchState, dispatch }: StateContext<PaginatorStateModel>, { payload }: OnPageChangeDirections): void {
    patchState({ currentPage: payload });
    dispatch(new GetFilteredDirections());
  }

  @Action(OnPageChangeWorkshops)
  onPageChangeWorkshops({ patchState, dispatch }: StateContext<PaginatorStateModel>, { payload }: OnPageChangeWorkshops): void {
    patchState({ currentPage: payload });
    dispatch(new GetFilteredWorkshops());
  }

  @Action(SetFirstPage)
  setFirstPage({ patchState }: StateContext<PaginatorStateModel>): void {
    patchState({ currentPage: { element: 1, isActive: true } });
  }

  @Action(OnPageChangeChildrens)
  onPageChange({ patchState, dispatch }: StateContext<PaginatorStateModel>, { payload }: OnPageChangeChildrens): void {
    patchState({ currentPage: payload });
    dispatch( new GetUsersChildren());
  }

  @Action(OnPageChangeApplications)
  onPageChangeApplications({ patchState }: StateContext<PaginatorStateModel>, { payload }: OnPageChangeApplications): void {
    patchState({ currentPage: payload });
  }
}


