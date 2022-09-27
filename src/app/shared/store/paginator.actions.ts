import { PaginationElement } from "../models/paginationElement.model";


export class SetAdminsPerPage {
  static readonly type = '[paginator] Items Per Page';
  constructor(public payload: number) { }
}
export class SetProvidersPerPage {
  static readonly type = '[paginator] Items Per Page';
  constructor(public payload: number) { }
}
export class SetHistoryItemsPerPage {
  static readonly type = '[paginator] Items Per Page';
  constructor(public payload: number) { }
}

export class SetItemsPerPage {
  static readonly type = '[paginator] Items Per Page';
  constructor(public payload: number) { }
}

export class SetWorkshopsPerPage {
  static readonly type = '[paginator] Workshops Per Page';
  constructor(public payload: number) { }
}

export class SetDirectionsPerPage {
  static readonly type = '[paginator] Directions Per Page';
  constructor(public payload: number) { }
}

export class SetChildrensPerPage {
  static readonly type = '[paginator] Childrens Per Page';
  constructor(public payload: number) { }
}

export class SetApplicationsPerPage {
  static readonly type = '[paginator] Applications Per Page';
  constructor(public payload: number) { }
}

export class SetRatingPerPage {
  static readonly type = '[paginator] Rating Per Page';
  constructor(public payload: number) { }
}

export class OnPageChangeWorkshops {
  static readonly type = '[paginator] Change Page';
  constructor(public payload: PaginationElement) { }
}

export class OnPageChangeProviders {
  static readonly type = '[paginator] Change Page';
  constructor(public payload: PaginationElement) { }
}

export class OnPageChangeDirections {
  static readonly type = '[paginator] Change Page';
  constructor(public payload: PaginationElement) { }
}

export class OnPageChangeChildrens {
  static readonly type = '[paginator] Change Page';
  constructor(public payload: PaginationElement) { }
}

export class OnPageChangeApplications {
  static readonly type = '[paginator] Change Page';
  constructor(public payload: PaginationElement) { }
}

export class OnPageChangeAdminTable {
  static readonly type = '[paginator] Change Page Admin Table';
  constructor(public payload: PaginationElement) { }
}

export class OnPageChangeRating {
  static readonly type = '[paginator] Change Page';
  constructor(public payload: PaginationElement) { }
}

export class OnPageChangeHistoryLog {
  static readonly type = '[paginator] Change History Log Page';
  constructor(public payload: PaginationElement) { }
}

export class SetFirstPage {
  static readonly type = '[paginator] Set First Page';
  constructor() { }
}
