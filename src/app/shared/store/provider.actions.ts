import { FormArray, FormGroup } from "@angular/forms";
export class GetActivitiesCards {
  static readonly type = '[provider] gets activities cards';
  constructor() { }
}
export class GetApplications {
  static readonly type = '[provider] gets applications';
  constructor() { }
}
export class CreateWorkshop {
  static readonly type = '[provider] create Workshop';
  constructor(public about: FormGroup, public description: FormGroup, public address: FormGroup, public teachers: FormArray) { }
}
export class CreateAddress {
  static readonly type = '[provider] create Address';
  constructor(public payload: FormGroup) { }
}
export class CreateTeachers {
  static readonly type = '[provider] create Teachers';
  constructor(public payload: FormArray) { }
}
