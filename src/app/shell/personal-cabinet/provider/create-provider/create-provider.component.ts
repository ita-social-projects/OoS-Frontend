import { takeUntil } from 'rxjs/operators';

import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import {
  AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngxs/store';

import {
  ConfirmationModalWindowComponent
} from '../../../../shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from '../../../../shared/constants/constants';
import { NavBarName } from '../../../../shared/enum/enumUA/navigation-bar';
import { ModalConfirmationType } from '../../../../shared/enum/modal-confirmation';
import { CreateProviderSteps } from '../../../../shared/enum/provider';
import { Role } from '../../../../shared/enum/role';
import { Address } from '../../../../shared/models/address.model';
import { FeaturesList } from '../../../../shared/models/featuresList.model';
import { Provider } from '../../../../shared/models/provider.model';
import { User } from '../../../../shared/models/user.model';
import {
  NavigationBarService
} from '../../../../shared/services/navigation-bar/navigation-bar.service';
import { MetaDataState } from '../../../../shared/store/meta-data.state';
import { AddNavPath } from '../../../../shared/store/navigation.actions';
import { CreateProvider, UpdateProvider } from '../../../../shared/store/provider.actions';
import { Logout } from '../../../../shared/store/registration.actions';
import { RegistrationState } from '../../../../shared/store/registration.state';
import { Util } from '../../../../shared/utils/utils';
import { CreateFormComponent } from '../../shared-cabinet/create-form/create-form.component';

@Component({
  selector: 'app-create-provider',
  templateUrl: './create-provider.component.html',
  styleUrls: ['./create-provider.component.scss'],
  providers: [
    {
      provide: STEPPER_GLOBAL_OPTIONS,
      useValue: { displayDefaultIndicatorType: false }
    }
  ]
})
export class CreateProviderComponent extends CreateFormComponent implements OnInit, AfterViewInit, OnDestroy, AfterViewChecked {
  @ViewChild('stepper') public stepper: MatStepper;

  public provider: Provider;
  public isAgreed: boolean;
  public isNotRobot: boolean;

  public InfoFormGroup: FormGroup;
  public ActualAddressFormGroup: FormGroup;
  public LegalAddressFormGroup: FormGroup;
  public PhotoFormGroup: FormGroup;

  public ContactsFormGroup: FormGroup = new FormGroup({});
  public RobotFormControl = new FormControl(false);
  public AgreementFormControl = new FormControl(false);
  public isImagesFeature: boolean;

  constructor(
    protected store: Store,
    protected route: ActivatedRoute,
    protected navigationBarService: NavigationBarService,
    private router: Router,
    private changeDetector: ChangeDetectorRef,
    private matDialog: MatDialog
  ) {
    super(store, route, navigationBarService);
  }

  public ngOnInit(): void {
    this.determineEditMode();

    this.RobotFormControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val: boolean) => (this.isNotRobot = val));

    this.AgreementFormControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val: boolean) => (this.isAgreed = val));
  }

  public ngAfterViewInit(): void {
    if (this.editMode) {
      this.route.params.subscribe((params: Params) => {
        this.stepper.selectedIndex = +CreateProviderSteps[params.param];
      });
    }
  }

  public ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }

  public setEditMode(): void {
    this.provider = this.store.selectSnapshot<Provider>(RegistrationState.provider);
    this.addNavPath();
    this.isAgreed = true;
    this.isNotRobot = true;
  }

  public addNavPath(): void {
    const userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
    const subRole = this.store.selectSnapshot<Role>(RegistrationState.subrole);
    const personalCabinetTitle = Util.getPersonalCabinetTitle(userRole, subRole);

    this.store.dispatch(
      new AddNavPath(
        this.navigationBarService.createNavPaths(
          { name: personalCabinetTitle, path: '/personal-cabinet/provider/info', isActive: false, disable: false },
          { name: NavBarName.EditInstitutions, isActive: false, disable: true }
        )
      )
    );
  }

  /**
   * This method dispatch store action to create a Provider with Form Groups values
   */
  public onSubmit(): void {
    if (this.PhotoFormGroup.invalid) {
      this.checkValidation(this.PhotoFormGroup);
    } else {
      const user: User = this.store.selectSnapshot<User>(RegistrationState.user);
      this.isImagesFeature = this.store.selectSnapshot<FeaturesList>(MetaDataState.featuresList).images;
      let legalAddress: Address;
      let actulaAdress: Address;
      let provider: Provider;

      if (this.editMode) {
        legalAddress = new Address(this.LegalAddressFormGroup.value, this.provider.legalAddress);
        actulaAdress = this.ActualAddressFormGroup.disabled
          ? null
          : new Address(this.ActualAddressFormGroup.value, this.provider.actualAddress);
        provider = new Provider(this.InfoFormGroup.value, legalAddress, actulaAdress, this.PhotoFormGroup.value, user, this.provider);
        this.store.dispatch(new UpdateProvider(provider, this.isImagesFeature));
      } else {
        legalAddress = new Address(this.LegalAddressFormGroup.value);
        actulaAdress = this.ActualAddressFormGroup.disabled ? null : new Address(this.ActualAddressFormGroup.value);
        provider = new Provider(this.InfoFormGroup.value, legalAddress, actulaAdress, this.PhotoFormGroup.value, user);
        this.store.dispatch(new CreateProvider(provider, this.isImagesFeature));
      }
    }
  }

  /**
   * This method receives a form from create-info child component and assigns to the Info FormGroup
   * @param FormGroup form
   */
  public onReceiveInfoFormGroup(form: FormGroup): void {
    this.InfoFormGroup = form;
    this.subscribeOnDirtyForm(form);
  }

  /**
   * These methods receive froms from create-contacts child component and assigns to the Actual and Legal FormGroup
   * @param FormGroup form
   */
  public onReceiveActualAddressFormGroup(form: FormGroup): void {
    this.ActualAddressFormGroup = form;
    this.subscribeOnDirtyForm(form);
    this.ContactsFormGroup.addControl('actual', form);
  }

  public onReceiveLegalAddressFormGroup(form: FormGroup): void {
    this.LegalAddressFormGroup = form;
    this.subscribeOnDirtyForm(form);
    this.ContactsFormGroup.addControl('legal', form);
  }

  /**
   * This method receives a from from create-photo child component and assigns to the Info FormGroup
   * @param FormGroup form
   */
  public onReceivePhotoFormGroup(form: FormGroup): void {
    this.PhotoFormGroup = form;
    this.subscribeOnDirtyForm(form);
  }

  /**
   * This method receives a form and marks each control of this form as touched
   * @param FormGroup form
   */
  public checkValidation(form: FormGroup): void {
    Object.keys(form.controls).forEach((key) => {
      form.get(key).markAsTouched();
    });
  }

  /**
   * This method marks each control of form in the array of forms in ContactsFormGroup as touched
   */
  public checkValidationContacts(): void {
    Object.keys(this.ContactsFormGroup.controls).forEach((key) => {
      if ((this.ContactsFormGroup.get(key) as FormGroup).enabled) {
        this.checkValidation(this.ContactsFormGroup.get(key) as FormGroup);
      }
    });
  }

  public onCancel(): void {
    const isRegistered = this.store.selectSnapshot(RegistrationState.user).isRegistered;

    if (!isRegistered) {
      const dialogRef = this.matDialog.open(ConfirmationModalWindowComponent, {
        width: Constants.MODAL_SMALL,
        data: {
          type: ModalConfirmationType.leaveRegistration,
          property: ''
        }
      });

      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.store.dispatch(new Logout());
        }
      });
    } else {
      this.router.navigate(['/personal-cabinet/provider/info']);
    }
  }
}
