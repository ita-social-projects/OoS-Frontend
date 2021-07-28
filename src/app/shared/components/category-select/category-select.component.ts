import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounce, debounceTime, distinctUntilChanged, filter, map, startWith, takeUntil } from 'rxjs/operators';
import { Class, Department, Direction } from '../../models/category.model';
import { Workshop } from '../../models/workshop.model';
import { GetClasses, GetDirections, GetDepartments, ClearCategories, FilteredDirectionsList, FilteredDepartmentsList } from '../../store/meta-data.actions';
import { MetaDataState } from '../../store/meta-data.state';

@Component({
  selector: 'app-category-select',
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.scss']
})
export class CategorySelectComponent implements OnInit {

  @Select(MetaDataState.directions)
  directions$: Observable<Direction[]>;
  directions: Direction[];
  @Select(MetaDataState.filteredDirections)
  filteredDirections$: Observable<Direction[]>;
  @Select(MetaDataState.departments)
  departments$: Observable<Department[]>;
  departments : Department[];
  @Select(MetaDataState.filteredDepartments)
  filteredDepartments$: Observable<Department[]>;
  @Select(MetaDataState.classes)
  classes$: Observable<Class[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() workshop: Workshop;
  @Output() passCategoriesFormGroup = new EventEmitter<FormGroup>();

  CategoryFormGroup: FormGroup;
  directionsFormControl = new FormControl('');
  departmentsFormControl = new FormControl('');

  selectedDirectionId: number;
  selectedDepartmentId: number;
  selectedClassId: number;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store) {
    this.CategoryFormGroup = this.formBuilder.group({
      directionId: new FormControl(''),
      departmentId: new FormControl(''),
      classId: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.passCategoriesFormGroup.emit(this.CategoryFormGroup);
    this.workshop ? this.activateEditMode() : this.store.dispatch(new GetDirections());
    this.directions$.subscribe((directions: Direction[])=> this.directions = directions);
    this.directionsFormControl.valueChanges
    .pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
      startWith(''),
    ).subscribe(value => {
      if (value.length) {
        this.store.dispatch(new FilteredDirectionsList(this.filter(value.trim())));
      } else {
        this.store.dispatch(new FilteredDirectionsList([]));
      };
    });
    this.departments$.subscribe((departments: Department[])=> this.departments = departments);
    this.departmentsFormControl.valueChanges
    .pipe(
      takeUntil(this.destroy$),
      debounceTime(300),
      distinctUntilChanged(),
      startWith(''),
    ).subscribe(value => {
      if (value.length) {
        this.store.dispatch(new FilteredDepartmentsList(this.filterDepartments(value.trim())));
      } else {
        this.store.dispatch(new FilteredDepartmentsList([]));
      };
    });
  }

  private filter(value: string): Direction[] {
    let filteredDirections = this.directions
      .filter((direction: Direction) => direction.title
        .toLowerCase()
        .startsWith(value.toLowerCase())
      )
      .map((direction: Direction) => direction);
     return filteredDirections;
  }
  private filterDepartments(value: string): Department[] {
    let filteredDepartments = this.departments
      .filter((department: Department) => department.title
        .toLowerCase()
        .startsWith(value.toLowerCase())
      )
      .map((department: Department) => department);
     return filteredDepartments;
  }

  optionDisplayDepartment(department : Department){
    return department.title;
  }

  optionDisplay(direction: Direction){
    return direction.title;
  }

  onSelectDirection(direction: Direction): void {
    this.CategoryFormGroup.get('departmentId').reset();
    this.CategoryFormGroup.get('classId').reset();
    this.CategoryFormGroup.get('directionId').setValue(direction.id);
    this.store.dispatch(new GetDepartments(direction.id));
  }

  onSelectDepartment(department: Department): void {
    this.CategoryFormGroup.get('classId').reset();
    this.CategoryFormGroup.get('departmentId').setValue(department.id);
    this.store.dispatch(new GetClasses(department.id));
  }

  activateEditMode(): void {
    this.store.dispatch(new GetDirections())
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.selectedDirectionId = this.workshop.directionId);

    this.store.dispatch(new GetDepartments(this.workshop.directionId))
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.selectedDepartmentId = this.workshop.departmentId);

    this.store.dispatch(new GetClasses(this.workshop.departmentId))
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(() => this.selectedClassId = this.workshop.classId);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
