import { ValidationConstants } from 'src/app/shared/constants/validation';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Constants } from 'src/app/shared/constants/constants';
import { Application } from 'src/app/shared/models/application.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { GetBlockedParents } from '../../store/user.actions';
import { UserState } from '../../store/user.state';
import { Observable } from 'rxjs';
import { BlockedParent } from '../../models/block.model';

@Component({
  selector: 'app-block-modal-window',
  templateUrl: './block-modal-window.component.html',
  styleUrls: ['./block-modal-window.component.scss']
})
export class BlockModalWindowComponent {

  readonly validationConstants= ValidationConstants;

  @Input() application: Application;

  ReasonFormControl= new FormControl('', [
    Validators.required,
    Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
    Validators.minLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500)
  ]);
  modalTitle = 'ЗАБЛОКУВАТИ';
  modalDescription = 'Ви впевнені, що хочете заблокувати користувача?';

  constructor(
    public dialogRef: MatDialogRef<BlockModalWindowComponent>,
    ) {}

  onCancel(): void {
    this.dialogRef.close();
  }
}


