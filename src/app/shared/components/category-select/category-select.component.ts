import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Class, Department, Direction } from '../../models/category.model';
import { Workshop } from '../../models/workshop.model';
import { GetClasses, GetDirections, GetDepartments } from '../../store/meta-data.actions';
import { MetaDataState } from '../../store/meta-data.state';

@Component({
  selector: 'app-category-select',
  templateUrl: './category-select.component.html',
  styleUrls: ['./category-select.component.scss']
})
export class CategorySelectComponent implements OnInit {

  @Select(MetaDataState.directions)
  directions$: Observable<Direction[]>;
  @Select(MetaDataState.departments)
  departments$: Observable<Department[]>;
  @Select(MetaDataState.classes)
  classes$: Observable<Class[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Input() workshop: Workshop;
  @Output() passCategoriesFormGroup = new EventEmitter<FormGroup>();

  CategoryFormGroup: FormGroup;

  selectedDirectionId: number;
  selectedDepartmentId: number;
  selectedClassId: number;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store) {
    this.CategoryFormGroup = this.formBuilder.group({
      directionId: new FormControl('', Validators.required),
      departmentId: new FormControl(''),
      classId: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.passCategoriesFormGroup.emit(this.CategoryFormGroup);
    this.workshop ? this.activateEditMode() : this.store.dispatch(new GetDirections());
  }

  onSelectDirection(id: number): void {
    this.CategoryFormGroup.get('departmentId').reset();
    this.CategoryFormGroup.get('classId').reset();
    this.store.dispatch(new GetDepartments(id));
  }

  onSelectDepartment(id: number): void {
    this.CategoryFormGroup.get('classId').reset();
    this.store.dispatch(new GetClasses(id));
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
