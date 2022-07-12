import { ValidationConstants } from 'src/app/shared/constants/validation';
import { Component, Input } from '@angular/core';
import { Application } from 'src/app/shared/models/application.model';
import { FormControl, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ModalConfirmationText, ModalConfirmationTitle} from '../../enum/modal-confirmation';

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
  modalTitle = ModalConfirmationTitle.blockParent;
  modalDescription = ModalConfirmationText.blockParent;

  constructor(
    private dialogRef: MatDialogRef<BlockModalWindowComponent>,
    ) {}

  onCancel(): void {
    this.dialogRef.close();
  }
}


