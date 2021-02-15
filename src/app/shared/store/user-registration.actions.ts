export class Login {
  static readonly type = '[user] logins';
  constructor() {}
}
export class Logout {
  static readonly type = '[user] logouts';
  constructor() {}
}
export class CallApi {
  static readonly type = '[user] calls API';
  constructor() {}
}
export class CheckAuth {
  static readonly type = '[user] checks auth';
  constructor() {}
}
