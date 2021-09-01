import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, startWith, takeUntil } from 'rxjs/operators';
import { Department, Direction, IClass } from '../../models/category.model';
import { Workshop } from '../../models/workshop.model';
import { GetClasses, GetDirections, GetDepartments, FilteredDirectionsList, FilteredDepartmentsList, FilteredClassesList, ClearClasses, ClearDepartments } from '../../store/meta-data.actions';
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
  filteredDirections: Direction[];

  @Select(MetaDataState.departments)
  departments$: Observable<Department[]>;
  departments: Department[];
  @Select(MetaDataState.filteredDepartments)
  filteredDepartments$: Observable<Department[]>;
  filteredDepartments: Department[];

  @Select(MetaDataState.classes)
  classes$: Observable<IClass[]>;
  classes: IClass[];
  @Select(MetaDataState.filteredClasses)
  filteredClasses$: Observable<IClass[]>;
  filteredClasses: IClass[];


  destroy$: Subject<boolean> = new Subject<boolean>();


  @Input() workshop: Workshop;
  @Output() passCategoriesFormGroup = new EventEmitter<FormGroup>();

  CategoryFormGroup: FormGroup;
  directionsFormControl = new FormControl('');
  departmentsFormControl = new FormControl('');
  classesFormControl = new FormControl('');

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
    this.workshop ? this.activateEditMode() : this.store.dispatch([
      new GetDirections(),
      new ClearDepartments(),
      new ClearClasses()
    ]);

    this.setInitialDirestions();
    this.setInitialDepartments();
    this.setInitialClasses();
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

  private filterClasses(value: string): IClass[] {
    let filteredClasses = this.classes
      .filter((classItem: IClass) => classItem.title
        .toLowerCase()
        .startsWith(value.toLowerCase())
      )
      .map((classItem: IClass) => classItem);
    return filteredClasses;
  }

  optionDisplayClass(classItem: IClass) {
    return classItem.title;
  }

  optionDisplayDepartment(department: Department) {
    return department.title;
  }

  optionDisplayDirection(direction: Direction) {
    return direction.title;
  }

  onSelectDirection(direction: Direction): void {
    this.clearDepartments();
    this.clearClasses();

    this.CategoryFormGroup.get('directionId').setValue(direction.id);
    this.store.dispatch(new GetDepartments(direction.id));
  }

  onSelectDepartment(department: Department): void {
    this.clearClasses();

    this.CategoryFormGroup.get('departmentId').setValue(department.id);
    this.store.dispatch(new GetClasses(department.id));
  }

  onSelectClasses(classItem: IClass): void {
    this.CategoryFormGroup.get('classId').reset();
    this.CategoryFormGroup.get('classId').setValue(classItem.id);
  }

  private setInitialDirestions(): void {
    this.filteredDirections$.subscribe((filteredDirections: Direction[]) => this.filteredDirections = filteredDirections);

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
          this.filteredDirections = this.directions;
        };
      });

    this.directions$.subscribe((directions: Direction[]) => {
      this.directions = directions;
      this.filteredDirections = this.directions;
    });
  }

  private setInitialDepartments(): void {
    this.filteredDepartments$.subscribe((filteredDepartments: Department[]) => this.filteredDepartments = filteredDepartments);

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
          this.filteredDepartments = this.departments;
        };
      });

    this.departments$.subscribe((departments: Department[]) => {
      this.departments = departments;
      this.filteredDepartments = this.departments;
    });
  }

  private setInitialClasses(): void {
    this.filteredClasses$.subscribe((filteredClasses: IClass[]) => this.classes = filteredClasses);

    this.classesFormControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        startWith(''),
      ).subscribe(value => {
        if (value.length) {
          this.store.dispatch(new FilteredClassesList(this.filterClasses(value.trim())));
        } else {
          this.filteredClasses = this.classes;
        };
      });

    this.classes$.subscribe((classes: IClass[]) => {
      this.classes = classes;
      this.filteredClasses = this.classes;
    });
  }

  private clearDepartments(): void {
    this.departmentsFormControl.reset();
    this.CategoryFormGroup.get('departmentId').reset();
    this.store.dispatch(new ClearDepartments());
  }

  private clearClasses(): void {
    this.store.dispatch(new ClearClasses());
    this.CategoryFormGroup.get('classId').reset();
    this.classesFormControl.reset();
  }

  activateEditMode(): void {
    this.store.dispatch(new GetDirections())
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        const selectedDirection = this.directions.find((direction: Direction) => this.workshop.directionId === direction.id);
        this.directionsFormControl.setValue(selectedDirection);
      });

    this.store.dispatch(new GetDepartments(this.workshop.directionId))
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        const selectedDepartment = this.departments.find((department: Department) => this.workshop.departmentId === department.id);
        this.departmentsFormControl.setValue(selectedDepartment);
      });

    this.store.dispatch(new GetClasses(this.workshop.departmentId))
      .pipe(
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        const selectedClass = this.classes.find((classItem: IClass) => this.workshop.classId === classItem.id);
        this.classesFormControl.setValue(selectedClass);
      });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
