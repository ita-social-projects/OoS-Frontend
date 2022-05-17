import { CreateFormComponent } from 'src/app/shell/personal-cabinet/create-form/create-form.component';
import { CdkStepper, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { title } from 'process';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { TEXT_REGEX } from 'src/app/shared/constants/regex-constants';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { Direction } from 'src/app/shared/models/category.model';
import { CategoriesService } from 'src/app/shared/services/categories/categories.service';
import { CreateDirection, GetDirectionById, UpdateDirection } from 'src/app/shared/store/admin.actions';
import { AdminState, AdminStateModel } from 'src/app/shared/store/admin.state';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';

@Component({
  selector: 'app-add-direction-form',
  templateUrl: './add-direction-form.component.html',
  styleUrls: ['./add-direction-form.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS,
    useValue: { displayDefaultIndicatorType: false }
  }]
})
export class AddDirectionFormComponent extends CreateFormComponent implements OnDestroy {
  @Select(AdminState.direction)
  direction$: Observable<Direction>;
  direction: Direction;

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
    this.determineEditMode();
  }

  addNavPath(): void {
    //TODO: add navigation bar
  }

  setEditMode(): void {
    const directionId = parseInt(this.route.snapshot.paramMap.get('param'));
    this.store.dispatch( new GetDirectionById(directionId));

    this.direction$.pipe(
      takeUntil(this.destroy$),
      filter((direction: Direction)=> !!direction)
    ).subscribe((direction: Direction) => {
      this.direction = direction;
      this.directionFormGroup.patchValue(this.direction, { emitEvent: false });
    });
  }
  
  determineEditMode(): void {
    this.editMode = Boolean(this.route.snapshot.paramMap.get('param'));
    if (this.editMode) {
      this.setEditMode();
    }
  }

  onSubmit(): void {
    if(this.directionFormGroup.dirty){
      const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
        width: '330px',
        data: {
          type: ModalConfirmationType.editDirection,
        }
      });
      dialogRef.afterClosed().subscribe((result: boolean)  => {
        if (result) {
          const direction: Direction = new Direction(this.directionFormGroup.value, this.direction.id);
          this.editMode ? 
            this.store.dispatch(new UpdateDirection(direction)) :
            this.store.dispatch(new CreateDirection(direction));
          
            this.directionFormGroup.markAsPristine();
            this._stepper.next(); 
       }
     });
    } else {
      this._stepper.next(); 
    }
  }
}


