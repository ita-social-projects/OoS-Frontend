import { CdkStepper, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { TEXT_REGEX } from 'src/app/shared/constants/regex-constants';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { Direction } from 'src/app/shared/models/category.model';
import { TechAdmin } from 'src/app/shared/models/techAdmin.model';
import { CreateDirection } from 'src/app/shared/store/admin.actions';
import { AdminStateModel } from 'src/app/shared/store/admin.state';

@Component({
  selector: 'app-add-direction-form',
  templateUrl: './add-direction-form.component.html',
  styleUrls: ['./add-direction-form.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS,
    useValue: { displayDefaultIndicatorType: false }
  }]
})
export class AddDirectionFormComponent implements OnInit {

  @Input() admin: TechAdmin;
  isActiveDirectionInfoButton = false;
  AdminStateModel: AdminStateModel;
  directionFormGroup: FormGroup;

  constructor(
    private store: Store,
    private matDialog: MatDialog,
    private _stepper: CdkStepper,
    private formBuilder: FormBuilder){
    this.directionFormGroup = this.formBuilder.group({
      title: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
   if (this.directionFormGroup.invalid) {
    this.checkValidation(this.directionFormGroup);
   } else {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: '330px',
      data: {
        type: ModalConfirmationType.createDirection,
      }
    });
    dialogRef.afterClosed().subscribe((result: boolean) => {
     const direction = new Direction(this.directionFormGroup.value);
     result && this.store.dispatch(new CreateDirection(direction));
      this._stepper.next();
    })
  }
  }

  checkValidation(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      form.get(key).markAsTouched();
    });
  }
}


