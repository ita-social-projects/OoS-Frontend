import { Role } from './../../../../../shared/enum/role';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Constants } from '../../../../../shared/constants/constants';
import { NAME_REGEX } from '../../../../../shared/constants/regex-constants';
import { ValidationConstants } from '../../../../../shared/constants/validation';
import { NavBarName } from '../../../../../shared/enum/navigation-bar';
import { User } from '../../../../../shared/models/user.model';
import { NavigationBarService } from '../../../../../shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath, DeleteNavPath } from '../../../../../shared/store/navigation.actions';
import { UpdateUser } from '../../../../../shared/store/registration.actions';
import { RegistrationState } from '../../../../../shared/store/registration.state';
import { CreateFormComponent } from '../../create-form/create-form.component';
import { Util } from '../../../../../shared/utils/utils';
import { Location } from '@angular/common';

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
    protected route: ActivatedRoute,
    protected store: Store,
    protected navigationBarService: NavigationBarService,
    private fb: FormBuilder,
    private location: Location
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
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60),
      ]),
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(ValidationConstants.PHONE_LENGTH)]),
    });
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

      this.subscribeOnDirtyForm(this.userEditFormGroup);
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
    this.store.dispatch(new UpdateUser(user));
  }

  onCancel(): void {
    this.location.back();
  }
}
