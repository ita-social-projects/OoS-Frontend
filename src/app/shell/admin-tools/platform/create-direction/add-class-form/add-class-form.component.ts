import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import {  AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators';
import { Department, Direction, IClass } from 'src/app/shared/models/category.model';
import { AdminState } from 'src/app/shared/store/admin.state';
import { FilteredClassesList, GetClasses } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';

@Component({
  selector: 'app-add-class-form',
  templateUrl: './add-class-form.component.html',
  styleUrls: ['./add-class-form.component.scss']
})
export class AddClassFormComponent implements OnInit{

  @Input() ClassFormGroup: FormGroup;
  @Input() editMode: boolean;
  @Input() indexClass: number;
  @Input() classAmount: number;
  @Input() direction: Direction;
  @Input() department: Department;
  @Input() iClass: IClass;


  @Output() deleteForm = new EventEmitter();
  editOptionRadioBtn: FormControl = new FormControl(false);


  @Select(MetaDataState.classes)
  classes$: Observable<IClass[]>;
  classes: IClass[];
  @Select(MetaDataState.filteredClasses)
  filteredClasses$: Observable<IClass[]>;
  filteredClasses: IClass[];
  destroy$: Subject<boolean> = new Subject<boolean>();
  @Select(AdminState.iClass)
  iClass$: Observable<Department>;


  constructor(
    private store: Store,
    private route: ActivatedRoute,


  ) { }

  get classIdControl(): AbstractControl { return this.ClassFormGroup && this.ClassFormGroup.get('classId'); }

  ngOnInit(): void {
    this.determineEditMode();
  }

  setEditMode(): void {
    const directionId = parseInt(this.route.snapshot.paramMap.get('param'));
    //this.store.dispatch(new GetClasses(this.department.id));
    this.setInitialClasses();
   }

   determineEditMode(): void {
     this.editMode = Boolean(this.route.snapshot.paramMap.get('param'));
     if (this.editMode) {
       this.setEditMode();
     }
   }

   onDelete(): void {
    this.deleteForm.emit(this.indexClass);
  }
  onSelectiClass(iClass: IClass): void {
    //this.clearClasses();
    //this.store.dispatch(new GetClasses(department.id));
  }

  private filterClasses(value: string): IClass[] {
    const GetClasses = this.classes
      .filter((iClass: IClass) => iClass.title
        .toLowerCase()
        .startsWith(value.trim().toLowerCase())
      )
      .map((iClass: IClass) => iClass);
    return GetClasses;
  }

  optionDisplayIClass(iClass: IClass): string {
    return iClass && iClass.title;
  }

  getFullIClassList(): void {
    this.filteredClasses = this.classes;
  }

  onSelectIClass(iClass: IClass): void {
    //this.clearClasses();
    //this.store.dispatch(new GetClasses(department.id));
  }

//  onEditOptionCtrlInit(): void {
//    this.editOptionRadioBtn.valueChanges
//      .pipe(
//        takeUntil(this.destroy$),
//      ).subscribe((editOptionRadioBtn: boolean) => {
  //      editOptionRadioBtn ? this.departmentFormGroup.get('editOptionsDesc').enable() : this.departmentFormGroup.get('editOptionsDesc').disable();
 //     });
 // }


  private setInitialClasses(): void {
    this.filteredClasses$.subscribe((filteredClasses: IClass[]) => this.filteredClasses = filteredClasses);    this.classes$.subscribe((classes: IClass[]) => this.classes = classes);
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
          this.getFullIClassList();
        }
      });
  }
  checkValidation(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      form.get(key).markAsTouched();
    });
   }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}




