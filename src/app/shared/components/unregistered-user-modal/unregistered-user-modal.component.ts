import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Login} from '../../store/registration.actions';
import {Store} from '@ngxs/store';
import {ModalData} from '../../models/modal-data.model';

@Component({
  selector: 'app-unregistered-user-modal',
  templateUrl: './unregistered-user-modal.component.html',
  styleUrls: ['./unregistered-user-modal.component.scss']
})

export class UnregisteredUserModalComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ModalData, private store: Store) {}

  login(): void {
    this.store.dispatch(new Login(false));
  }
}
