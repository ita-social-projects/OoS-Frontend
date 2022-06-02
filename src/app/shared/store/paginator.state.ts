import { Injectable } from "@angular/core";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { PaginationElement } from "../models/paginationElement.model";
import { GetFilteredDirections } from "./admin.actions";
import { GetFilteredWorkshops } from "./filter.actions";
import { OnPageChangeChildrens, OnPageChangeDirections, OnPageChangeWorkshops, SetChildrensPerPage, SetDirectionsPerPage, SetFirstPage, SetWorkshopsPerPage, } from "./paginator.actions";

export interface PaginatorStateModel {
  workshopsPerPage: number;
  directionsPerPage: number;
  childrensPerPage: number;
  currentPage: PaginationElement;
}
@State<PaginatorStateModel>({
  name: 'paginator',
  defaults: {
    workshopsPerPage: 12,
    directionsPerPage: 10,
    childrensPerPage: 12,
    currentPage: {
      element: 1,
      isActive: true
    },
  }
})

@Injectable()
export class PaginatorState {

  @Selector()
  static workshopsPerPage(state: PaginatorStateModel): number { return state.workshopsPerPage; };

  @Selector()
  static directionsPerPage(state: PaginatorStateModel): number { return state.directionsPerPage; };

  @Selector()
  static childrensPerPage(state: PaginatorStateModel): number { return state.childrensPerPage; };

  @Selector()
  static currentPage(state: PaginatorStateModel): {} { return state.currentPage; }

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

  @Action(OnPageChangeDirections)
  onPageChangeDirections({ patchState, dispatch }: StateContext<PaginatorStateModel>, { payload }: OnPageChangeDirections): void {
    patchState({ currentPage: payload });
    dispatch(new GetFilteredDirections());
  }


@Action(OnPageChangeWorkshops)
onPageChangeWorkshops({ patchState, dispatch }: StateContext<PaginatorStateModel>, { payload }: OnPageChangeWorkshops) {
  patchState({ currentPage: payload });
  dispatch(new GetFilteredWorkshops());
}

@Action(SetFirstPage)
setFirstPage({ patchState }: StateContext<PaginatorStateModel>) {
  patchState({ currentPage: { element: 1, isActive: true } });
}

@Action(OnPageChangeChildrens)
onPageChange({ patchState, dispatch }: StateContext<PaginatorStateModel>, { payload }: OnPageChangeChildrens): void {
  patchState({ currentPage: payload });
}

}


