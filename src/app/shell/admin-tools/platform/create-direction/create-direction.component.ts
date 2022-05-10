import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { TEXT_REGEX } from 'src/app/shared/constants/regex-constants';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { createDirectionSteps } from 'src/app/shared/enum/provider-admin';
import { Department, Direction, IClass } from 'src/app/shared/models/category.model';
import { CreateClass } from 'src/app/shared/store/admin.actions';
import { AdminState } from 'src/app/shared/store/admin.state';
import { DeleteNavPath } from 'src/app/shared/store/navigation.actions';

@Component({
  selector: 'app-create-direction',
  templateUrl: './create-direction.component.html',
  styleUrls: ['./create-direction.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS,
    useValue: { displayDefaultIndicatorType: false }
  }]
})

export class CreateDirectionComponent implements OnInit, OnDestroy {

  @Select(AdminState.direction)
  direction$: Observable<Direction>;
  direction: Direction;
  @Select(AdminState.department)
  department$: Observable<Department>;
  department: Department;
  destroy$: Subject<boolean> = new Subject<boolean>();

  editMode: boolean;

  @ViewChild('stepper') stepper: MatStepper;

  ClassFormArray: FormArray = new FormArray([]);
  @Input() classes: IClass[];

  departmentFormGroup: FormGroup;
  directionFormGroup: FormGroup;
  ClassFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog,) { }

    ngOnInit(): void {
      this.addClass();
      this.direction$.pipe(takeUntil(this.destroy$),filter((direction: Direction)=>!!direction)).subscribe((direction: Direction)=>this.direction = direction);
      this.department$.pipe(takeUntil(this.destroy$),filter((department: Department)=>!!department)).subscribe((department: Department)=>this.department = department);
    }
     
    private newForm( ): FormGroup {
      const ClassFormGroup = this.fb.group({
        title: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
      });
      return ClassFormGroup;
    }

  addClass(): void {
    this.ClassFormArray.push(this.newForm());
  }

  onDeleteForm(indexClass: number): void {
    this.ClassFormArray.removeAt(indexClass);
  }

  onSubmit(): void {
    if (this.ClassFormArray.invalid) {
      this.checkValidationClass();
    } else {
      const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
        width: '330px',
        data: {
          type: ModalConfirmationType.createClass,
        }
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
      const classes: IClass[] = [];
      const department = this.store.selectSnapshot<Department>(AdminState.department);

      this.ClassFormArray.controls.forEach((form: FormGroup) =>
        classes.push(new IClass(form.value, department.id))
        );
        this.store.dispatch(new CreateClass(classes));
      } else {
        this.router.navigate([`/admin-tools/platform/directions`]);
       }
     });
    }
   }

    checkValidationClass(): void {
    Object.keys(this.ClassFormArray.controls).forEach(key => {
      this.checkValidation(<FormGroup>this.ClassFormArray.get(key));
    });
  }
  checkValidation(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      form.get(key).markAsTouched();
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
