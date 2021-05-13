import { FormArray } from "@angular/forms";
export class GetParentWorkshops {
  static readonly type = '[parent] get parent workshops';
  constructor() { }
}
export class GetChildren {
  static readonly type = '[parent] gets children';
  constructor() { }
}
export class CreateChildren {
  static readonly type = '[parent] create Children';
  constructor(public payload: FormArray) { }
}