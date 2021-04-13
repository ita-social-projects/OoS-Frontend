import { FormArray } from "@angular/forms";

export class GetChildrenActivitiesList {
  static readonly type = '[parent] gets child activities';
  constructor() {}
}
export class GetChildCards {
  static readonly type = '[parent] gets children cards';
  constructor() {}
}
export class CreateChildren {
  static readonly type = '[parent] create Children';
  constructor( public payload: FormArray ) {}
}