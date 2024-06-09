import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';

import { SnackbarText } from 'shared/enum/enumUA/message-bar';
import { Role, Subrole } from 'shared/enum/role';
import { CreateParent } from 'shared/store/parent.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { Util } from 'shared/utils/utils';
import { Parent, ParentPayload } from 'shared/models/parent.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { ValidationConstants } from 'shared/constants/validation';
import { User } from 'shared/models/user.model';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'shared/constants/constants';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { ClearMessageBar, MarkFormDirty, ShowMessageBar } from 'shared/store/app.actions';
import { CreateFormComponent } from '../../shared-cabinet/create-form/create-form.component';

@Component({
  selector: 'app-create-parent',
  templateUrl: './create-parent.component.html',
  styleUrls: ['./create-parent.component.scss']
})
export class CreateParentComponent extends CreateFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @Select(RegistrationState.user)
  private user$: Observable<User>;

  protected user: User;
  protected parent: Parent;
  protected isAgreed: boolean;
  protected isNotRobot: boolean;
  protected userCreateFormGroup: FormGroup;
  protected role: Role;
  protected subrole: Subrole;
  protected maxDate: Date = Util.getMaxBirthDate(ValidationConstants.AGE_MAX);
  protected minDate: Date = Util.getMinBirthDate(ValidationConstants.BIRTH_AGE_MAX);
  protected RobotFormControl = new FormControl(false);
  protected AgreementFormControl = new FormControl(false);
  protected readonly validationConstants = ValidationConstants;
  protected readonly Role = Role;

  constructor(
    protected store: Store,
    protected route: ActivatedRoute,
    protected navigationBarService: NavigationBarService,
    private fb: FormBuilder,
    private router: Router,
    private matDialog: MatDialog
  ) {
    super(store, route, navigationBarService);

    this.userCreateFormGroup = this.fb.group({
      dateOfBirth: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      phoneNumber: new FormControl('', Validators.required)
    });
  }

  public ngOnInit(): void {
    this.user$.pipe(filter((user: User) => !!user)).subscribe(() => {
      this.role = this.store.selectSnapshot<Role>(RegistrationState.role);
      this.subrole = this.store.selectSnapshot<Subrole>(RegistrationState.subrole);
      this.subscribeOnDirtyForm(this.userCreateFormGroup);
      this.setEditMode();
    });
    this.RobotFormControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val: boolean) => (this.isNotRobot = val));
    this.AgreementFormControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val: boolean) => (this.isAgreed = val));
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    const isRegistered = this.store.selectSnapshot(RegistrationState.isRegistered);
    if (!isRegistered) {
      this.store.dispatch(
        new ShowMessageBar({
          message: SnackbarText.completeUserRegistration,
          type: 'warningYellow',
          verticalPosition: 'bottom',
          infinityDuration: true,
          unclosable: true
        })
      );
    }
  }

  public ngAfterViewInit(): void {
    this.store.dispatch(new ClearMessageBar());
  }

  public onCancel(): void {
    const isRegistered = this.store.selectSnapshot(RegistrationState.isRegistered);

    if (!isRegistered) {
      this.matDialog
        .open(ConfirmationModalWindowComponent, {
          width: Constants.MODAL_SMALL,
          data: {
            type: ModalConfirmationType.leaveRegistration,
            property: ''
          }
        })
        .afterClosed()
        .pipe(
          filter(Boolean),
          switchMap(() => this.store.dispatch(new MarkFormDirty(false)))
        )
        .subscribe(() => this.router.navigate(['']));
    } else {
      this.router.navigate(['/personal-cabinet/parent/config']);
    }
  }

  public onSubmit(): void {
    const parentPayload: ParentPayload = {
      dateOfBirth: this.userCreateFormGroup.controls.dateOfBirth.value,
      gender: this.userCreateFormGroup.controls.gender.value,
      phoneNumber: this.userCreateFormGroup.controls.phoneNumber.value
    };
    this.store.dispatch(new CreateParent(parentPayload));
  }

  public setEditMode(): void {}

  public addNavPath(): void {}
}
