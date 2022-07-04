import { DeleteDepartmentById, GetDepartmentById, OnClearDepartment, OnCreateDepartmentFail, OnUpdateDepartmentFail } from 'src/app//shared/store/admin.actions';
import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { Department, Direction, IClass } from 'src/app/shared/models/category.model';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { CreateDepartment, UpdateDepartment } from 'src/app/shared/store/admin.actions';
import { GetClasses, GetDepartments } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { CreateFormComponent } from 'src/app/shell/personal-cabinet/create-form/create-form.component';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-add-department-form',
  templateUrl: './add-department-form.component.html',
  styleUrls: ['./add-department-form.component.scss']
})
export class AddDepartmentFormComponent  extends CreateFormComponent implements OnInit, OnDestroy {
  @Input() direction: Direction;
  @Input() set department(value: Department) {
    if(!value){
      this.departmentFormGroup.reset();
      this.selectedDepartment = null;
    }
  };

  @Select(MetaDataState.departments)
  departments$: Observable<Department[]>;

  @Select(MetaDataState.classes)
  classes$: Observable<IClass[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  departmentFormGroup: FormGroup;
  departmentSelectControl: FormControl = new FormControl();

  selectedDepartment: Department;
  option: number;

  constructor(
    private fb: FormBuilder,
    private _stepper: CdkStepper,
    private matDialog: MatDialog,
    private actions$: Actions,
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

    this.actions$
      .pipe(
        ofAction(OnCreateDepartmentFail),
        takeUntil(this.destroy$))
      .subscribe(()=> this.departmentFormGroup.reset());
  }

  ngOnInit(): void {
    this.determineEditMode();
  }

  onOptionChange(option: number): void {
    this.option = option;
    this.store.dispatch(new OnClearDepartment());
  }

  onDepartmentSelect(): void {
    const department = this.departmentSelectControl.value;
    this.departmentFormGroup.patchValue(department);
    this.store.dispatch(new GetClasses(department.id));
    this.store.dispatch(new GetDepartmentById(department.id));
  }

  addNavPath(): void {
    //TODO: add navigation bar
  }

  onStepBack(): void {
    this._stepper.previous();
  }

  setEditMode(): void {
    this.store.dispatch(new GetDepartments(this.direction.id));
  }

  onDelete(): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: ModalConfirmationType.deleteDepartment,
      }
    });
    dialogRef.afterClosed().subscribe((result: boolean)  => {
      if (result) {
        this.store.dispatch(new DeleteDepartmentById(this.departmentSelectControl.value));
        this.departmentFormGroup.reset();
        this.selectedDepartment = null;
     }
   });
  }

  onSubmit(): void {
    if(this.departmentFormGroup.dirty){
      const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
        width: Constants.MODAL_SMALL,
        data: {
          type: this.departmentFormGroup.value.id ? ModalConfirmationType.editDepartment : ModalConfirmationType.createDepartment,
        }
      });
      dialogRef.afterClosed().subscribe((result: boolean)  => {
        if (result) {
          const department: Department = new Department(this.departmentFormGroup.value, this.direction.id);
          department.id ?
            this.store.dispatch(new UpdateDepartment(department)) :
            this.store.dispatch(new CreateDepartment(department));

            this.departmentFormGroup.markAsPristine();
            this.option = null;
       }
     });
    } else {
      this._stepper.next();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}




