import { ApplicationParameters, ApplicationUpdate, ApplicationCards } from 'src/app/shared/models/application.model';
import { HttpErrorResponse } from '@angular/common/http';
import { User } from '../models/user.model';

export class UpdateUser {
  static readonly type = '[sharedUser  update User';
  constructor(public payload: User) { }
}
export class OnUpdateUserFail {
  static readonly type = '[sharedUser]update User fail';
  constructor(public payload: HttpErrorResponse) { }
}
export class OnUpdateUserSuccess {
  static readonly type = '[sharedUser] update User success';
  constructor(public payload) { }
}
export class UpdateApplication {
  static readonly type = '[sharedUser] update Application';
  constructor(public payload: ApplicationUpdate) { }
}
export class OnUpdateApplicationFail {
  static readonly type = '[sharedUser] update Application fail';
  constructor(public payload: HttpErrorResponse) { }
}
export class OnUpdateApplicationSuccess {
  static readonly type = '[sharedUser] update Application success';
  constructor(public payload) { }
}
export class ResetProviderWorkshopDetails {
  static readonly type = '[sharedUser] clear provider and workshop details';
  constructor() { }
}
export class GetWorkshopById {
  static readonly type = '[sharedUser] get Workshop By Wokrshop Id';
  constructor(public payload: string) { }
}
export class OnGetWorkshopByIdFail {
  static readonly type = '[sharedUser] get Workshop By Workshop Id fail';
  constructor(public payload: HttpErrorResponse) { }
}
export class GetProviderById {
  static readonly type = '[sharedUser] get Provider By Provider Id';
  constructor(public payload: string) { }
}
export class OnGetProviderByIdFail {
  static readonly type = '[sharedUser]get Provider By Id fail';
  constructor(public payload: HttpErrorResponse) { }
}
export class OnGetApplicationsSuccess {
  static readonly type = '[sharedUser] get Application success';
  constructor(public payload: ApplicationCards) { }
}