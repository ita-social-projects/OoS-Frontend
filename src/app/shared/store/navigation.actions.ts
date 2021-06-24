import {Nav} from '../models/navigation.model'

export class AddNavPath {
  static readonly type ='[navigation] Add'
  constructor(public payload: Nav[]){ }
}

export class RemoveNavPath {
  static readonly type ='[navigation] Remove'
  constructor(){ }
}

export class DeleteNavPath {
  static readonly type ='[navigation] Delete'
  constructor(){ }
}