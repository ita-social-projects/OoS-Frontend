import {
  ModalConfirmationDescription,
  ModalConfirmationText,
  ModalConfirmationTitle,
  ModalConfirmationType
} from './../../../enum/modal-confirmation';
import { ValidationConstants } from './../../../constants/validation';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-reason-modal-window',
  templateUrl: './reason-modal-window.component.html',
  styleUrls: ['./reason-modal-window.component.scss']
})
export class ReasonModalWindowComponent implements OnInit {
  readonly validationConstants = ValidationConstants;

  modalTitle: string;
  modalConfirmationText: string;
  modalConfirmationDescription: string;
  readonly modalConfirmationType = ModalConfirmationType;

  ReasonFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
    Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500)
  ]);

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      type: string;
      property: string;
    },
    private dialogRef: MatDialogRef<ReasonModalWindowComponent>
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
