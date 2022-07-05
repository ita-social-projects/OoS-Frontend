import { ValidationConstants } from 'src/app/shared/constants/validation';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Constants } from 'src/app/shared/constants/constants';
import { Application } from 'src/app/shared/models/application.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

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

  constructor(public dialogRef: MatDialogRef<BlockModalWindowComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }
}


