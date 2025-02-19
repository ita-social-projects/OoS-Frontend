import { MessageBarData } from 'shared/models/message-bar.model';
import { TimerData } from 'shared/models/server-error';

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
