import {  OnClearDepartment, OnUpdateClassSuccess } from '../../../../../../shared/store/admin.actions';
import { CreateFormComponent } from 'src/app/shell/personal-cabinet/create-form/create-form.component';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Actions, ofAction, Select, Store } from '@ngxs/store';
import { Observable, } from 'rxjs';
import { Department, IClass } from 'src/app/shared/models/category.model';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { CdkStepper } from '@angular/cdk/stepper';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { CreateClass, UpdateClass } from 'src/app/shared/store/admin.actions';
import { takeUntil } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-add-class-form',
  templateUrl: './add-class-form.component.html',
  styleUrls: ['./add-class-form.component.scss']
})
export class AddClassFormComponent extends CreateFormComponent implements OnInit, OnDestroy {
  @Input() department: Department;

  @Output() passClassFormGroup = new EventEmitter();

  @Select(MetaDataState.classes)
  classes$: Observable<IClass[]>;

  classFormArray: FormArray = new FormArray([]);;
  selectedClassFormgroup: FormGroup = this.newForm();
  classSelectControl: FormControl = new FormControl();

  selectedClass: IClass;
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
  }

  ngOnInit(): void {
    this.determineEditMode();
    this.onAddForm();
  }

  setEditMode(): void {
    this.actions$.pipe(ofAction(OnUpdateClassSuccess))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.selectedClass = null;
        this.selectedClassFormgroup.reset();
      });
  }

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
    this.classFormArray.removeAt(index);
  }

  onAddForm(): void {
    this.classFormArray.push(this.newForm());
  }

  onOptionChange(option: number): void {
    this.option = option;
    this.selectedClass = null;
    this.selectedClassFormgroup.reset();
    this.classFormArray.reset();
  }

  onClassSelect(): void{
    this.selectedClassFormgroup.patchValue(this.classSelectControl.value);
  }

  onStepBack(): void {
    this._stepper.previous();
    this.store.dispatch(new OnClearDepartment());
  }

  onSubmit(): void {
    if(this.classFormArray.dirty || this.selectedClassFormgroup.dirty){
      const isEditMode = !!this.selectedClassFormgroup.value.id;

      const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
        width: Constants.MODAL_SMALL,
        data: {
          type: isEditMode ? ModalConfirmationType.editClass : ModalConfirmationType.createClass,
        }
      });
      dialogRef.afterClosed().subscribe((result: boolean)  => {
        if(result){
          isEditMode ? this.updateClass() : this.createClasses();
        }
      });
    }
  }

  private createClasses(): void {
    const classes: IClass[] = [];
    this.classFormArray.controls.forEach((form: FormGroup) => classes.push(new IClass(form.value, this.department.id)));

    this.store.dispatch(new CreateClass(classes));
  }

  private updateClass(): void {
    const iClass: IClass = new IClass(this.selectedClassFormgroup.value, this.department.id);

    this.store.dispatch(new UpdateClass(iClass));
  }
}
