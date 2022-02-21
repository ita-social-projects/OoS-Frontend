import { CdkStepper } from '@angular/cdk/stepper';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { TEXT_REGEX } from 'src/app/shared/constants/regex-constants';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { Department, Direction } from 'src/app/shared/models/category.model';
import { TechAdmin } from 'src/app/shared/models/techAdmin.model';
import { CreateDepartment, GetDirectionById } from 'src/app/shared/store/admin.actions';
import { AdminState } from 'src/app/shared/store/admin.state';
import { GetDirections } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';

@Component({
  selector: 'app-add-department-form',
  templateUrl: './add-department-form.component.html',
  styleUrls: ['./add-department-form.component.scss']
})
export class AddDepartmentFormComponent implements OnInit {

  @Select(MetaDataState.departments)
  departments$: Observable<Department[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  departmentFormGroup: FormGroup;
  directionFormGroup: FormGroup;
  isActiveDepartmentInfoButton = false;
  isActiveDirectionInfoButton = false;

  department: Department;

  @Input() admin: TechAdmin;
  @Input() direction: Direction;
  @Input() CategoryFormGroup: FormGroup;


  constructor(
    private store: Store,
    private matDialog: MatDialog,
    private _stepper: CdkStepper,
    private formBuilder: FormBuilder) {
    this.departmentFormGroup = this.formBuilder.group({
     title: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
    });
  }

  ngOnInit(): void {
    this.store.dispatch(new GetDirections());
    (this.admin) && this.departmentFormGroup.patchValue(this.admin, { emitEvent: false });
    //this.passDepartmentFormGroup.emit(this.departmentFormGroup);

  }

  onSubmit(): void {
    if (this.departmentFormGroup.invalid) {
     this.checkValidation(this.departmentFormGroup);
    } else {
      const direction = this.store.selectSnapshot<Direction>(AdminState.direction);
     const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
       width: '330px',
       data: {
         type: ModalConfirmationType.createDepartment,
       }
     });
     dialogRef.afterClosed().subscribe((result: boolean) => {
      const department = new Department(this.departmentFormGroup.value, direction.id);
       result && this.store.dispatch(new CreateDepartment(department));
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

