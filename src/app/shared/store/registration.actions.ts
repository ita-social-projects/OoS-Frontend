export class Login {
  static readonly type = '[user] logins';
  constructor() { }
}
export class Logout {
  static readonly type = '[user] logouts';
  constructor() { }
}
export class CheckAuth {
  static readonly type = '[user] checks auth';
  constructor() { }
}
export class OnAuthFail {
  static readonly type = '[user] has auth failed';
  constructor() { }
}

export class CheckRegistration {
  static readonly type = '[user] checks registration';
  constructor() { }
}

export class GetProfile {
  static readonly type = '[user] get profile';
  constructor() { }
}

export class RegistUser {
  static readonly type = '[user] change register status';
  constructor() { }
}