import { CdkStepper, STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { Component, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { title } from 'process';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { TEXT_REGEX } from 'src/app/shared/constants/regex-constants';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { Direction } from 'src/app/shared/models/category.model';
import { CategoriesService } from 'src/app/shared/services/categories/categories.service';
import { CreateDirection, UpdateDirection } from 'src/app/shared/store/admin.actions';
import { AdminStateModel } from 'src/app/shared/store/admin.state';

@Component({
  selector: 'app-add-direction-form',
  templateUrl: './add-direction-form.component.html',
  styleUrls: ['./add-direction-form.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS,
    useValue: { displayDefaultIndicatorType: false }
  }]
})
export class AddDirectionFormComponent implements OnDestroy {
  direction: Direction;
  AdminStateModel: AdminStateModel;
  directionFormGroup: FormGroup;
  destroy$: Subject<boolean> = new Subject<boolean>();
  @Input() editMode: boolean;

  constructor(
    private store: Store,
    private matDialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private categoriesService: CategoriesService,
    private _stepper: CdkStepper,
    private formBuilder: FormBuilder){
    this.directionFormGroup = this.formBuilder.group({
      title: new FormControl('', [Validators.required, Validators.pattern(TEXT_REGEX)]),
    });
  }

  ngOnInit(): void {      
    this.determineEditMode();
  }

  setEditMode(): void {
    const directionId = parseInt(this.route.snapshot.paramMap.get('param'));
    this.categoriesService.getDirectionById(directionId).pipe(
      takeUntil(this.destroy$),
    ).subscribe((direction: Direction) => this.direction = direction);
    //this.directionFormGroup.patchValue(this.direction, { emitEvent: false });

  }
  determineEditMode(): void {
    this.editMode = Boolean(this.route.snapshot.paramMap.get('param'));
    if (this.editMode) {
      this.setEditMode();
    }
  }

  onSubmit(): void {
    if (this.directionFormGroup.invalid) {
     this.checkValidation(this.directionFormGroup);
    } else { 
     const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
       width: '330px',
       data: {
         type: ModalConfirmationType.createDirection,
       }
     });
     dialogRef.afterClosed().subscribe((result: boolean)  => {
       if (result) {
        if (this.editMode) {
          const direction: Direction = new Direction(this.directionFormGroup.value, this.direction.id);
          this.store.dispatch(new UpdateDirection(direction));
        } else {
       const direction = new Direction(this.directionFormGroup.value);
       this.store.dispatch(new CreateDirection(direction));
       } this._stepper.next();
      }
    });
   }
  }

  private checkValidation(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      form.get(key).markAsTouched();
    });
  }
  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }
}


