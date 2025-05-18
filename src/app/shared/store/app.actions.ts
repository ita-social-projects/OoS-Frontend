import { AreaAdmin } from 'shared/models/area-admin.model';
import { Employee } from 'shared/models/employee.model';
import { MessageBarData } from 'shared/models/message-bar.model';
import { MinistryAdmin } from 'shared/models/ministry-admin.model';
import { Parent } from 'shared/models/parent.model';
import { Provider } from 'shared/models/provider.model';
import { RegionAdmin } from 'shared/models/region-admin.model';
import { TimerData } from 'shared/models/server-error';
import { User } from 'shared/models/user.model';

export class SetProfile {
  static readonly type = '[app] set profile';
  constructor(public payload: Parent | Provider | Employee | MinistryAdmin | RegionAdmin | AreaAdmin) {}
}

export class ClearProfile {
  static readonly type = '[app] clear profile';
  constructor() {}
}

export class SetPersonalInfo {
  static readonly type = '[app] set personal info';
  constructor(public payload: User) {}
}

export class ClearPersonalInfo {
  static readonly type = '[app] clear personal info';
  constructor() {}
}

export class ToggleLoading {
  static readonly type = '[app] toggle page loading';
  constructor(public payload: boolean) {}
}

export class MarkFormDirty {
  static readonly type = '[app] mark the form dirty';
  constructor(public payload: boolean) {}
}

export class ActivateEditMode {
  static readonly type = '[app] activate edit Mode';
  constructor(public payload: boolean) {}
}

export class ShowMessageBar {
  static readonly type = '[app] show message bar';
  constructor(public payload: MessageBarData) {}
}

export class ClearMessageBar {
  static readonly type = '[app] clear message bar';
  constructor() {}
}

export class ToggleMobileScreen {
  static readonly type = '[app] isMobileScreen';
  constructor(public payload: boolean) {}
}

export class SetFocusOnCityField {
  static readonly type = '[app] SetFocusOnCityField';
  constructor() {}
}

export class SetErrorTimerData {
  static readonly type = '[app] SetErrorTimerData';
  constructor(public payload: TimerData) {}
}
