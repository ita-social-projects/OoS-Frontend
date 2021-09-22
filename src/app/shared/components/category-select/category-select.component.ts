import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { isObject } from '@ngxs/store/src/internal/internals';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, takeUntil, takeWhile } from 'rxjs/operators';
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
    this.setInitialDirestions();
  }

  /**
  * This method filters list of directions according to the input value
  * @param value string
  */
  private filterDirections(value: string): Direction[] {
    let filteredDirections = this.directions
      .filter((direction: Direction) => direction.title
        .toLowerCase()
        .startsWith(value.trim().toLowerCase())
      )
      .map((direction: Direction) => direction);
    return filteredDirections;
  }

  /**
  * This method filters list of departments according to the input value
  * @param value string
  */
  private filterDepartments(value: string): Department[] {
    let filteredDepartments = this.departments
      .filter((department: Department) => department.title
        .toLowerCase()
        .startsWith(value.trim().toLowerCase())
      )
      .map((department: Department) => department);
    return filteredDepartments;
  }

  /**
  * This method filters list of classes according to the input value
  * @param value string
  */
  private filterClasses(value: string): IClass[] {
    let filteredClasses = this.classes
      .filter((classItem: IClass) => classItem.title
        .toLowerCase()
        .startsWith(value.trim().toLowerCase())
      )
      .map((classItem: IClass) => classItem);
    return filteredClasses;
  }

  /**
  * This method returns class title
  * @param classItem IClass
  * @return string
  */
  optionDisplayClass(classItem: IClass): string {
    return classItem && classItem.title;
  }

  /**
  * This method returns department title
  * @param department Department
  * @return string
  */
  optionDisplayDepartment(department: Department): string {
    return department && department.title;
  }

  /**
  * This method returns class title
  * @param direction Direction
  * @return string
  */
  optionDisplayDirection(direction: Direction): string {
    return direction && direction.title;
  }

  /**
  * This method clears previous selected departments, classes, set the selected direction to the form and gets list of departments.
  * @param direction Direction
  */
  onSelectDirection(direction: Direction): void {
    this.clearDepartments();
    this.clearClasses();

    this.CategoryFormGroup.get('directionId').setValue(direction.id);
    this.store.dispatch(new GetDepartments(direction.id));
  }

  /**
  * This method sets full list of directions.
  */
  getFullDirectionList(): void {
    this.filteredDirections = this.directions;
  }

  /**
  * This method clears previous selected classes, set the selected department to the form and gets list of classes.
  * @param department: Department
  */
  onSelectDepartment(department: Department): void {
    this.clearClasses();

    this.CategoryFormGroup.get('departmentId').setValue(department.id);
    this.store.dispatch(new GetClasses(department.id));
  }

  /**
  * This method sets full list of departments.
  */
  getFullDepartmentList(): void {
    this.filteredDepartments = this.departments;
  }

  /**
  * This method sets the selected class to the form.
  * @param classItem: IClass
  */
  onSelectClasses(classItem: IClass): void {
    this.CategoryFormGroup.get('classId').reset();
    this.CategoryFormGroup.get('classId').setValue(classItem.id);
  }

  /**
  * This method set full list of classes.
  */
  getFullClassList(): void {
    this.filteredClasses = this.classes;
  }

  /**
  * This method gets the initial of directions and set subscription.
  */
  private setInitialDirestions(): void {
    this.filteredDirections$.subscribe((filteredDirections: Direction[]) => this.filteredDirections = filteredDirections);
    this.directions$.subscribe((directions: Direction[]) => this.directions = directions);

    this.directionsFormControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        startWith(''),
      ).subscribe((value) => {

        if (value) {
          let input = (value?.title) ? value.title : value;
          this.store.dispatch(new FilteredDirectionsList(this.filterDirections(input)));
        } else {
          this.getFullDirectionList();
          this.clearDepartments();
          this.clearClasses();

        }
      });

    this.setInitialDepartments();
  }

  /**
  * This method gets the initial list of departments and set subscription.
  */
  private setInitialDepartments(): void {
    this.filteredDepartments$.subscribe((filteredDepartments: Department[]) => this.filteredDepartments = filteredDepartments);
    this.departments$.subscribe((departments: Department[]) => this.departments = departments);

    this.departmentsFormControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        startWith(''),
      ).subscribe((value) => {
        if (value) {
          let input = (value?.title) ? value.title : value;
          this.store.dispatch(new FilteredDepartmentsList(this.filterDepartments(input)));
        } else {
          this.getFullDepartmentList();
          this.clearClasses();
        };
      });
    this.setInitialClasses();

  }

  /**
  * This method gets the initial list of classes and set subscription.
  */
  private setInitialClasses(): void {
    this.filteredClasses$.subscribe((filteredClasses: IClass[]) => this.filteredClasses = filteredClasses);
    this.classes$.subscribe((classes: IClass[]) => this.classes = classes);

    this.classesFormControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        startWith(''),
      ).subscribe((value) => {
        if (value) {
          let input = (value?.title) ? value.title : value;
          this.store.dispatch(new FilteredClassesList(this.filterClasses(input)));
        } else {
          this.getFullClassList();
        };
      });

    this.passCategoriesFormGroup.emit(this.CategoryFormGroup);

    this.workshop ? this.activateEditMode() : this.store.dispatch([
      new GetDirections(),
      new ClearDepartments(),
      new ClearClasses()
    ]);
  }

  /**
  * This method clears list of departments and reset selected value in teh form and input.
  */
  private clearDepartments(): void {
    this.store.dispatch(new ClearDepartments());
    this.CategoryFormGroup.get('departmentId').reset();
    this.departmentsFormControl.reset();
  }

  /**
  * This method clears list of classes and reset selected value in teh form and input.
  */
  private clearClasses(): void {
    this.store.dispatch(new ClearClasses());
    this.CategoryFormGroup.get('classId').reset();
    this.classesFormControl.reset();
  }

  /**
  * This method patches values to the form from the workshop.
  */
  activateEditMode(): void {

    this.store.dispatch(new GetDirections())
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const selectedDirection = this.directions.find((direction: Direction) => this.workshop.directionId === direction.id);
        this.directionsFormControl.setValue(selectedDirection);
      });

    this.store.dispatch(new GetDepartments(this.workshop.directionId))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const selectedDepartment = this.departments.find((department: Department) => this.workshop.departmentId === department.id);
        this.departmentsFormControl.setValue(selectedDepartment);
      });

    this.store.dispatch(new GetClasses(this.workshop.departmentId))
      .pipe(takeUntil(this.destroy$))
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
