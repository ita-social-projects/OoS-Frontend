import { Navigation } from '../models/navigation.model';
export class AddNavPath {
  static readonly type = '[navigation] Add';
  constructor(public payload: Navigation[]) { }
}

export class PushNavPath {
  static readonly type = '[navigation] push nav path';
  constructor(public payload: Navigation[]) { }
}
export class RemoveLastNavPath {
  static readonly type = '[navigation] Remove';
  constructor() { }
}
export class DeleteNavPath {
  static readonly type = '[navigation] Delete';
  constructor() { }
}

export class PopNavPath {
  static readonly type = '[navigation] pop nav path';
  constructor() { }
}
export class SidenavToggle {
  static readonly type = '[navigation] sidenavOpen';
  constructor() { }
}
export class FiltersSidenavToggle {
  static readonly type = '[navigation] filtersSidenavOpen';
  constructor(public payload: boolean) { }
}

