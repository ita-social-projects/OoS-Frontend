import { CreateDirection, UpdateDirection } from 'src/app/shared/store/admin.actions';
import { takeUntil, filter } from 'rxjs/operators';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Direction } from 'src/app/shared/models/category.model';
import { AdminState } from 'src/app/shared/store/admin.state';
import { AddNavPath } from 'src/app/shared/store/navigation.actions';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { CreateFormComponent } from 'src/app/shell/personal-cabinet/shared-cabinet/create-form/create-form.component';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'src/app/shared/constants/constants';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { Location } from '@angular/common';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';

@Component({
  selector: 'app-create-direction',
  templateUrl: './create-direction.component.html',
  styleUrls: ['./create-direction.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false },
    },
  ],
})
export class CreateDirectionComponent extends CreateFormComponent implements OnInit, OnDestroy {
  @Select(AdminState.direction)
  direction$: Observable<Direction>;

  directionFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private matDialog: MatDialog,
    private location: Location,
    store: Store,
    route: ActivatedRoute,
    navigationBarService: NavigationBarService
  ) {
    super(store, route, navigationBarService);
    this.directionFormGroup = this.fb.group({
      title: new FormControl('', Validators.required),
      id: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.determineEditMode();
    this.addNavPath(); //TODO: move this to abstract create-form component
  }

  addNavPath(): void {
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          {
            name: NavBarName.Directions,
            path: '/admin-tools/platform?page=Directions',
            isActive: false,
            disable: false,
          },
          {
            name: this.editMode ? NavBarName.EditDirection : NavBarName.CreateDirection,
            isActive: false,
            disable: true,
          }
        )
      )
    );
  }

  onBack(): void {
    this.location.back();
  }

  setEditMode(): void {
    this.direction$
      .pipe(
        takeUntil(this.destroy$),
        filter((direction: Direction) => !!direction)
      )
      .subscribe((direction: Direction) => {
        this.directionFormGroup.patchValue(direction, { emitEvent: false });
      });
  }

  onSubmit(): void {
    if (this.directionFormGroup.dirty) {
      const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
        width: Constants.MODAL_SMALL,
        data: {
          type: this.editMode ? ModalConfirmationType.editDirection : ModalConfirmationType.createDirection,
        },
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          const direction: Direction = new Direction(this.directionFormGroup.value);
          this.editMode
            ? this.store.dispatch(new UpdateDirection(direction))
            : this.store.dispatch(new CreateDirection(direction));

          this.directionFormGroup.markAsPristine();
        }
      });
    }
  }
}
