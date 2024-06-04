import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Store } from '@ngxs/store';

import { ModalData } from 'shared/models/modal-data.model';
import { Login } from 'shared/store/registration.actions';

@Component({
  selector: 'app-unregistered-user-warning-modal',
  templateUrl: './unregistered-user-warning-modal.component.html',
  styleUrls: ['./unregistered-user-warning-modal.component.scss']
})
export class UnregisteredUserWarningModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalData,
    private store: Store
  ) {}

  public login(): void {
    this.store.dispatch(new Login(false));
  }
}
