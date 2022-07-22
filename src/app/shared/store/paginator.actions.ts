import { PaginationElement } from "../models/paginationElement.model";

export class SetWorkshopsPerPage {
  static readonly type = '[paginator] Workshops Per Page';
  constructor(public payload) { }
}

export class SetDirectionsPerPage {
  static readonly type = '[paginator] Directions Per Page';
  constructor(public payload) { }
}

export class SetChildrensPerPage {
  static readonly type = '[paginator] Childrens Per Page';
  constructor(public payload) { }
}

export class SetApplicationsPerPage {
  static readonly type = '[paginator] Applications Per Page';
  constructor(public payload) { }
}

export class OnPageChangeWorkshops {
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
  static readonly type = '[paginator] Change Page';
  constructor(public payload: PaginationElement) { }
}

export class SetFirstPage {
  static readonly type = '[paginator] Set First Page';
  constructor() { }
}
