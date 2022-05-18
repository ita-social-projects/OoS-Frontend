import { UpdateClass } from './../../../../shared/store/admin.actions';
import { takeUntil } from 'rxjs/operators';
import { CdkStepper, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { TEXT_REGEX } from 'src/app/shared/constants/regex-constants';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { Department, Direction, IClass } from 'src/app/shared/models/category.model';
import { CreateClass, GetDirectionById, OnClearCategories } from 'src/app/shared/store/admin.actions';
import { AdminState } from 'src/app/shared/store/admin.state';
import { DeleteNavPath } from 'src/app/shared/store/navigation.actions';

@Component({
  selector: 'app-create-direction',
  templateUrl: './create-direction.component.html',
  styleUrls: ['./create-direction.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS,
    useValue: { displayDefaultIndicatorType: false }
  }]
})

export class CreateDirectionComponent implements OnInit, OnDestroy {
  @Select(AdminState.direction)
  direction$: Observable<Direction>;
  direction: Direction;
  @Select(AdminState.department)
  department$: Observable<Department>;
  department:Department;

  ClassFormArray = new FormArray([]);
  destroy$: Subject<boolean> = new Subject<boolean>();
  editMode: boolean;

  constructor(
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private matDialog: MatDialog) {    

    this.direction$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((direction: Direction)=>this.direction = direction);
    this.department$.pipe(
      takeUntil(this.destroy$)
    ).subscribe((department: Department)=>this.department = department);
  }

  ngOnInit(): void {
    this.determineEditMode();
  }

  private setEditMode(): void {
    const directionId = parseInt(this.route.snapshot.paramMap.get('param'));
    this.store.dispatch( new GetDirectionById(directionId));
  }
  
  private determineEditMode(): void {
    this.editMode = Boolean(this.route.snapshot.paramMap.get('param'));
    if (this.editMode) {
      this.setEditMode();
    }
  }

  onSubmit(): void {
    if(this.ClassFormArray.dirty){
      const isEditMode= this.ClassFormArray.controls[0].value.id;

      const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
        width: '330px',
        data: {
          type: isEditMode ? ModalConfirmationType.editClass : ModalConfirmationType.createClass,
        }
      });
      dialogRef.afterClosed().subscribe((result: boolean)  => {
        if (result) {
          const classes: IClass[] = this.createClasses();
          isEditMode ? 
            this.store.dispatch(new UpdateClass(classes[0])) :
            this.store.dispatch(new CreateClass(classes));
          
            this.router.navigate([`/admin-tools/platform/directions`]);
        }
      });
    }
  }

  createClasses(): IClass[] {
    const classes: IClass[] = [];
    this.ClassFormArray.controls
      .forEach((form: FormGroup) => classes.push(new IClass(form.value, this.department.id)));
    return classes;
  }

  ngOnDestroy(): void {
    this.store.dispatch(new OnClearCategories())
    this.store.dispatch(new DeleteNavPath());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
