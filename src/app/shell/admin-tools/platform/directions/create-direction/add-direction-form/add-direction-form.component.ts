import { CreateFormComponent } from 'src/app/shell/personal-cabinet/create-form/create-form.component';
import { CdkStepper, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { Direction } from 'src/app/shared/models/category.model';
import { CreateDirection, UpdateDirection } from 'src/app/shared/store/admin.actions';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { Observable } from 'rxjs';
import { AdminState } from 'src/app/shared/store/admin.state';
import { filter, takeUntil } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-add-direction-form',
  templateUrl: './add-direction-form.component.html',
  styleUrls: ['./add-direction-form.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS,
    useValue: { displayDefaultIndicatorType: false }
  }]
})
export class AddDirectionFormComponent extends CreateFormComponent implements OnInit, OnDestroy {
  @Select(AdminState.direction)
  direction$: Observable<Direction>;

  directionFormGroup: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _stepper: CdkStepper,
    private matDialog: MatDialog,
    store: Store,
    route: ActivatedRoute,
    navigationBarService: NavigationBarService) {

    super(store, route, navigationBarService);
    this.directionFormGroup = this.fb.group({
      title: new FormControl('', Validators.required),
      id:  new FormControl('')
    });
  }

  ngOnInit(): void {
    this.determineEditMode(); //TODO: move this to abstract create-form component
  }

  addNavPath(): void {
    //TODO: add navigation bar
  }

  setEditMode(): void {
    this.direction$.pipe(
      takeUntil(this.destroy$),
      filter((direction: Direction)=> !!direction)
    ).subscribe((direction: Direction) => {
      this.directionFormGroup.patchValue(direction, { emitEvent: false });
    });
  }

  onSubmit(): void {
    if(this.directionFormGroup.dirty){
      const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
        width: Constants.MODAL_SMALL,
        data: {
          type: this.editMode ? ModalConfirmationType.editDirection : ModalConfirmationType.createDirection,
        }
      });
      dialogRef.afterClosed().subscribe((result: boolean)  => {
        if (result) {
          const direction: Direction = new Direction(this.directionFormGroup.value);
          this.editMode ?
            this.store.dispatch(new UpdateDirection(direction)) :
            this.store.dispatch(new CreateDirection(direction));

            this.directionFormGroup.markAsPristine();
       }
     });
    } else {
      this._stepper.next();
    }
  }
}


