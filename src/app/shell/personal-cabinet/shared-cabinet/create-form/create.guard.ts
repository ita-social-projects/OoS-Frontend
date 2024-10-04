import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'shared/constants/constants';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { MarkFormDirty } from 'shared/store/app.actions';
import { AppState } from 'shared/store/app.state';

@Injectable({
  providedIn: 'root'
})
export class CreateGuard {
  private result: boolean;
  constructor(
    private matDialog: MatDialog,
    private store: Store
  ) {}

  public canDeactivate(): Observable<boolean> | boolean {
    const isDirty = this.store.selectSnapshot<boolean>(AppState.isDirtyForm);

    if (isDirty) {
      const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
        width: Constants.MODAL_SMALL,
        data: { type: ModalConfirmationType.leavePage }
      });
      dialogRef
        .afterClosed()
        .pipe(takeWhile(() => isDirty))
        .subscribe((response) => response && this.store.dispatch(new MarkFormDirty(false)));

      return dialogRef.afterClosed();
    } else {
      return true;
    }
  }
}
