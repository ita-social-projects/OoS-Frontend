import { Component, OnDestroy, OnInit } from '@angular/core';
import { Role, Subrole } from 'shared/enum/role';
import { RegistrationState } from 'shared/store/registration.state';
import { Util } from 'shared/utils/utils';
import { AddNavPath, DeleteNavPath } from 'shared/store/navigation.actions';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { Parent } from 'shared/models/parent.model';
import { filter, switchMap, takeUntil } from 'rxjs/operators';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { ValidationConstants } from 'shared/constants/validation';
import { User } from 'shared/models/user.model';
import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'shared/constants/constants';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { MarkFormDirty } from 'shared/store/app.actions';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { CreateFormComponent } from '../../shared-cabinet/create-form/create-form.component';

@Component({
  selector: 'app-create-parent',
  templateUrl: './create-parent.component.html',
  styleUrls: ['./create-parent.component.scss']
})
export class CreateParentComponent extends CreateFormComponent implements OnInit, OnDestroy {
  @Select(RegistrationState.parent)
  private parent$: Observable<Parent>;

  @Select(RegistrationState.user)
  private user$: Observable<User>;

  public user: User;
  public parent: Parent;
  public isAgreed: boolean;
  public isNotRobot: boolean;
  protected readonly validationConstants = ValidationConstants;
  public userCreateFormGroup: FormGroup;
  protected readonly Role = Role;
  public role: Role;
  public subrole: Subrole;
  public maxDate: Date = Util.getMaxBirthDate(ValidationConstants.AGE_MAX);
  public minDate: Date = Util.getMinBirthDate(ValidationConstants.BIRTH_AGE_MAX);

  public RobotFormControl = new FormControl(false);
  public AgreementFormControl = new FormControl(false);

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

  ngOnInit() {
    this.user$.pipe(filter((user: User) => !!user)).subscribe((user: User) => {
      this.role = this.store.selectSnapshot<Role>(RegistrationState.role);
      this.subrole = this.store.selectSnapshot<Subrole>(RegistrationState.subrole);
      this.subscribeOnDirtyForm(this.userCreateFormGroup);
      this.setEditMode();
    });
    this.RobotFormControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val: boolean) => (this.isNotRobot = val));
    this.AgreementFormControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val: boolean) => (this.isAgreed = val));
  }

  public addNavPath(): void {
    const personalCabinetTitle = Util.getPersonalCabinetTitle(this.role, this.subrole);
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          {
            name: personalCabinetTitle,
            path: '/personal-cabinet/config',
            isActive: false,
            disable: false
          },
          { name: NavBarName.CreateNewUser, isActive: false, disable: true }
        )
      )
    );
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

  onSubmit(): void {}

  setEditMode(): void {}

  onDeleteForm($event: any) {}
  ngOnDestroy() {
    super.ngOnDestroy();
    this.store.dispatch(new DeleteNavPath());
  }
}
