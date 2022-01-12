import { Component, Inject, EventEmitter, OnInit, Input, Output } from '@angular/core';
import { Constants } from 'src/app/shared/constants/constants';
import { Application } from 'src/app/shared/models/application.model';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';

import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface DialogData {
  test: string
}

@Component({
  selector: 'app-reject-modal-window',
  templateUrl: './reject-modal-window.component.html',
  styleUrls: ['./reject-modal-window.component.scss']
})
export class RejectModalWindowComponent implements OnInit {

  readonly constants: typeof Constants = Constants;

  modalTitle: string;
  modalDescription: string

  ReasonFormGroup: FormGroup;

  @Input() application: Application;
  @Output() passReasonFormGroup = new EventEmitter();

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    public dialogRef: MatDialogRef<RejectModalWindowComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.ReasonFormGroup = this.formBuilder.group({
      description: new FormControl('', Validators.required)
    });
   }

  ngOnInit(): void {
    this.modalTitle = 'ВІДМОВИТИ',
    this.modalDescription = 'Ви впевнені, що хочете перевести заяву у статус ”Відмовлено”?'
    this.passReasonFormGroup.emit(this.ReasonFormGroup);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

}
