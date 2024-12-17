import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, switchMap, takeUntil } from 'rxjs/operators';

import { ConfirmationModalWindowComponent } from 'shared/components/confirmation-modal-window/confirmation-modal-window.component';
import { Constants } from 'shared/constants/constants';
import { SnackbarText } from 'shared/enum/enumUA/message-bar';
import { NavBarName, PersonalCabinetTitle } from 'shared/enum/enumUA/navigation-bar';
import { ModalConfirmationType } from 'shared/enum/modal-confirmation';
import { CreateProviderSteps } from 'shared/enum/provider';
import { Role } from 'shared/enum/role';
import { Address } from 'shared/models/address.model';
import { FeaturesList } from 'shared/models/features-list.model';
import { Provider } from 'shared/models/provider.model';
import { User } from 'shared/models/user.model';
import { NavigationBarService } from 'shared/services/navigation-bar/navigation-bar.service';
import { ClearMessageBar, MarkFormDirty, ShowMessageBar } from 'shared/store/app.actions';
import { AppState } from 'shared/store/app.state';
import { MetaDataState } from 'shared/store/meta-data.state';
import { AddNavPath } from 'shared/store/navigation.actions';
import { CreateProvider, UpdateProvider } from 'shared/store/provider.actions';
import { RegistrationState } from 'shared/store/registration.state';
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
export class CreateProviderComponent extends CreateFormComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  @ViewChild('stepper') public stepper: MatStepper;

  @Select(MetaDataState.featuresList)
  public featuresList$: Observable<FeaturesList>;

  @Select(RegistrationState.provider)
  private provider$: Observable<Provider>;

  public provider: Provider;
  public isAgreed: boolean;
  public isNotRobot: boolean;
  public isEditMode: boolean = false;

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
    this.isEditMode = this.store.selectSnapshot(AppState.isEditMode);

    if (this.isEditMode) {
      this.setEditMode();
    }

    this.featuresList$
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe((featuresList) => (this.isImagesFeature = featuresList.images));
    this.RobotFormControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val: boolean) => (this.isNotRobot = val));
    this.AgreementFormControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((val: boolean) => (this.isAgreed = val));
  }

  public ngAfterViewInit(): void {
    if (this.isEditMode) {
      this.route.params.subscribe((params: Params) => (this.stepper.selectedIndex = +CreateProviderSteps[params.param]));
    } else {
      this.store.dispatch(new ClearMessageBar());
    }
  }

  public ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
    const isRegistered = this.store.selectSnapshot(RegistrationState.isRegistered);
    if (!this.isEditMode && !isRegistered) {
      this.store.dispatch(
        new ShowMessageBar({
          message: SnackbarText.completeRegistration,
          type: 'warningYellow',
          verticalPosition: 'bottom',
          infinityDuration: true,
          unclosable: true
        })
      );
    }
  }

  public setEditMode(): void {
    this.provider$.pipe(filter(Boolean), takeUntil(this.destroy$)).subscribe((provider: Provider) => {
      this.provider = provider;
    });

    this.addNavPath();
    this.isAgreed = true;
    this.isNotRobot = true;
  }

  public addNavPath(): void {
    const userRole = this.store.selectSnapshot<Role>(RegistrationState.role);
    const personalCabinetTitle = PersonalCabinetTitle[userRole];

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
      let legalAddress: Address;
      let actualAddress: Address;
      let provider: Provider;

      if (this.isEditMode) {
        legalAddress = new Address(this.LegalAddressFormGroup.value, this.provider.legalAddress);
        actualAddress = this.ActualAddressFormGroup.disabled
          ? null
          : new Address(this.ActualAddressFormGroup.value, this.provider.actualAddress);
        provider = new Provider(this.InfoFormGroup.value, legalAddress, actualAddress, this.PhotoFormGroup.value, user, this.provider);
        this.store.dispatch(new UpdateProvider(provider, this.isImagesFeature));
      } else {
        legalAddress = new Address(this.LegalAddressFormGroup.value);
        actualAddress = this.ActualAddressFormGroup.disabled ? null : new Address(this.ActualAddressFormGroup.value);
        provider = new Provider(this.InfoFormGroup.value, legalAddress, actualAddress, this.PhotoFormGroup.value, user);
        this.store.dispatch(new CreateProvider(provider, this.isImagesFeature));
      }
    }
  }

  /**
   * This method receives a form from create-info child component and assigns to the Info FormGroup
   * @param form FormGroup
   */
  public onReceiveInfoFormGroup(form: FormGroup): void {
    this.InfoFormGroup = form;
    this.subscribeOnDirtyForm(form);
  }

  /**
   * These methods receive froms from create-contacts child component and assigns to the Actual and Legal FormGroup
   * @param form FormGroup
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
   * This method receives a form from create-photo child component and assigns to the Info FormGroup
   * @param form FormGroup
   */
  public onReceivePhotoFormGroup(form: FormGroup): void {
    this.PhotoFormGroup = form;
    this.subscribeOnDirtyForm(form);
  }

  /**
   * This method receives a form and marks each control of this form as touched
   * @param form FormGroup
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
    const isRegistered = this.store.selectSnapshot(RegistrationState.isRegistered);

    if (!isRegistered) {
      this.matDialog
        .open(ConfirmationModalWindowComponent, {
          width: Constants.MODAL_SMALL,
          data: {
            type: ModalConfirmationType.leaveRegistration,
            property: ''
          }
        })
        .afterClosed()
        .pipe(
          filter(Boolean),
          switchMap(() => this.store.dispatch(new MarkFormDirty(false)))
        )
        .subscribe(() => this.router.navigate(['']));
    } else {
      this.router.navigate(['/personal-cabinet/provider/info']);
    }
  }
}
