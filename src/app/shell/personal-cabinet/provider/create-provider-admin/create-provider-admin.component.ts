import { Component, OnDestroy, OnInit } from '@angular/core';
import { CreateFormComponent } from '../../shared-cabinet/create-form/create-form.component';
import { Select, Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { Validators, ValidatorFn, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { filter, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Location } from '@angular/common';
import { ConfirmationModalWindowComponent } from '../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from '../../../../shared/constants/constants';
import { NAME_REGEX } from '../../../../shared/constants/regex-constants';
import { ValidationConstants } from '../../../../shared/constants/validation';
import { WorkshopDeclination } from '../../../../shared/enum/enumUA/declinations/declination';
import { ModalConfirmationType } from '../../../../shared/enum/modal-confirmation';
import { NavBarName } from '../../../../shared/enum/navigation-bar';
import { providerAdminRole } from '../../../../shared/enum/provider-admin';
import { Role } from '../../../../shared/enum/role';
import { ProviderAdmin } from '../../../../shared/models/providerAdmin.model';
import { WorkshopCard } from '../../../../shared/models/workshop.model';
import { NavigationBarService } from '../../../../shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath } from '../../../../shared/store/navigation.actions';
import { CreateProviderAdmin } from '../../../../shared/store/provider.actions';
import { RegistrationState } from '../../../../shared/store/registration.state';
import { GetWorkshopsByProviderId } from '../../../../shared/store/shared-user.actions';
import { SharedUserState } from '../../../../shared/store/shared-user.state';
import { Util } from '../../../../shared/utils/utils';
import { Provider } from '../../../../shared/models/provider.model';

const defaultValidators: ValidatorFn[] = [
  Validators.required,
  Validators.pattern(NAME_REGEX),
  Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
  Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
];
@Component({
  selector: 'app-create-provider-admin',
  templateUrl: './create-provider-admin.component.html',
  styleUrls: ['./create-provider-admin.component.scss']
})
export class CreateProviderAdminComponent extends CreateFormComponent implements OnInit, OnDestroy {
  readonly validationConstants = ValidationConstants;
  readonly phonePrefix = Constants.PHONE_PREFIX;
  readonly mailFormPlaceholder = Constants.MAIL_FORMAT_PLACEHOLDER;
  readonly WorkshopDeclination = WorkshopDeclination;
  readonly providerAdminRole = providerAdminRole;

  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;
  @Select(SharedUserState.workshops)
  workshops$: Observable<WorkshopCard[]>;

  provider: Provider;
  ProviderAdminFormGroup: FormGroup;
  providerRole: providerAdminRole;
  managedWorkshopIds: string[];

  constructor(store: Store,
              route: ActivatedRoute,
              navigationBarService: NavigationBarService,
              private formBuilder: FormBuilder,
              private matDialog: MatDialog,
              private location: Location
  ) {
    super(store, route, navigationBarService);

    this.ProviderAdminFormGroup = this.formBuilder.group({
      lastName: new FormControl('', defaultValidators),
      firstName: new FormControl('', defaultValidators),
      middleName: new FormControl('', defaultValidators),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.PHONE_LENGTH)
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email
      ]),
    });

    this.providerRole = providerAdminRole[this.route.snapshot.paramMap.get('param')];

    this.subscribeOnDirtyForm(this.ProviderAdminFormGroup);
  }

  ngOnInit(): void {
    this.addNavPath();
    this.provider$.pipe(
      filter((provider: Provider) => !!provider),
      takeUntil(this.destroy$)
    ).subscribe((provider: Provider) => this.provider = provider);

    if (this.providerRole === providerAdminRole.admin){
      this.store.dispatch(new GetWorkshopsByProviderId(this.provider.id));
    }
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
            path: '/personal-cabinet/provider/administration',
            isActive: false,
            disable: false,
          },
          {
            name: this.providerRole == providerAdminRole.deputy ?
              NavBarName.CreateProviderDeputy :
              NavBarName.CreateProviderAdmin,
            isActive: false,
            disable: true,
          }
        )
      )
    );
  }

  onWorkshopsSelect(workshopsId: string[]): void {
    this.managedWorkshopIds = workshopsId;
  }

  checkValidation(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      form.get(key).markAsTouched();
    });
  }

  onBack(): void {
    this.location.back();
  }

  onSubmit(): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: (this.providerRole === providerAdminRole.deputy) ? ModalConfirmationType.createProviderAdminDeputy : ModalConfirmationType.createProviderAdmin
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        const providerAdmin = new ProviderAdmin(this.ProviderAdminFormGroup.value, this.providerRole === providerAdminRole.deputy, this.provider.id, this.managedWorkshopIds);
        this.store.dispatch(new CreateProviderAdmin(providerAdmin));
      }
    });
  }

}
