import { CreateFormComponent } from 'src/app/shell/personal-cabinet/create-form/create-form.component';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { Department, IClass } from 'src/app/shared/models/category.model';
import { MatDialog } from '@angular/material/dialog';
import { CdkStepper } from '@angular/cdk/stepper';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { GetClasses } from 'src/app/shared/store/meta-data.actions';


@Component({
  selector: 'app-add-class-form',
  templateUrl: './add-class-form.component.html',
  styleUrls: ['./add-class-form.component.scss']
})
export class AddClassFormComponent extends CreateFormComponent implements OnInit, OnDestroy {
  @Input() department: Department;

  @Select(MetaDataState.classes)
  classes$: Observable<IClass[]>;

  ClassFormArray = new FormArray([]);
  selectedClassFormgroup: FormGroup = this.newForm();
  classSelectControl: FormControl = new FormControl();

  selectedClass: IClass;
  option: number;

  constructor(
    private fb: FormBuilder,
    store: Store,
    route: ActivatedRoute,
    navigationBarService: NavigationBarService) {
    super(store, route, navigationBarService);
  }

  ngOnInit(): void {
    this.determineEditMode();
    this.onAddForm();
  }

  setEditMode(): void { }

  addNavPath(): void{
    //TODO: add nav path
  }
   
  private newForm(): FormGroup {
    const classFormGroup = this.fb.group({
      id: new FormControl(''),
      departmentId: new FormControl(''),
      title: new FormControl('', Validators.required),
      description: new FormControl(''),
    });
    return classFormGroup
  }

  onDeleteForm(index: number): void {
    this.ClassFormArray.removeAt(index);
  }

  onAddForm(): void {
    this.ClassFormArray.push(this.newForm());
  }

  onOptionChange(option: number): void {
    this.option = option;
    this.selectedClassFormgroup.reset();
    this.selectedClass = null;
  }

  onClassSelect(): void{
    this.selectedClassFormgroup.patchValue(this.classSelectControl.value);
  }
}




