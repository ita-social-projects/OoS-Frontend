import { CdkStepper, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { TEXT_REGEX } from 'src/app/shared/constants/regex-constants';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { Direction } from 'src/app/shared/models/category.model';
import { TechAdmin } from 'src/app/shared/models/techAdmin.model';
import { CreateDirection } from 'src/app/shared/store/admin.actions';
import { AdminStateModel } from 'src/app/shared/store/admin.state';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';

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

  @Select(MetaDataState.directions)
  directions$: Observable<Direction[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();


  isActiveDirectionInfoButton = false;
  AdminStateModel: AdminStateModel;
  direction: Direction;


  @Input() admin: TechAdmin;
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

  ngOnInit(): void {
    (this.admin) && this.directionFormGroup.patchValue(this.admin, { emitEvent: false });

  }

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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  checkValidation(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      form.get(key).markAsTouched();
    });
  }

}


