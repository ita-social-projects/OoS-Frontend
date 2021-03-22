export class Login {
  static readonly type = '[userRegistration] logins';
  constructor() {}
}
export class Logout {
  static readonly type = '[userRegistration] logouts';
  constructor() {}
}
export class CheckAuth {
  static readonly type = '[userRegistration] checks auth';
  constructor() {}
}
export class AuthFail {
  static readonly type = '[userRegistration] has auth failed';
  constructor() {}
}
