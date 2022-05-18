import { UpdateClass } from 'src/app/shared/store/admin.actions';
import { takeUntil, filter } from 'rxjs/operators';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
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

  destroy$: Subject<boolean> = new Subject<boolean>();
  editMode: boolean;

  constructor(
    private store: Store,
    private route: ActivatedRoute) {    

    this.direction$.pipe(
      takeUntil(this.destroy$),
      filter((direction: Direction)=> !!direction)
    ).subscribe((direction: Direction)=> this.direction = direction);
    this.department$.pipe(
      takeUntil(this.destroy$),
      filter((department: Department)=> !!department)
    ).subscribe((department: Department)=> this.department = department);
  }

  ngOnInit(): void {
    this.determineEditMode();
  }
  
  private determineEditMode(): void {
    this.editMode = Boolean(this.route.snapshot.paramMap.get('param'));
    if (this.editMode) {
      const directionId = parseInt(this.route.snapshot.paramMap.get('param'));
      this.store.dispatch( new GetDirectionById(directionId));
    }
  }

  ngOnDestroy(): void {
    this.store.dispatch(new OnClearCategories())
    this.store.dispatch(new DeleteNavPath());
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
