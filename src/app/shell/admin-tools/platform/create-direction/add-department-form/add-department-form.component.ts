import { GetDepartmentByDirectionId } from './../../../../../shared/store/admin.actions';
import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, startWith, takeUntil } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { TEXT_REGEX } from 'src/app/shared/constants/regex-constants';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { Department, Direction, IClass } from 'src/app/shared/models/category.model';
import { CategoriesService } from 'src/app/shared/services/categories/categories.service';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { CreateDepartment, FilteredDepartmentsList, UpdateDepartment } from 'src/app/shared/store/admin.actions';
import { AdminState } from 'src/app/shared/store/admin.state';
import { GetClasses, GetDepartments } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { CreateFormComponent } from 'src/app/shell/personal-cabinet/create-form/create-form.component';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-add-department-form',
  templateUrl: './add-department-form.component.html',
  styleUrls: ['./add-department-form.component.scss']
})
export class AddDepartmentFormComponent  extends CreateFormComponent implements OnInit, OnDestroy {
  @Input() direction: Direction;

  @Select(MetaDataState.departments)
  departments$: Observable<Department[]>;
  departments: Department[];

  @Select(MetaDataState.classes)
  classes$: Observable<IClass[]>;
  classes: IClass[];

  departmentFormGroup: FormGroup;
  selectedDepartment: Department;
  option = 0;

  constructor(
    private fb: FormBuilder,
    private _stepper: CdkStepper,
    private matDialog: MatDialog,
    store: Store,
    route: ActivatedRoute,
    navigationBarService: NavigationBarService) {
      
    super(store, route, navigationBarService);

    this.departmentFormGroup = this.fb.group({
      id: new FormControl(''),
      directionId: new FormControl(''),
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
    });

    this.classes$.pipe(
      takeUntil(this.destroy$),
      filter((classes: IClass[])=> !!classes)
    ).subscribe((classes: IClass[]) => this.classes = classes);
  }

  ngOnInit(): void {
    this.determineEditMode();
  }

  onOptionChange(option: number): void {
    this.option = option;
    this.departmentFormGroup.reset();
    this.selectedDepartment = null;
  }

  onDepartmentSelect(event: MatSelectChange ): void {
    const department = event.value;
    this.departmentFormGroup.patchValue(department);
    this.store.dispatch(new GetClasses(department.id));
  }

  addNavPath(): void {
    //TODO: add navigation bar
  }

  onStepBack(): void {
    this._stepper.previous();
  }

  setEditMode(): void {
    this.store.dispatch(new GetDepartments(this.direction.id));
    this.departments$.pipe(
      takeUntil(this.destroy$),
      filter((departments: Department[])=> !!departments)
    ).subscribe((departments: Department[]) => this.departments = departments);
  }

  onDelete(): void { }

  onSubmit(): void {
    if (this.departmentFormGroup.invalid) {
    //  this.checkValidation(this.departmentFormGroup);
    } else {
     const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
       width: '330px',
       data: {
         type: ModalConfirmationType.createDepartment,
       }
     });
     dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {

        if (this.editMode) {
          // const departmentt: Department = new Department(this.department.id, this.departmentFormGroup.value, this.direction.id);
          // this.store.dispatch(new UpdateDepartment(departmentt));
        } else {
      const department = new Department(this.departmentFormGroup.value, this.direction.id);
       this.store.dispatch(new CreateDepartment(department));
      } this._stepper.next();
      }
    });
   }
  }

  
}




