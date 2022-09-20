import { Component, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Constants } from 'src/app/shared/constants/constants';
import { NAME_REGEX } from 'src/app/shared/constants/regex-constants';
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { AdminRole } from 'src/app/shared/enum/admins';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { Role } from 'src/app/shared/enum/role';
import { Institution } from 'src/app/shared/models/institution.model';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { GetAllInstitutions } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { Util } from 'src/app/shared/utils/utils';
import { Location } from '@angular/common';
import { CreateFormComponent } from 'src/app/shell/personal-cabinet/shared-cabinet/create-form/create-form.component';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { MinistryAdmin } from 'src/app/shared/models/ministryAdmin.model';
import { CreateMinistryAdmin } from 'src/app/shared/store/admin.actions';
import { CreateAdminTitle } from 'src/app/shared/enum/enumUA/tech-admin/create-admin';

const defaultValidators: ValidatorFn[] = [
  Validators.required, 
  Validators.pattern(NAME_REGEX),
  Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
  Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
]
@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.scss']
})
export class CreateAdminComponent extends CreateFormComponent implements OnInit, OnDestroy {
  readonly validationConstants = ValidationConstants;
  readonly phonePrefix = Constants.PHONE_PREFIX;
  readonly mailFormPlaceholder = Constants.MAIL_FORMAT_PLACEHOLDER;
  readonly adminsRole = AdminRole;
  readonly title = CreateAdminTitle;
  
  @Select(MetaDataState.institutions)
  institutions$: Observable<Institution[]>;
  
  AdminFormGroup: UntypedFormGroup;
  adminRole: AdminRole;

  constructor(
    store: Store,
    route: ActivatedRoute,
    navigationBarService: NavigationBarService,
    private formBuilder: UntypedFormBuilder,
    private matDialog: MatDialog,
    private location: Location
  ) { 
    super(store, route, navigationBarService);

    this.AdminFormGroup = this.formBuilder.group({
      lastName: new UntypedFormControl('', defaultValidators),
      firstName: new UntypedFormControl('', defaultValidators),
      middleName: new UntypedFormControl('', [
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      phoneNumber: new UntypedFormControl('', [
        Validators.required, 
        Validators.minLength(ValidationConstants.PHONE_LENGTH)
      ]),
      institution: new UntypedFormControl('', Validators.required),
      email: new UntypedFormControl('', [
        Validators.required, 
        Validators.email
      ])
    });

    this.adminRole = AdminRole[this.route.snapshot.paramMap.get('param')];
    this.subscribeOnDirtyForm(this.AdminFormGroup);
  }

  ngOnInit(): void {
    this.addNavPath();
    this.store.dispatch(new GetAllInstitutions());
  }

  setEditMode(): void { }
  
  addNavPath(): void { 
    const userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
    const subRole  = this.store.selectSnapshot<Role>(RegistrationState.subrole);
    const personalCabinetTitle = Util.getPersonalCabinetTitle(userRole, subRole);
    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          {
            name: personalCabinetTitle,
            path: '/admin-tools/data/admins',
            isActive: false,
            disable: false,
          },
          {
            name: NavBarName.CreateAdmin,
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

  onSubmit(): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: (this.adminRole === AdminRole.ministryAdmin) ? ModalConfirmationType.createMinistryAdmin : undefined
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        let ministryAdmin = new MinistryAdmin(
          this.AdminFormGroup.value, 
          this.AdminFormGroup.get('institution').value.id
          );
        this.store.dispatch(new CreateMinistryAdmin(ministryAdmin));
      }
    });   
  }
}
