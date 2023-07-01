import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'shared/constants/constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Direction } from 'shared/models/category.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AdminState } from 'shared/store/admin.state';
import { AddNavPath } from 'shared/store/navigation.actions';
import { CreateFormComponent } from '../../../../../personal-cabinet/shared-cabinet/create-form/create-form.component';
import { CreateDirection, GetDirectionById, UpdateDirection } from 'shared/store/admin.actions';

@Component({
  selector: 'app-create-direction',
  templateUrl: './create-direction.component.html',
  styleUrls: ['./create-direction.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ]
})
export class CreateDirectionComponent extends CreateFormComponent implements OnInit, OnDestroy {
  @Select(AdminState.direction)
  direction$: Observable<Direction>;
  @Select(AdminState.isLoading)
  isLoading$: Observable<boolean>;

  directionFormGroup: FormGroup;

  constructor(
    protected store: Store,
    protected route: ActivatedRoute,
    protected navigationBarService: NavigationBarService,
    private fb: FormBuilder,
    private matDialog: MatDialog,
    private router: Router
  ) {
    super(store, route, navigationBarService);
    this.directionFormGroup = this.fb.group({
      title: new FormControl('', Validators.required),
      id: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.determineEditMode();
    this.addNavPath(); // TODO: move this to abstract create-form component
  }

  addNavPath(): void {
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          {
            name: NavBarName.Directions,
            path: '/admin-tools/platform?page=Directions',
            isActive: false,
            disable: false
          },
          {
            name: this.editMode ? NavBarName.EditDirection : NavBarName.CreateDirection,
            isActive: false,
            disable: true
          }
        )
      )
    );
  }

  setEditMode(): void {
    const directionId = +this.route.snapshot.paramMap.get('param');
    this.store.dispatch(new GetDirectionById(directionId));

    this.direction$
      .pipe(
        takeUntil(this.destroy$),
        filter((direction: Direction) => !!direction)
      )
      .subscribe((direction: Direction) => this.directionFormGroup.patchValue(direction, { emitEvent: false }));
  }

  onSubmit(): void {
    if (this.directionFormGroup.dirty) {
      const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
        width: Constants.MODAL_SMALL,
        data: {
          type: this.editMode ? ModalConfirmationType.editDirection : ModalConfirmationType.createDirection
        }
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          const direction: Direction = new Direction(this.directionFormGroup.value);
          this.editMode ? this.store.dispatch(new UpdateDirection(direction)) : this.store.dispatch(new CreateDirection(direction));

          this.directionFormGroup.markAsPristine();
        }
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/admin-tools/data/directions']);
  }
}
