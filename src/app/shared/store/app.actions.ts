export class ToggleLoading {
    static readonly type = '[app] toggle page loading';
    constructor(public payload: boolean) {}
}
export class SelectCity {
    static readonly type = '[app] selects city';
    constructor(public payload: string) {}
}