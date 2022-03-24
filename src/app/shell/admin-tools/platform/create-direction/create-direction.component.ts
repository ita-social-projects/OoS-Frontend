import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Params } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { TEXT_REGEX } from 'src/app/shared/constants/regex-constants';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { createDirectionSteps } from 'src/app/shared/enum/provider';
import { Department, Direction, IClass } from 'src/app/shared/models/category.model';
import { TechAdmin } from 'src/app/shared/models/techAdmin.model';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { CreateClass, GetDepartmentByDirectionId, GetDirectionById } from 'src/app/shared/store/admin.actions';
import { AdminState } from 'src/app/shared/store/admin.state';
import { GetDepartments, GetDirections } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';

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

  directionFormGroup: FormGroup;
  departmentFormGroup: FormGroup;
  classFormGroup: FormGroup;
  editMode = false;

  @ViewChild('stepper') stepper: MatStepper;

  ClassFormArray: FormArray = new FormArray([]);
  iClass: IClass;

  @Select(MetaDataState.classes)
  iClasses$: Observable<IClass[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();
  admin: TechAdmin;
  @Input() department: Department;
  direction: Direction;


  constructor(private fb: FormBuilder,
    private store: Store,
    private route: ActivatedRoute,
    private matDialog: MatDialog,) { }

    ngOnInit(): void {
      //this.store.dispatch(new GetDepartments());
      (this.admin) && this.classFormGroup.patchValue(this.admin, { emitEvent: false });
      //this.passDepartmentFormGroup.emit(this.departmentFormGroup);
  
    }

  /**
   * This method add new FormGroup to teh FormArray
   */
   addClass(): void {
    this.ClassFormArray.push(this.newForm());
  }

  /**
   * This method create new FormGroup
   * @param FormArray: array
   */
  newForm(iClass?: IClass): FormGroup {
    const classFormGroup = this.fb.group({
      title: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
    });

    iClass && classFormGroup.patchValue(iClass, { emitEvent: false });
    return classFormGroup;
  }

  /**
   * This method delete form from teh FormArray by index
   * @param index: number
   */
  onDeleteForm(index: number): void {
    this.ClassFormArray.removeAt(index);
  }

  ngAfterViewInit(): void {
    if (this.editMode) {
      this.route.params.subscribe((params: Params) => {
        this.stepper.selectedIndex = +createDirectionSteps[params.param];
      });
    }
  }

  onSubmit(): void {
    if (this.ClassFormArray.invalid) {
      this.checkValidationClass();
    } else {
      const department = this.store.selectSnapshot<Department>(AdminState.department);
        this.ClassFormArray.controls.forEach((form: FormGroup) => {
          const iClass: IClass = new IClass(form.value, department.id);
          this.store.dispatch(new CreateClass(iClass));
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
  }
}
