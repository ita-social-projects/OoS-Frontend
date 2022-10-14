export class GetTopDirections {
  static readonly type = '[mainPage] Get Top Directions';
}

export class GetMainPageInfo {
  static readonly type = '[mainPage] Get Main Page Info';
  constructor() {}
}

export class GetTopWorkshops {
  static readonly type = '[mainPage] Get Most Popular Workshop Cards';
  constructor() {}
}

export class ResetMainPageResult {
  static readonly type = '[mainPage] reset main page result';
  constructor() {}
}
