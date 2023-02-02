import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { filter, takeUntil } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Location } from '@angular/common';
import { NAME_REGEX } from '../../../../../shared/constants/regex-constants';
import { ConfirmationModalWindowComponent } from '../../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from '../../../../../shared/constants/constants';
import { ValidationConstants } from '../../../../../shared/constants/validation';
import { AdminRoles } from '../../../../../shared/enum/admins';
import { ModalConfirmationType } from '../../../../../shared/enum/modal-confirmation';
import { NavBarName } from '../../../../../shared/enum/navigation-bar';
import { Role } from '../../../../../shared/enum/role';
import { Institution } from '../../../../../shared/models/institution.model';
import { MinistryAdmin } from '../../../../../shared/models/ministryAdmin.model';
import { NavigationBarService } from '../../../../../shared/services/navigation-bar/navigation-bar.service';
import { AdminState } from '../../../../../shared/store/admin.state';
import { GetAllInstitutions } from '../../../../../shared/store/meta-data.actions';
import { MetaDataState } from '../../../../../shared/store/meta-data.state';
import { AddNavPath } from '../../../../../shared/store/navigation.actions';
import { RegistrationState } from '../../../../../shared/store/registration.state';
import { CreateFormComponent } from '../../../../personal-cabinet/shared-cabinet/create-form/create-form.component';
import { Util } from '../../../../../shared/utils/utils';
import { GetMinistryAdminById, UpdateMinistryAdmin, CreateMinistryAdmin } from '../../../../../shared/store/admin.actions';
import { AdminsFormTitlesEdit, AdminsFormTitlesNew } from '../../../../../shared/enum/enumUA/admins';

const defaultValidators: ValidatorFn[] = [
  Validators.required,
  Validators.pattern(NAME_REGEX),
  Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
  Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
];
@Component({
  selector: 'app-create-admin',
  templateUrl: './create-admin.component.html',
  styleUrls: ['./create-admin.component.scss']
})
export class CreateAdminComponent extends CreateFormComponent implements OnInit, OnDestroy {
  readonly validationConstants = ValidationConstants;
  readonly phonePrefix = Constants.PHONE_PREFIX;
  readonly mailFormPlaceholder = Constants.MAIL_FORMAT_PLACEHOLDER;
  readonly adminsRole = AdminRoles;

  @Select(MetaDataState.institutions)
  institutions$: Observable<Institution[]>;
  @Select(AdminState.selectedMinistryAdmin)
  selectedMinistryAdmin$: Observable<MinistryAdmin>;

  AdminFormGroup: FormGroup;
  adminRole: AdminRoles;
  adminId: string;
  formTitle: string;

  constructor(
    protected store: Store,
    protected route: ActivatedRoute,
    protected navigationBarService: NavigationBarService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog,
    private location: Location
  ) {
    super(store, route, navigationBarService);

    this.AdminFormGroup = this.formBuilder.group({
      lastName: new FormControl('', defaultValidators),
      firstName: new FormControl('', defaultValidators),
      middleName: new FormControl('', [
        Validators.pattern(NAME_REGEX),
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
      ]),
      phoneNumber: new FormControl('', [Validators.required, Validators.minLength(ValidationConstants.PHONE_LENGTH)]),
      institution: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email])
    });

    this.adminRole = AdminRoles[this.route.snapshot.paramMap.get('param')];
    this.subscribeOnDirtyForm(this.AdminFormGroup);
  }

  ngOnInit(): void {
    this.formTitle = this.editMode
    ? AdminsFormTitlesEdit[this.adminRole]
    : AdminsFormTitlesNew[this.adminRole];

    this.store.dispatch(new GetAllInstitutions(true));
    this.determineEditMode();
  }

  determineEditMode(): void {
    this.editMode = Boolean(this.route.snapshot.paramMap.get('id'));
    this.addNavPath();

    if (this.editMode) {
      this.setEditMode();
    }
  }

  setEditMode(): void {
    this.adminId = this.route.snapshot.paramMap.get('id');

    this.store.dispatch(new GetMinistryAdminById(this.adminId));

    this.selectedMinistryAdmin$
      .pipe(
        takeUntil(this.destroy$),
        filter((ministryAdmin: MinistryAdmin) => !!ministryAdmin)
      )
      .subscribe((ministryAdmin: MinistryAdmin) => {
        this.AdminFormGroup.patchValue(ministryAdmin, { emitEvent: false });
        this.AdminFormGroup.get('institution').setValue(
          {
            id: ministryAdmin.institutionId,
            title: ministryAdmin.institutionTitle
          },
          { emitEvent: false }
        );
      });
  }

  compareInstitutions(institution1: Institution, institution2: Institution): boolean {
    return institution1.id === institution2.id;
  }

  addNavPath(): void {
    const userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
    const subRole = this.store.selectSnapshot<Role>(RegistrationState.subrole);
    const personalCabinetTitle = Util.getPersonalCabinetTitle(userRole, subRole);

    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          {
            name: personalCabinetTitle,
            path: '/admin-tools/data/admins',
            isActive: false,
            disable: false
          },
          {
            name: this.editMode ? NavBarName.UpdateAdmin : NavBarName.CreateAdmin,
            isActive: false,
            disable: true
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
        type: this.editMode ? ModalConfirmationType.updateMinistryAdmin : ModalConfirmationType.createMinistryAdmin
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const ministryAdmin = new MinistryAdmin(this.AdminFormGroup.value, this.AdminFormGroup.get('institution').value.id, this.adminId);
        this.store.dispatch(this.editMode ? new UpdateMinistryAdmin(ministryAdmin) : new CreateMinistryAdmin(ministryAdmin));
      }
    });
  }
}
