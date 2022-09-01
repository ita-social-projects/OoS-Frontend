import { HttpErrorResponse } from '@angular/common/http';
import { Achievement } from '../models/achievement.model';

export class GetAchievementById {
  static readonly type = '[provider] get achievement By Id';
  constructor(public payload: string) {}
}

export class GetChildrenByWorkshopId {
  static readonly type = '[provider] get Children By Wokrshop Id';
  constructor(public payload: string) {}
}

export class GetAchievementsByWorkshopId {
  static readonly type = '[provider] get Achievements By Wokrshop Id';
  constructor(public payload: string) {}
}

export class UpdateAchievement {
  static readonly type = '[provider] update Achievement';
  constructor(public payload: Achievement) {}
}

export class OnUpdateAchievementFail {
  static readonly type = '[provider] update Achievement fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnUpdateAchievementSuccess {
  static readonly type = '[provider] update Achievement success';
  constructor(public payload: Achievement) {}
}

export class DeleteAchievementById {
  static readonly type = '[provider] delete Achievement';
  constructor(public payload: string) {}
}

export class CreateAchievement {
  static readonly type = '[provider] create Achievement';
  constructor(public payload: Achievement) {}
}

export class OnCreateAchievementFail {
  static readonly type = '[provider] create Achievement fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class OnCreateAchievementSuccess {
  static readonly type = '[provider] create Achievement success';
  constructor(public payload: Achievement) {}
}

export class OnDeleteAchievementSuccess {
  static readonly type = '[provider] delete Achievement success';
  constructor(public payload) {}
}

export class OnDeleteAchievementFail {
  static readonly type = '[provider] delete Achievement fail';
  constructor(public payload: HttpErrorResponse) {}
}

export class ResetAchievements {
  static readonly type = '[provider] reset achievements';
  constructor() {}
}
