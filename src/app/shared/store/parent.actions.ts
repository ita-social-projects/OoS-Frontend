import { FormArray } from "@angular/forms";

export class GetParentWorkshops {
  static readonly type = '[parent] get parent workshops';
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