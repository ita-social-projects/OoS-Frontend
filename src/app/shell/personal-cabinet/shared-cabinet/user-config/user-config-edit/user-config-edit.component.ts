import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'shared/constants/constants';
import { NAME_REGEX } from 'shared/constants/regex-constants';
import { ValidationConstants } from 'shared/constants/validation';
import { NavBarName, PersonalCabinetTitle } from 'shared/enum/enumUA/navigation-bar';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { Role } from 'shared/enum/role';
import { User } from 'shared/models/user.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath, DeleteNavPath } from 'shared/store/navigation.actions';
import { UpdateUser } from 'shared/store/registration.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { Util } from 'shared/utils/utils';
import { CreateFormComponent } from '../../create-form/create-form.component';

const defaultValidators = [
  Validators.required,
  Validators.pattern(NAME_REGEX),
  Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
  Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
];

@Component({
  selector: 'app-user-config-edit',
  templateUrl: './user-config-edit.component.html',
  styleUrls: ['./user-config-edit.component.scss']
})
export class UserConfigEditComponent extends CreateFormComponent implements OnInit, OnDestroy {
  @Select(RegistrationState.user)
  private user$: Observable<User>;

  public readonly Role = Role;
  public readonly validationConstants = ValidationConstants;

  public isDispatching = false;
  public user: User;
  public userEditFormGroup: FormGroup;
  public role: Role;
  public maxDate: Date = Util.getMaxBirthDate(ValidationConstants.AGE_MAX);
  public minDate: Date = Util.getMinBirthDate(ValidationConstants.BIRTH_AGE_MAX);

  constructor(
    protected route: ActivatedRoute,
    protected store: Store,
    protected navigationBarService: NavigationBarService,
    private fb: FormBuilder,
    private router: Router,
    private matDialog: MatDialog
  ) {
    super(store, route, navigationBarService);

    this.userEditFormGroup = this.fb.group({
      lastName: new FormControl('', defaultValidators),
      firstName: new FormControl('', defaultValidators),
      middleName: new FormControl('', defaultValidators.slice(1)),
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(ValidationConstants.PHONE_LENGTH)])
    });
  }

  public ngOnInit(): void {
    this.user$.pipe(filter((user: User) => !!user)).subscribe((user: User) => {
      this.role = this.store.selectSnapshot<Role>(RegistrationState.role);

      this.user = user;
      if (this.role === Role.parent) {
        this.userEditFormGroup.addControl('dateOfBirth', new FormControl('', Validators.required));
        this.userEditFormGroup.addControl('gender', new FormControl('', Validators.required));
      }

      this.subscribeOnDirtyForm(this.userEditFormGroup);
      this.setEditMode();
    });
  }

  public setEditMode(): void {
    this.userEditFormGroup.patchValue(this.user, { emitEvent: false });
    this.addNavPath();
  }

  public addNavPath(): void {
    const personalCabinetTitle = PersonalCabinetTitle[this.role];
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          {
            name: personalCabinetTitle,
            path: '/personal-cabinet/config',
            isActive: false,
            disable: false
          },
          { name: NavBarName.EditInformationAbout, isActive: false, disable: true }
        )
      )
    );
  }

  public ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }

  public onSubmit(): void {
    if (this.userEditFormGroup.dirty && !this.isDispatching) {
      this.matDialog
        .open(ConfirmationModalWindowComponent, {
          width: Constants.MODAL_SMALL,
          data: {
            type: ModalConfirmationType.editPersonalInformation
          }
        })
        .afterClosed()
        .pipe(filter(Boolean))
        .subscribe(() => {
          this.isDispatching = true;

          this.updateUserInfoInStore();

          this.userEditFormGroup.markAsPristine();
        });
    }
  }

  public onCancel(): void {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  private updateUserInfoInStore(): Observable<void> {
    const user = new User(this.userEditFormGroup.value, this.user.id);
    return this.store.dispatch(new UpdateUser(user));
  }
}
