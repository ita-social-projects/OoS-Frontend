import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {Login} from '../../store/registration.actions';
import {Store} from '@ngxs/store';

interface DialogData {
  title?: string;
  message?: string;
  buttonLabel?: string;
}

@Component({
  selector: 'app-workshop-modal',
  templateUrl: './workshop-modal.component.html',
  styleUrls: ['./workshop-modal.component.scss']
})

export class WorkshopModalComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData, private store: Store) {}

  login(): void {
    this.store.dispatch(new Login(false));
  }
}
