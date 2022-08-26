import { Codeficator } from 'src/app/shared/models/codeficator.model';
export class GetTopDirections {
  static readonly type = '[meta-data] Get Top Directions';
}
export class GetTopWorkshops {
  static readonly type = '[filter] Get Most Popular Workshop Cards';
  constructor(public payload: Codeficator) {}
}
export class ResetMainPageResult {
  static readonly type = '[main] reset main page result';
  constructor() {}
}