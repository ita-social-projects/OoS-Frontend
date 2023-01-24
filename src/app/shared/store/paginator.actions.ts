import { PaginationElement } from '../models/paginationElement.model';

export class SetWorkshopsPerPage {
  static readonly type = '[paginator] Workshops Per Page';
  constructor(public payload: number) {}
}

export class SetAchievementsPerPage {
  static readonly type = '[paginator] Achievements Per Page';
  constructor(public payload: number) {}
}

export class SetTableItemsPerPage {
  static readonly type = '[paginator] Table Items Per Page';
  constructor(public payload: number) {}
}

export class SetDirectionsPerPage {
  static readonly type = '[paginator] Directions Per Page';
  constructor(public payload: number) {}
}

export class SetChildrensPerPage {
  static readonly type = '[paginator] Childrens Per Page';
  constructor(public payload: number) {}
}

export class SetChatRoomsPerPage {
  static readonly type = '[paginator] Chat Rooms Per Page';
  constructor(public amount: number) {}
}

export class SetApplicationsPerPage {
  static readonly type = '[paginator] Applications Per Page';
  constructor(public payload: number) {}
}

export class SetRatingPerPage {
  static readonly type = '[paginator] Rating Per Page';
  constructor(public payload: number) {}
}

export class OnPageChangeWorkshops {
  static readonly type = '[paginator] Change Workshops Page';
  constructor(public payload: PaginationElement) {}
}

export class OnPageChangeAchievement {
  static readonly type = '[paginator] Change Achievments Page';
  constructor(public payload: PaginationElement) {}
}

export class OnPageChangeReports {
  static readonly type = '[paginator] Change Page Reports';
  constructor(public page: PaginationElement) {}
}

export class OnPageChangeProviders {
  static readonly type = '[paginator] Change Providers Page';
  constructor(public payload: PaginationElement) {}
}

export class OnPageChangeDirections {
  static readonly type = '[paginator] Change Directions Page';
  constructor(public payload: PaginationElement) {}
}

export class OnPageChangeChildrens {
  static readonly type = '[paginator] Change Childrens Page';
  constructor(public payload: PaginationElement) {}
}

export class OnPageChangeChatRooms {
  static readonly type = '[paginator] Change Chat Rooms Page';
  constructor(public page: PaginationElement) {}
}

export class OnPageChangeApplications {
  static readonly type = '[paginator] Change Applications Page';
  constructor(public payload: PaginationElement) {}
}

export class OnPageChangeAdminTable {
  static readonly type = '[paginator] Change Page Admin Table';
  constructor(public payload: PaginationElement) {}
}

export class OnPageChangeRating {
  static readonly type = '[paginator] Change Rate Page';
  constructor(public payload: PaginationElement) {}
}

export class SetPaginationParameters {
  static readonly type = '[paginator] Set Pagination Parameters';
  constructor(public element: PaginationElement, public itemsPerPage: number) {}
}

export class OnPageChangeHistoryLog {
  static readonly type = '[paginator] Change History Log Page';
  constructor(public payload: PaginationElement) {}
}

export class SetFirstPage {
  static readonly type = '[paginator] Set First Page';
  constructor() {}
}

export class OnPageChange {
  static readonly type = '[paginator] change current page';
  constructor(public payload: PaginationElement) {}
}
