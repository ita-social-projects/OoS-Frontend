import {Navigation} from '../models/navigation.model'

export class AddNavPath {
  static readonly type ='[navigation] Add'
  constructor(public payload: Navigation[]){ }
}

export class RemoveLastNavPath {
  static readonly type ='[navigation] Remove'
  constructor(){ }
}

export class DeleteNavPath {
  static readonly type ='[navigation] Delete'
  constructor(){ }
}

export class SidenavToggle {
  static readonly type ='[navigation] sidenavOpen'
  constructor(){ }
}
