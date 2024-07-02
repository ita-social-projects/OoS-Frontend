import { Component, Inject } from '@angular/core';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ModeConstants } from 'shared/constants/constants';
import { Role } from 'shared/enum/role';

import { ModalData } from 'shared/models/modal-data.model';
import { Login } from 'shared/store/registration.actions';
import { RegistrationState } from 'shared/store/registration.state';

@Component({
  selector: 'app-unregistered-user-warning-modal',
  templateUrl: './unregistered-user-warning-modal.component.html',
  styleUrls: ['./unregistered-user-warning-modal.component.scss']
})
export class UnregisteredUserWarningModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ModalData,
    private store: Store,
    private router: Router
  ) {}

  public login(): void {
    const role = this.store.selectSnapshot(RegistrationState.role);
    if (role === Role.unauthorized) {
      this.store.dispatch(new Login(false));
    } else {
      this.router.navigate(['/create-parent', ModeConstants.NEW]);
    }
  }
}
