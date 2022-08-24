import { PersonalInfoRole } from './../../../../../shared/enum/role';
import { Util } from 'src/app/shared/utils/utils';
import { CreateFormComponent } from 'src/app/shell/personal-cabinet/shared-cabinet/create-form/create-form.component';
import { NAME_REGEX } from 'src/app/shared/constants/regex-constants';
import { Role } from 'src/app/shared/enum/role';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { Constants } from 'src/app/shared/constants/constants';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { UpdateUser } from 'src/app/shared/store/registration.actions';

@Component({
  selector: 'app-user-config-edit',
  templateUrl: './user-config-edit.component.html',
  styleUrls: ['./user-config-edit.component.scss'],
})
export class UserConfigEditComponent extends CreateFormComponent implements OnInit, OnDestroy {
  readonly role = Role;
  readonly validationConstants = ValidationConstants;
  readonly phonePrefix = Constants.PHONE_PREFIX;

  @Select(RegistrationState.user)
  user$: Observable<User>;
  user: User;

  userEditFormGroup: FormGroup;
  userRole: Role;
  subRole: Role;

  constructor(
    private fb: FormBuilder,
    store: Store,
    navigationBarService: NavigationBarService,
    route: ActivatedRoute
  ) {
    super(store, route, navigationBarService);

    this.userEditFormGroup = this.fb.group({
      lastName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60),
      ]),
      firstName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60),
      ]),
      middleName: new FormControl('', [
        Validators.required,
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60),
      ]),
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(ValidationConstants.PHONE_LENGTH)]),
    });
    this.subscribeOnDirtyForm(this.userEditFormGroup);
  }

  ngOnInit(): void {
    this.user$.pipe(filter((user: User) => !!user)).subscribe((user: User) => {
      this.userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
      this.subRole = this.store.selectSnapshot<Role>(RegistrationState.subrole);

      this.user = user;
      if (this.userRole === Role.parent) {
        this.userEditFormGroup.addControl('dateOfBirth', new FormControl('', Validators.required));
        this.userEditFormGroup.addControl('gender', new FormControl('', Validators.required));
      }
      this.setEditMode();
    });
  }

  setEditMode(): void {
    this.userEditFormGroup.patchValue(this.user, { emitEvent: false });
    this.addNavPath();
  }

  addNavPath(): void {
    const personalCabinetTitle = Util.getPersonalCabinetTitle(this.userRole, this.subRole);
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          {
            name: personalCabinetTitle,
            path: '/personal-cabinet/config',
            isActive: false,
            disable: false,
          },
          { name: NavBarName.EditInformationAbout, isActive: false, disable: true }
        )
      )
    );
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }

  onSubmit(): void {
    const user = new User(this.userEditFormGroup.value, this.user.id);
    const personalInfoRole = Util.getPersonalInfoRole(this.userRole, this.subRole);
    this.store.dispatch(new UpdateUser(personalInfoRole, user));
  }
}
