import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { MarkFormDirty } from 'src/app/shared/store/app.actions';
import { AppState } from 'src/app/shared/store/app.state';

@Injectable({
  providedIn: 'root'
})
export class CreateGuard implements CanDeactivate<unknown> {

  result: boolean
  constructor(private matDialog: MatDialog, private store: Store) { }

  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const isDirty = this.store.selectSnapshot<boolean>(AppState.isDirtyForm);

    if (isDirty) {
      const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
        width: '330px',
        data: {
          type: 'leavePage'
        }
      });
      dialogRef.afterClosed()
        .pipe(takeWhile(() => isDirty))
        .subscribe(response => response && this.store.dispatch(new MarkFormDirty(false)));

      return dialogRef.afterClosed();

    } else {
      return true;
    }
  }
}
