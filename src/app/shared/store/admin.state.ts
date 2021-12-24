import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Action, Selector, State, StateContext } from "@ngxs/store";
import { Observable, of, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { AboutPortal } from "../models/aboutPortal.model";
import { PortalService } from "../services/portal/portal.service";
import { GetInfoAboutPortal, OnUpdateInfoAboutPortalFail, OnUpdateInfoAboutPortalSuccess, UpdateInfoAboutPortal } from "./admin.actions";
import { MarkFormDirty, ShowMessageBar } from "./app.actions";

export interface AdminStateModel {
  aboutPortal: AboutPortal;
}
@State<AdminStateModel>({
  name: 'admin',
  defaults: {
    aboutPortal: null,
  }
})
@Injectable()
export class AdminState {
  @Selector()
  static aboutPortal(state: AdminStateModel): AboutPortal { return state.aboutPortal; }

  constructor(
    private portalService: PortalService,
    private router: Router
  ) { }

  @Action(GetInfoAboutPortal)
  getInfoAboutPortal({ patchState }: StateContext<AdminStateModel>): Observable<AboutPortal> {
    return this.portalService
      .getInfoAboutPortal()
      .pipe(
        tap((aboutPortal: AboutPortal) => {
          return patchState({ aboutPortal: aboutPortal });
        }));
  }

  @Action(UpdateInfoAboutPortal)
  updateInfoAboutPortal({ dispatch }: StateContext<AdminStateModel>, { payload }: UpdateInfoAboutPortal): Observable<object> {
    return this.portalService
    .updateInfoAboutPortal(payload)
    .pipe(
      tap((res) => dispatch(new OnUpdateInfoAboutPortalSuccess(res))),
      catchError((error: Error) => of(dispatch(new OnUpdateInfoAboutPortalFail(error))))
    );
  }

  @Action(OnUpdateInfoAboutPortalFail)
  OnUpdateInfoAboutPortalFail({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateInfoAboutPortalFail): void {
    throwError(payload);
    dispatch(new ShowMessageBar({ message: 'На жаль виникла помилка', type: 'error' }));
  }

  @Action(OnUpdateInfoAboutPortalSuccess)
  OnUpdateInfoAboutPortalSuccess({ dispatch }: StateContext<AdminStateModel>, { payload }: OnUpdateInfoAboutPortalSuccess): void {
    dispatch(new MarkFormDirty(false));
    console.log('InfoAboutPortal is updated', payload);
    dispatch(new ShowMessageBar({ message: 'Інформація про портал успішно відредагована', type: 'success' }));
    this.router.navigate(['/admin-tools/platform/about']);
  }
}