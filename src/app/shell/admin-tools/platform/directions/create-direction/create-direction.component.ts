import { OnCreateDepartmentSuccess, OnCreateDirectionSuccess, OnUpdateDepartmentSuccess, OnUpdateDirectionSuccess } from 'src/app/shared/store/admin.actions';
import { takeUntil, filter } from 'rxjs/operators';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Actions, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { Department, Direction } from 'src/app/shared/models/category.model';
import { GetDirectionById, OnClearCategories } from 'src/app/shared/store/admin.actions';
import { AdminState } from 'src/app/shared/store/admin.state';
import { DeleteNavPath } from 'src/app/shared/store/navigation.actions';
import { MatStepper } from '@angular/material/stepper';

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
  @ViewChild('stepper') stepper: MatStepper;

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
    private route: ActivatedRoute,
    private actions$: Actions) {

    this.direction$.pipe(
      takeUntil(this.destroy$),
      filter((direction: Direction)=> !!direction)
    ).subscribe((direction: Direction)=> this.direction = direction);
    this.department$.pipe(
      takeUntil(this.destroy$),
    ).subscribe((department: Department)=> this.department = department);
    this.actions$.pipe(
      takeUntil(this.destroy$),
      ofActionSuccessful(
        OnUpdateDepartmentSuccess,
        OnUpdateDirectionSuccess,
        OnCreateDepartmentSuccess,
        OnCreateDirectionSuccess,
    )).subscribe(()=> this.stepper.next());
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
