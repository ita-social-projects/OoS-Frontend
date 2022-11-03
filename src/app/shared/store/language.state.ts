import { tap, Observable } from 'rxjs';
import { SetLanguage, GetLanguage } from './language.action';
import { Injectable } from '@angular/core';
import { Action, Selector, State, StateContext } from '@ngxs/store';
import { Languages } from './../enum/languages';

export interface LanguagesStateModel {
  language: string;
}

@State<LanguagesStateModel>({
  name: 'language',
  defaults: {
    language: 'uk',
  }
})

@Injectable()
export class LanguagesState {

  @Selector()
  static language(state: LanguagesStateModel): string { return state.language; }


  @Action(SetLanguage)
  setLanguage({ patchState }: StateContext<LanguagesStateModel>, { payload }: SetLanguage): void {
    patchState({ language: payload });
  }
}
