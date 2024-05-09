import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';

import { MUST_CONTAIN_LETTERS } from 'shared/constants/regex-constants';
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
  public readonly validationConstants = ValidationConstants;
  public readonly modalConfirmationType = ModalConfirmationType;

  public formGroup: FormGroup;
  public modalTitle: string;
  public modalConfirmationText: string;
  public modalConfirmationDescription: string;
  public isPhoneNumberRequired: boolean;

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
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500),
        Validators.pattern(MUST_CONTAIN_LETTERS)
      ])
    });

    if (this.isPhoneNumberRequired) {
      this.formGroup.addControl(
        'phoneNumber',
        new FormControl('', [Validators.required, Validators.minLength(ValidationConstants.PHONE_LENGTH)])
      );
    }
  }

  public get reasonFormControl(): FormControl {
    return this.formGroup.get('reason') as FormControl;
  }

  public get phoneNumberFormControl(): FormControl {
    return this.isPhoneNumberRequired && (this.formGroup.get('phoneNumber') as FormControl);
  }

  public ngOnInit(): void {
    this.modalTitle = ModalConfirmationTitle[this.data.type];
    this.modalConfirmationText = ModalConfirmationText[this.data.type];
    this.modalConfirmationDescription = ModalConfirmationDescription[this.data.type];
  }

  public onSubmit(): void {
    if (this.isPhoneNumberRequired) {
      this.dialogRef.close({
        reason: this.reasonFormControl.value,
        phoneNumber: this.phoneNumberFormControl.value
      });
    } else {
      this.dialogRef.close(this.reasonFormControl.value);
    }
  }

  public onCancel(): void {
    this.dialogRef.close();
  }
}
