import { Injectable } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { AppState } from 'shared/store/app.state';

@Injectable({
  providedIn: 'root'
})
export class IsMobileGuard {
  @Select(AppState.isMobileScreen)
  private isMobileScreen$: Observable<boolean>;

  public canLoad(): Observable<boolean> {
    return this.isMobileScreenPipe();
  }

  public canActivate(): Observable<boolean> {
    return this.isMobileScreenPipe();
  }

  private isMobileScreenPipe(): Observable<boolean> {
    return this.isMobileScreen$.pipe(
      filter((isMobileScreen: boolean) => isMobileScreen !== undefined),
      map((isMobileScreen: boolean) => isMobileScreen)
    );
  }
}
