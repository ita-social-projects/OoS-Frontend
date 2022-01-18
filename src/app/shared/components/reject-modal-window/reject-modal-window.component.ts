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
export class RejectModalWindowComponent implements OnInit {
  @Input() application: Application;
  readonly constants: typeof Constants = Constants;
  ReasonFormGroup: FormGroup;
  modalTitle = 'ВІДМОВИТИ';
  modalDescription = 'Ви впевнені, що хочете перевести заяву у статус ”Відмовлено”?';

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RejectModalWindowComponent>
  ) {
    this.ReasonFormGroup = this.formBuilder.group({
      description: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {}

  onCancel(): void {
    this.dialogRef.close();
  }
}
