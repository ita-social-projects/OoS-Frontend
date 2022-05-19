import { ValidationConstants } from 'src/app/shared/constants/validation';
import { Component, OnInit, Input } from '@angular/core';
import { Constants } from 'src/app/shared/constants/constants';
import { Application } from 'src/app/shared/models/application.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-reject-modal-window',
  templateUrl: './reject-modal-window.component.html',
  styleUrls: ['./reject-modal-window.component.scss'],
})
export class RejectModalWindowComponent {
  readonly validationConstants= ValidationConstants;

  @Input() application: Application;

  ReasonFormControl= new FormControl('', [
    Validators.required,
    Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
    Validators.minLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500)
  ]);
  modalTitle = 'ВІДМОВИТИ';
  modalDescription = 'Ви впевнені, що хочете перевести заяву у статус ”Відмовлено”?';

  constructor(public dialogRef: MatDialogRef<RejectModalWindowComponent>) {}

  onCancel(): void {
    this.dialogRef.close();
  }
}
