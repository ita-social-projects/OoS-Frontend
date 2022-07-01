import { Component, OnDestroy, OnInit } from '@angular/core';
import { CreateFormComponent } from '../../create-form/create-form.component';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { Provider } from 'src/app/shared/models/provider.model';
import { Select, Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import { Constants } from 'src/app/shared/constants/constants';
import { CreateProviderAdmin, GetWorkshopsByProviderId } from 'src/app/shared/store/user.actions';
import { ProviderAdmin } from 'src/app/shared/models/providerAdmin.model';
import { filter, takeUntil } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserState } from 'src/app/shared/store/user.state';
import { WorkshopCard } from 'src/app/shared/models/workshop.model';
import { ConfirmationModalWindowComponent } from 'src/app/shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalConfirmationType } from 'src/app/shared/enum/modal-confirmation';
import { providerAdminRole } from 'src/app/shared/enum/provider-admin';
import { NAME_REGEX } from 'src/app/shared/constants/regex-constants';
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { WorkshopDeclination } from 'src/app/shared/enum/enumUA/declinations/declination';

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

  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;
  @Select(UserState.workshops)
  workshops$: Observable<WorkshopCard[]>;
  
  provider: Provider;
  ProviderAdminFormGroup: FormGroup;
  isDeputy = false;
  managedWorkshopIds: string[];

  constructor(store: Store,
    route: ActivatedRoute,
    navigationBarService: NavigationBarService,
    private formBuilder: FormBuilder,
    private matDialog: MatDialog) {
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

    this.isDeputy = (this.route.snapshot.paramMap.get('param') === providerAdminRole.deputy);

    this.subscribeOnDirtyForm(this.ProviderAdminFormGroup);
  }

  ngOnInit(): void {
    this.provider$.pipe(
      filter((provider: Provider) => !!provider),
      takeUntil(this.destroy$)
    ).subscribe((provider: Provider) => this.provider = provider);

    if(!this.isDeputy){
      this.store.dispatch(new GetWorkshopsByProviderId(this.provider.id));
    }
  }
  
  setEditMode(): void {
    this.addNavPath();
  }

  addNavPath(): void { } //TODO: add nav path

  onWorkshopsSelect(workshopsId: string[]): void {
    this.managedWorkshopIds = workshopsId;
  }

  checkValidation(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      form.get(key).markAsTouched();
    });
  }

  onSubmit(): void {
    const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
      width: Constants.MODAL_SMALL,
      data: {
        type: (this.isDeputy) ? ModalConfirmationType.createProviderAdminDeputy : ModalConfirmationType.createProviderAdmin
      }
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        let providerAdmin = new ProviderAdmin(this.ProviderAdminFormGroup.value, this.isDeputy, this.provider.id, this.managedWorkshopIds)
        this.store.dispatch(new CreateProviderAdmin(providerAdmin));
      }
    });   
  }

}
