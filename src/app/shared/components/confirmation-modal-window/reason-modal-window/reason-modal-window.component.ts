import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Constants } from 'shared/constants/constants';

import { ValidationConstants } from 'shared/constants/validation';
import {
  ModalConfirmationDescription,
  ModalConfirmationText,
  ModalConfirmationTitle,
  ModalConfirmationType
} from 'shared/enum/modal-confirmation';

@Component({
  selector: 'app-reason-modal-window',
  templateUrl: './reason-modal-window.component.html',
  styleUrls: ['./reason-modal-window.component.scss']
})
export class ReasonModalWindowComponent implements OnInit {
  readonly validationConstants = ValidationConstants;
  readonly modalConfirmationType = ModalConfirmationType;
  readonly phonePrefix = Constants.PHONE_PREFIX;

  formGroup: FormGroup;
  modalTitle: string;
  modalConfirmationText: string;
  modalConfirmationDescription: string;
  isPhoneNumberRequired: boolean;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { type: string; property: string },
    private dialogRef: MatDialogRef<ReasonModalWindowComponent>,
    private formBuilder: FormBuilder
  ) {
    this.isPhoneNumberRequired = this.data.type === ModalConfirmationType.blockProvider;

    this.formGroup = this.formBuilder.group({
      reason: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500)
      ])
    });

    if (this.isPhoneNumberRequired) {
      this.formGroup.addControl(
        'phoneNumber',
        new FormControl('', [Validators.required, Validators.minLength(ValidationConstants.PHONE_LENGTH)])
      );
    }
  }

  ngOnInit(): void {
    this.modalTitle = ModalConfirmationTitle[this.data.type];
    this.modalConfirmationText = ModalConfirmationText[this.data.type];
    this.modalConfirmationDescription = ModalConfirmationDescription[this.data.type];
  }

  public get reasonFormControl(): FormControl {
    return this.formGroup.get('reason') as FormControl;
  }

  public get phoneNumberFormControl(): FormControl {
    return this.isPhoneNumberRequired && (this.formGroup.get('phoneNumber') as FormControl);
  }

  onSubmit(): void {
    if (this.isPhoneNumberRequired) {
      this.dialogRef.close({
        reason: this.reasonFormControl.value,
        phoneNumber: this.phoneNumberFormControl.value
      });
    } else {
      this.dialogRef.close(this.reasonFormControl.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
