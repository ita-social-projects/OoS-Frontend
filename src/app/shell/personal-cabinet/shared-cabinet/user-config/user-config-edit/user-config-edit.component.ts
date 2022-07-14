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
import { UpdateUser } from 'src/app/shared/store/user.actions';
import { Constants } from 'src/app/shared/constants/constants';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { ActivatedRoute } from '@angular/router';
import { filter } from 'rxjs/operators';

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
    this.user$.pipe(filter((user: User) => !!user)).subscribe((user: User) => (this.user = user));
    this.setEditMode();
  }

  setEditMode(): void {
    this.userEditFormGroup.patchValue(this.user, { emitEvent: false });
    this.addNavPath();
  }

  addNavPath(): void {
    const userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
    const subRole  = this.store.selectSnapshot<Role>(RegistrationState.subrole);
    const personalCabinetTitle = Util.getPersonalCabinetTitle(userRole, subRole);

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
}
