import { HttpErrorResponse } from '@angular/common/http';

import { User } from '../models/user.model';

export class Login {
  static readonly type = '[user] logins';

  constructor(public payload: boolean) {}
}

export class Logout {
  static readonly type = '[user] logouts';

  constructor() {}
}

export class CheckAuth {
  static readonly type = '[user] checks auth';

  constructor() {}
}

export class OnAuthFail {
  static readonly type = '[user] has auth failed';

  constructor() {}
}

export class CheckRegistration {
  static readonly type = '[user] checks registration';

  constructor() {}
}

export class GetProfile {
  static readonly type = '[user] get profile';

  constructor() {}
}

export class RegisterUser {
  static readonly type = '[user] change register status';

  constructor() {}
}

export class UpdateUser {
  static readonly type = '[user] update User';

  constructor(public user: User) {}
}

export class OnUpdateUserFail {
  static readonly type = '[user] update User fail';

  constructor(public payload: HttpErrorResponse) {}
}

export class OnUpdateUserSuccess {
  static readonly type = '[user] update User success';

  constructor() {}
}

export class GetUserPersonalInfo {
  static readonly type = '[user] get User';

  constructor() {}
}
