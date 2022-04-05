import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { TEXT_REGEX } from 'src/app/shared/constants/regex-constants';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { Department, Direction } from 'src/app/shared/models/category.model';
import { CreateDepartment } from 'src/app/shared/store/admin.actions';

@Component({
  selector: 'app-add-department-form',
  templateUrl: './add-department-form.component.html',
  styleUrls: ['./add-department-form.component.scss']
})
export class AddDepartmentFormComponent {

  @Input() direction: Direction;

  departmentFormGroup: FormGroup;
  directionFormGroup: FormGroup;
  isActiveDepartmentInfoButton = false;
  isActiveDirectionInfoButton = false;
  department: Department;

  constructor(
    private store: Store,
    private matDialog: MatDialog,
    private _stepper: CdkStepper,
    private router: Router,
    private formBuilder: FormBuilder) {
    this.departmentFormGroup = this.formBuilder.group({
     title: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
    });
  }

  onSubmit(): void {
    if (this.departmentFormGroup.invalid) {
     this.checkValidation(this.departmentFormGroup);
    } else {
     const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
       width: '330px',
       data: {
         type: ModalConfirmationType.createDepartment,
       }
     });
     dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
      const department = result && new Department(this.departmentFormGroup.value, this.direction.id);
       this.store.dispatch(new CreateDepartment(department));
       this._stepper.next();
      } else {
        this.router.navigate([`/admin-tools/platform/directions`]);
      }
    });
   }
  }

  checkValidation(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      form.get(key).markAsTouched();
    });
   }
  }

