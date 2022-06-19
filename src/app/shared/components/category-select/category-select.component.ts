import { Component, OnInit, Input, OnDestroy, EventEmitter } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, startWith, takeUntil } from 'rxjs/operators';
import { Department, Direction, IClass } from '../../models/category.model';
import { Workshop } from '../../models/workshop.model';
import {
  GetClasses,
  GetDirections,
  GetDepartments,
  FilteredDirectionsList,
  FilteredDepartmentsList,
  FilteredClassesList,
  ClearClasses,
  ClearDepartments
} from '../../store/meta-data.actions';
import { MetaDataState } from '../../store/meta-data.state';

@Component({
  selector: 'app-category-select',
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.scss']
})

export class CategorySelectComponent implements OnInit, OnDestroy {

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
  @Input() CategoryFormGroup: FormGroup;

  constructor(private store: Store) { }

  get directionIdControl(): AbstractControl { return this.CategoryFormGroup && this.CategoryFormGroup.get('directionId'); }
  get departmentIdControl(): AbstractControl { return this.CategoryFormGroup && this.CategoryFormGroup.get('departmentId'); }
  get classIdControl(): AbstractControl { return this.CategoryFormGroup && this.CategoryFormGroup.get('classId'); }

  ngOnInit(): void {
    this.setInitialDirestions();
  }

  /**
   * This method filters list of directions according to the input value
   * @param value string
   */
  private filterDirections(value: string): Direction[] {
    const filteredDirections = this.directions
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
    const filteredDepartments = this.departments
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
    const filteredClasses = this.classes
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
    this.clearDepartments(true);
    this.clearClasses(true);
    this.getDepartmentsByDirectionId(direction);
  }

  /**
   * This method on focus out select the first item from teh dropdown if there is a value in input
   */
  onFocusDirectionOut(direction: Direction, value: string): void {
    if(direction && !!value && (this.directionIdControl.value.title !== value)){
      this.directionIdControl.setValue(direction);
      this.getDepartmentsByDirectionId(direction);
    } else {
      (<EventEmitter<any>>this.directionIdControl.statusChanges).emit();
    }
  }

  /**
   * This method get departments by direction ID and mark department field untouched;
   */
  getDepartmentsByDirectionId(direction: Direction): void {
    this.departmentIdControl.markAsUntouched()
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
    this.clearClasses(true);
    this.getClassesByDepartmentId(department);
  }

  /**
   * This method on focus out select the first item from teh dropdown if there is a value in input
   */
  onFocusDepartmentOut(department: Department, value: string): void {
    if(department && !!value && (this.departmentIdControl.value.title !== value)){
      this.departmentIdControl.setValue(department);
      this.getClassesByDepartmentId(department);
    } else {
      (<EventEmitter<any>>this.departmentIdControl.statusChanges).emit();
    }
  }

  /**
   * This method get classes by department ID and mark class field untouched;
   */
   getClassesByDepartmentId(department: Department): void {
      this.classIdControl.markAsUntouched()
      this.store.dispatch(new GetClasses(department.id));
    }

  /**
   * This method sets full list of departments.
   */
  getFullDepartmentList(): void {
    this.filteredDepartments = this.departments;
  }

  /**
   * This method on focus out select the first item from teh dropdown if there is a value in input
   */
  onFocusClassOut(iClass: IClass, value: string): void {
    if(iClass && !!value && (this.classIdControl.value.title !== value)){
      this.classIdControl.setValue(iClass);
    } else {
      (<EventEmitter<any>>this.classIdControl.statusChanges).emit();
    }
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
    this.directionIdControl.valueChanges.pipe(
      filter(()=> !this.directionIdControl.touched),
      takeUntil(this.destroy$)
    ).subscribe(()=> this.directionIdControl.markAsTouched());

    this.filteredDirections$.subscribe((filteredDirections: Direction[]) => this.filteredDirections = filteredDirections);
    this.directions$.subscribe((directions: Direction[]) => this.directions = directions);

    this.directionIdControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        startWith(''),
      ).subscribe((value) => {
        if (value) {
          const input = (value?.title) ? value.title : value;
          this.store.dispatch(new FilteredDirectionsList(this.filterDirections(input)));
        } else {
          this.getFullDirectionList();
          this.clearDepartments(true);
          this.clearClasses(true);
        }
      });

    this.setInitialDepartments();
  }

  /**
   * This method gets the initial list of departments and set subscription.
   */
  private setInitialDepartments(): void {
    this.departmentIdControl.valueChanges.pipe(
      filter(()=> !this.departmentIdControl.touched),
      takeUntil(this.destroy$)
    ).subscribe(()=> this.departmentIdControl.markAsTouched());

    this.filteredDepartments$.subscribe((filteredDepartments: Department[]) => this.filteredDepartments = filteredDepartments);
    this.departments$.subscribe((departments: Department[]) => this.departments = departments);

    this.departmentIdControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        startWith(''),
      ).subscribe((value) => {
        if (value) {
          const input = (value?.title) ? value.title : value;
          this.store.dispatch(new FilteredDepartmentsList(this.filterDepartments(input)));
        } else {
          this.getFullDepartmentList();
          this.clearClasses(true);
        }
      });
    this.setInitialClasses();

  }

  /**
   * This method gets the initial list of classes and set subscription.
   */
  private setInitialClasses(): void {
    this.classIdControl.valueChanges.pipe(
      debounceTime(2000),
      filter(()=> !this.classIdControl.touched),
      takeUntil(this.destroy$)
    ).subscribe(()=> this.classIdControl.markAsTouched());

    this.filteredClasses$.subscribe((filteredClasses: IClass[]) => this.filteredClasses = filteredClasses);
    this.classes$.subscribe((classes: IClass[]) => this.classes = classes);

    this.classIdControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        startWith(''),
      ).subscribe((value) => {
        if (value) {
          const input = (value?.title) ? value.title : value;
          this.store.dispatch(new FilteredClassesList(this.filterClasses(input)));
        } else {
          this.getFullClassList();
        }
      });

    this.workshop ? this.activateEditMode() : this.store.dispatch([
      new GetDirections(),
      new ClearDepartments(),
      new ClearClasses()
    ]);
  }

  /**
   * This method clears list of departments and reset selected value in teh form and input.
   */
  private clearDepartments(clearState: boolean = false): void {
    clearState && this.store.dispatch(new ClearDepartments());
    this.departmentIdControl.setValue(null, { emitEvent: false });
  }

  /**
   * This method clears list of classes and reset selected value in teh form and input.
   */
  private clearClasses(clearState: boolean = false): void {
    clearState && this.store.dispatch(new ClearClasses());
    this.classIdControl.setValue(null, { emitEvent: false });
  }

  /**
   * This method patches values to the form from the workshop.
   */
  activateEditMode(): void {
    this.store.dispatch(new GetDirections())
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const selectedDirection = this.directions.find((direction: Direction) => this.workshop.directionId === direction.id);
        this.directionIdControl.setValue(selectedDirection, { emitEvent: false });
      });

    this.store.dispatch(new GetDepartments(this.workshop.directionId))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const selectedDepartment = this.departments.find((department: Department) => this.workshop.departmentId === department.id);
        this.departmentIdControl.setValue(selectedDepartment, { emitEvent: false });
      });

    this.store.dispatch(new GetClasses(this.workshop.departmentId))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const selectedClass = this.classes.find((classItem: IClass) => this.workshop.classId === classItem.id);
        this.classIdControl.setValue(selectedClass, { emitEvent: false });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
