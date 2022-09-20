import { Component, OnDestroy, OnInit } from '@angular/core';
import { CreateFormComponent } from '../../shared-cabinet/create-form/create-form.component';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { Provider } from 'src/app/shared/models/provider.model';
import { Select, Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators, ValidatorFn } from '@angular/forms';
import { Constants } from 'src/app/shared/constants/constants';
import { GetWorkshopsByProviderId } from 'src/app/shared/store/shared-user.actions';
import { ProviderAdmin } from 'src/app/shared/models/providerAdmin.model';
import { filter, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { SharedUserState } from 'src/app/shared/store/shared-user.state';
import { WorkshopCard } from 'src/app/shared/models/workshop.model';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { providerAdminRole } from 'src/app/shared/enum/provider-admin';
import { NAME_REGEX } from 'src/app/shared/constants/regex-constants';
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { WorkshopDeclination } from 'src/app/shared/enum/enumUA/declinations/declination';
import { Location } from '@angular/common';
import { AddNavPath } from 'src/app/shared/store/navigation.actions';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { Util } from 'src/app/shared/utils/utils';
import { Role } from 'src/app/shared/enum/role';
import { CreateProviderAdmin } from 'src/app/shared/store/provider.actions';

const defaultValidators: ValidatorFn[] = [
  Validators.required, 
  Validators.pattern(NAME_REGEX),
  Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
  Validators.maxLength(ValidationConstants.INPUT_LENGTH_60)
]
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
  ProviderAdminFormGroup: UntypedFormGroup;
  providerRole: providerAdminRole;
  managedWorkshopIds: string[];

  constructor(store: Store,
    route: ActivatedRoute,
    navigationBarService: NavigationBarService,
    private formBuilder: UntypedFormBuilder,
    private matDialog: MatDialog,
    private location: Location
  ) {
    super(store, route, navigationBarService);

    this.ProviderAdminFormGroup = this.formBuilder.group({
      lastName: new UntypedFormControl('', defaultValidators),
      firstName: new UntypedFormControl('', defaultValidators),
      middleName: new UntypedFormControl('', defaultValidators),
      phoneNumber: new UntypedFormControl('', [
        Validators.required, 
        Validators.minLength(ValidationConstants.PHONE_LENGTH)
      ]),
      email: new UntypedFormControl('', [
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

    if(this.providerRole === providerAdminRole.admin){
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

  checkValidation(form: UntypedFormGroup): void {
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
        let providerAdmin = new ProviderAdmin(this.ProviderAdminFormGroup.value, this.providerRole === providerAdminRole.deputy, this.provider.id, this.managedWorkshopIds)
        this.store.dispatch(new CreateProviderAdmin(providerAdmin));
      }
    });   
  }

}
