export class SetLanguage {
  static readonly type = '[language] Set language of App';
  constructor(public payload: string) {}
}


export class GetLanguage {
  static readonly type = '[language] Get language of App';
}
