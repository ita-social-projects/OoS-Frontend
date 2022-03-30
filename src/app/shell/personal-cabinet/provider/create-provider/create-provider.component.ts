import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AfterViewInit, Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngxs/store';
import { takeUntil } from 'rxjs/operators';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { createProviderSteps } from 'src/app/shared/enum/provider';
import { Address } from 'src/app/shared/models/address.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { User } from 'src/app/shared/models/user.model';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { AddNavPath } from 'src/app/shared/store/navigation.actions';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { CreateProvider, UpdateProvider } from 'src/app/shared/store/user.actions';
import { CreateFormComponent } from '../../create-form/create-form.component';

@Component({
  selector: 'app-create-provider',
  templateUrl: './create-provider.component.html',
  styleUrls: ['./create-provider.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS,
    useValue: { displayDefaultIndicatorType: false }
  }]
})
export class CreateProviderComponent extends CreateFormComponent implements OnInit, AfterViewInit, OnDestroy {
  provider: Provider;
  isAgreed: boolean;
  // isEmpty: boolean;
  isNotRobot: boolean;  

  InfoFormGroup: FormGroup;
  ActualAddressFormGroup: FormGroup;
  LegalAddressFormGroup: FormGroup;
  PhotoFormGroup: FormGroup;

  ContactsFormGroup: FormGroup = new FormGroup({});
  RobotFormControl = new FormControl(false);
  AgreementFormControl = new FormControl(false);

  @ViewChild('stepper') stepper: MatStepper;

  constructor(store: Store, route: ActivatedRoute, navigationBarService: NavigationBarService) {
    super(store, route, navigationBarService);
  }

  ngOnInit(): void {
    this.determineEditMode();

    this.RobotFormControl.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe((val: boolean) => this.isNotRobot = val);

    this.AgreementFormControl.valueChanges.pipe(
      takeUntil(this.destroy$),
    ).subscribe((val: boolean) => this.isAgreed = val);

    // this.InfoFormGroup.valueChanges.pipe(
    //   takeUntil(this.destroy$),
    // ).subscribe((val: FormGroup) => this.isEmpty = !val[0].shortTitle || !val[0].fullTitle);
        
  }

  ngAfterViewInit(): void {
    if (this.editMode) {
      this.route.params.subscribe((params: Params) => {
        this.stepper.selectedIndex = +createProviderSteps[params.param];
      });
    }
  }

  setEditMode(): void {
    this.provider = this.store.selectSnapshot<Provider>(RegistrationState.provider);
    this.addNavPath();
  }

  addNavPath(): void {
    this.store.dispatch(new AddNavPath(this.navigationBarService.creatNavPaths(
      { name: NavBarName.PersonalCabinetProvider, path: '/personal-cabinet/provider/info', isActive: false, disable: false },
      { name: NavBarName.EditInstitutions, isActive: false, disable: true }
    )));
  }

  /**
   * This method dispatch store action to create a Provider with Form Groups values
   */
  onSubmit() {
    if (this.PhotoFormGroup.invalid) {
      this.checkValidation(this.PhotoFormGroup);
    } else {
      const user: User = this.store.selectSnapshot<User>(RegistrationState.user);
      let legalAddress: Address;
      let actulaAdress: Address;
      let provider: Provider;

      if (this.editMode) {
        legalAddress = new Address(this.LegalAddressFormGroup.value, this.provider.legalAddress);
        actulaAdress = this.ActualAddressFormGroup.disabled ? null : new Address(this.ActualAddressFormGroup.value, this.provider.actualAddress);
        provider = new Provider(this.InfoFormGroup.value, legalAddress, actulaAdress, this.PhotoFormGroup.value, user, this.provider);
        this.store.dispatch(new UpdateProvider(provider));
      } else {
        legalAddress = new Address(this.LegalAddressFormGroup.value);
        actulaAdress = this.ActualAddressFormGroup.disabled ? null : new Address(this.ActualAddressFormGroup.value);
        provider = new Provider(this.InfoFormGroup.value, legalAddress, actulaAdress, this.PhotoFormGroup.value, user);
        this.store.dispatch(new CreateProvider(provider));
      }
    }
  }

  /**
   * This method receives a form from create-info child component and assigns to the Info FormGroup
   * @param FormGroup form
   */
  onReceiveInfoFormGroup(form: FormGroup): void {
    this.InfoFormGroup = form;
    this.subscribeOnDirtyForm(form);
  }

  /**
   * These methods receive froms from create-contacts child component and assigns to the Actual and Legal FormGroup
   * @param FormGroup form
   */
  onReceiveActualAddressFormGroup(form: FormGroup): void {
    this.ActualAddressFormGroup = form;
    this.subscribeOnDirtyForm(form);
    this.ContactsFormGroup.addControl('actual', form);
  }

  onReceiveLegalAddressFormGroup(form: FormGroup): void {
    this.LegalAddressFormGroup = form;
    this.subscribeOnDirtyForm(form);
    this.ContactsFormGroup.addControl('legal', form);
  }

  /**
   * This method receives a from from create-photo child component and assigns to the Info FormGroup
   * @param FormGroup form
   */
  onReceivePhotoFormGroup(form: FormGroup): void {
    this.PhotoFormGroup = form;
    this.subscribeOnDirtyForm(form);
  }

  /**
   * This method receives a form and marks each control of this form as touched
   * @param FormGroup form
   */
  checkValidation(form: FormGroup): void {
    Object.keys(form.controls).forEach(key => {
      form.get(key).markAsTouched();
    });
  }

  checkEmpty(form: FormGroup): boolean {
    return (form?.value.fullTitle === '' 
      || form?.value.shortTitle === ''
      || form?.value.director === ''
      || form?.value.directorDateOfBirth === ''
      || form?.value.edrpouIpn === ''
      || form?.value.phoneNumber === ''
      || form?.value.email === ''
      || form?.value.founder === '');   
  }
  /**
   * This method marks each control of form in the array of forms in ContactsFormGroup as touched
   */
  checkValidationContacts(): void {
    Object.keys(this.ContactsFormGroup.controls).forEach(key => {
      if ((<FormGroup>this.ContactsFormGroup.get(key)).enabled) {
        this.checkValidation(<FormGroup>this.ContactsFormGroup.get(key));
      }
    });
  }
}
