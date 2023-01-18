import { PaginationConstants } from '../constants/constants';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { PaginationElement } from '../models/paginationElement.model';
import {
  OnPageChangeAdminTable,
  OnPageChangeApplications,
  OnPageChangeChildrens,
  OnPageChangeDirections,
  OnPageChangeRating,
  OnPageChangeWorkshops,
  OnPageChangeProviders,
  SetApplicationsPerPage,
  SetDirectionsPerPage,
  SetChildrensPerPage,
  SetFirstPage,
  SetRatingPerPage,
  SetWorkshopsPerPage,
  SetTableItemsPerPage,
  OnPageChangeHistoryLog,
  SetAchievementsPerPage,
  OnPageChange,
  OnPageChangeReports,
  OnPageChangeChatRooms,
  SetChatRoomsPerPage
} from './paginator.actions';

export interface PaginatorStateModel {
  achievementPerPage: number;
  workshopsPerPage: number;
  directionsPerPage: number;
  applicationsPerPage: number;
  ratingPerPage: number;
  childrensPerPage: number;
  chatRoomsPerPage: number;
  currentPage: PaginationElement;
  tableItemsPerPage: number;
}
@State<PaginatorStateModel>({
  name: 'paginator',
  defaults: {
    achievementPerPage: 12,
    workshopsPerPage: 12,
    directionsPerPage: 12,
    applicationsPerPage: 8,
    childrensPerPage: 8,
    chatRoomsPerPage: 8,
    ratingPerPage: 12,
    tableItemsPerPage: 12,
    currentPage: PaginationConstants.firstPage
  }
})
@Injectable()
export class PaginatorState {
  @Selector() static workshopsPerPage(state: PaginatorStateModel): number {
    return state.workshopsPerPage;
  }

  @Selector() static achievementPerPage(state: PaginatorStateModel): number {
    return state.achievementPerPage;
  }

  @Selector() static directionsPerPage(state: PaginatorStateModel): number {
    return state.directionsPerPage;
  }

  @Selector() static tableItemsPerPage(state: PaginatorStateModel): number {
    return state.tableItemsPerPage;
  }

  @Selector() static applicationsPerPage(state: PaginatorStateModel): number {
    return state.applicationsPerPage;
  }

  @Selector() static ratingPerPage(state: PaginatorStateModel): number {
    return state.ratingPerPage;
  }

  @Selector() static currentPage(state: PaginatorStateModel): {} {
    return state.currentPage;
  }

  @Selector() static childrensPerPage(state: PaginatorStateModel): number {
    return state.childrensPerPage;
  }

  @Selector() static chatRoomsPerPage(state: PaginatorStateModel): number {
    return state.chatRoomsPerPage;
  }

  constructor() {}

  @Action(SetWorkshopsPerPage)
  setWorkshopsPerPage({ patchState }: StateContext<PaginatorStateModel>, { payload }: SetWorkshopsPerPage): void {
    patchState({ workshopsPerPage: payload });
  }

  @Action(SetDirectionsPerPage)
  setDirectionsPerPage({ patchState }: StateContext<PaginatorStateModel>, { payload }: SetDirectionsPerPage): void {
    patchState({ directionsPerPage: payload });
  }

  @Action(SetApplicationsPerPage)
  setApplicationsPerPage({ patchState }: StateContext<PaginatorStateModel>, { payload }: SetApplicationsPerPage): void {
    patchState({ applicationsPerPage: payload });
  }

  @Action(SetTableItemsPerPage)
  setItemsPerPage({ patchState }: StateContext<PaginatorStateModel>, { payload }: SetTableItemsPerPage): void {
    patchState({ tableItemsPerPage: payload });
  }

  @Action(SetAchievementsPerPage)
  setAchievementsPerPage({ patchState }: StateContext<PaginatorStateModel>, { payload }: SetAchievementsPerPage): void {
    patchState({ achievementPerPage: payload });
  }

  @Action(SetChildrensPerPage)
  setChildrensPerPage({ patchState }: StateContext<PaginatorStateModel>, { payload }: SetChildrensPerPage): void {
    patchState({ childrensPerPage: payload });
  }

  @Action(SetChatRoomsPerPage)
  setChatRoomsPerPage({ patchState }: StateContext<PaginatorStateModel>, { amount }: SetChatRoomsPerPage): void {
    patchState({ chatRoomsPerPage: amount });
  }

  @Action(SetRatingPerPage)
  SetRatingPerPage({ patchState }: StateContext<PaginatorStateModel>, { payload }: SetRatingPerPage): void {
    patchState({ ratingPerPage: payload });
  }

  @Action(OnPageChangeDirections)
  onPageChangeDirections({ patchState }: StateContext<PaginatorStateModel>, { payload }: OnPageChangeDirections): void {
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
  onPageChange({ patchState }: StateContext<PaginatorStateModel>, { payload }: OnPageChangeChildrens): void {
    patchState({ currentPage: payload });
  }

  @Action(OnPageChangeChatRooms)
  onPageChangeChatRooms({ patchState }: StateContext<PaginatorStateModel>, { page }: OnPageChangeChatRooms): void {
    patchState({ currentPage: page });
  }

  @Action(OnPageChangeApplications)
  onPageChangeApplications({ patchState }: StateContext<PaginatorStateModel>, { payload }: OnPageChangeApplications): void {
    patchState({ currentPage: payload });
  }

  @Action(OnPageChangeReports)
  onPageChangeReports({ patchState }: StateContext<PaginatorStateModel>, { page }: OnPageChangeReports): void {
    patchState({ currentPage: page });
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
  OnPageChangeHistoryLog({ patchState }: StateContext<PaginatorStateModel>, { payload }: OnPageChangeHistoryLog): void {
    patchState({ currentPage: payload });
  }

  @Action(OnPageChange)
  OnPage({ patchState }: StateContext<PaginatorStateModel>, { payload }: OnPageChangeHistoryLog): void {
    patchState({ currentPage: payload });
  }
}
