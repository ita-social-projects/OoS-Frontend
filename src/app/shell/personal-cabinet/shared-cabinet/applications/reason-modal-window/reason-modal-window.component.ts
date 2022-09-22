import { ValidationConstants } from 'src/app/shared/constants/validation';
import { Component, Inject, Input } from '@angular/core';
import { Application } from 'src/app/shared/models/application.model';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ModalConfirmationDescription, ModalConfirmationText, ModalConfirmationTitle, ModalConfirmationType} from '../../../../../shared/enum/modal-confirmation';

@Component({
  selector: 'app-reason-modal-window',
  templateUrl: './reason-modal-window.component.html',
  styleUrls: ['./reason-modal-window.component.scss']
})
export class ReasonModalWindowComponent {

  readonly validationConstants = ValidationConstants;

  @Input() application: Application;
  modalTitle: string;
  modalConfirmationText: string;
  modalConfirmationDescription: string;
  readonly modalConfirmationType = ModalConfirmationType;

  ReasonFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
    Validators.minLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500)
  ]);

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: {
      type: string,
      property: string
    },
    private dialogRef: MatDialogRef<ReasonModalWindowComponent>,
    ) {}

  ngOnInit(): void {
    this.modalTitle = ModalConfirmationTitle[this.data.type];
    this.modalConfirmationText = ModalConfirmationText[this.data.type];
    this.modalConfirmationDescription = ModalConfirmationDescription[this.data.type];
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}


