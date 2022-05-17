import { CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnDestroy } from '@angular/core';
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
import { CreateDepartment, FilteredDepartmentsList, UpdateDepartment } from 'src/app/shared/store/admin.actions';
import { AdminState } from 'src/app/shared/store/admin.state';
import { ClearClasses, ClearDepartments, FilteredClassesList, GetClasses, GetDepartments } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';

@Component({
  selector: 'app-add-department-form',
  templateUrl: './add-department-form.component.html',
  styleUrls: ['./add-department-form.component.scss']
})
export class AddDepartmentFormComponent implements OnDestroy{

  @Input() direction: Direction;

  departmentFormGroup: FormGroup;
  directionFormGroup: FormGroup
  destroy$: Subject<boolean> = new Subject<boolean>();
  editOptionRadioBtn: FormControl = new FormControl(false);  

  
  @Input() editMode: boolean;
  @Input() department: Department;
  @Input() CategoryFormGroup: FormGroup;
  @Input() ClassFormGroup: FormGroup;
  @Input() dropdownContainerClass: string;

  @Select(AdminState.department)
  department$: Observable<Department>;

  @Select(MetaDataState.departments)
  departments$: Observable<Department[]>;
  departments: Department[];
  @Select(MetaDataState.filteredDepartments)
  filteredDepartments$: Observable<Department[]>;
  filteredDepartments: Department[];

  @Select(MetaDataState.classes)
  classes$: Observable<IClass[]>;
  classes: IClass[];

  constructor(
    private store: Store,
    private matDialog: MatDialog,
    private _stepper: CdkStepper,
    private router: Router,
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private formBuilder: FormBuilder) {
    this.departmentFormGroup = this.formBuilder.group({
     title: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
     departmentId: new FormControl(''),
     editOptionsDesc: new FormControl({ value: '', disabled: true }),
    });
  }

  get departmentIdControl(): AbstractControl { return this.departmentFormGroup && this.departmentFormGroup.get('departmentId'); }
  get classIdControl(): AbstractControl { return this.ClassFormGroup && this.ClassFormGroup.get('classId'); }


  ngOnInit(): void {   
    this.determineEditMode();

  }

  setEditMode(): void {
   const directionId = parseInt(this.route.snapshot.paramMap.get('param'));
   this.store.dispatch(new GetDepartments(directionId));
   this.setInitialDepartments();
   this.onEditOptionCtrlInit();
   console.log(this.department);
  }

  determineEditMode(): void {
    this.editMode = Boolean(this.route.snapshot.paramMap.get('param'));
    if (this.editMode) {
      this.setEditMode();
    }
  }

  private filterDepartments(value: string): Department[] {
    const getDepartments = this.departments
      .filter((department: Department) => department.title
        .toLowerCase()
        .startsWith(value.trim().toLowerCase())
      )
      .map((department: Department) => department);
    return getDepartments;
  }

  optionDisplayDepartment(department: Department): string {
    return department && department.title;
  }

  getFullDepartmentList(): void {
    this.filteredDepartments = this.departments;
  }

  private clearClasses(clearState: boolean = false): void {
    clearState && this.store.dispatch(new ClearClasses());
    this.classIdControl.reset();
  }

  onDelete(): void {
  }

  addDepartment(): void {
  }

  onIClassSelect(workshopsId: number[]): void {
  
  }

  onSelectDepartment(department: Department): void {
    //this.clearClasses();
    this.store.dispatch(new GetClasses(department.id));
  }

  onEditOptionCtrlInit(): void {
    this.editOptionRadioBtn.valueChanges
      .pipe(
        takeUntil(this.destroy$),
      ).subscribe((editOptionRadioBtn: boolean) => {
        editOptionRadioBtn ? this.departmentFormGroup.get('editOptionsDesc').enable() : this.departmentFormGroup.get('editOptionsDesc').disable();
      });
  }
  

  private setInitialDepartments(): void {
    this.filteredDepartments$.subscribe((filteredDepartments: Department[]) => this.filteredDepartments = filteredDepartments);    this.departments$.subscribe((departments: Department[]) => this.departments = departments);
    this.departmentIdControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        startWith(''),
      ).subscribe((value) => {
        if (value) {
          const input = (value?.title) ? value.title : value;
          this.store.dispatch(new FilteredDepartmentsList(this.filterDepartments(input)));
        } else {
          this.getFullDepartmentList();
        }
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

        if (this.editMode) {
          const departmentt: Department = new Department(this.department.id, this.departmentFormGroup.value, this.direction.id);
          this.store.dispatch(new UpdateDepartment(departmentt));
        } else {
      const department = new Department(this.departmentFormGroup.value, this.direction.id);
       this.store.dispatch(new CreateDepartment(department));
      } this._stepper.next();
      }
    });
   }
  }

  checkValidation(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      form.get(key).markAsTouched();
    });
   }
   ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }
}
  



