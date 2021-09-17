import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Params } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { createProviderSteps } from 'src/app/shared/enum/provider';
import { Address } from 'src/app/shared/models/address.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { User } from 'src/app/shared/models/user.model';
import { MarkFormDirty } from 'src/app/shared/store/app.actions';
import { AppState } from 'src/app/shared/store/app.state';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { CreateProvider, UpdateProvider } from 'src/app/shared/store/user.actions';

@Component({
  selector: 'app-create-provider',
  templateUrl: './create-provider.component.html',
  styleUrls: ['./create-provider.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS,
    useValue: { displayDefaultIndicatorType: false }
  }]
})
export class CreateProviderComponent implements OnInit, AfterViewInit {

  @Select(AppState.isDirtyForm)
  isDirtyForm$: Observable<Boolean>;
  isPristine = true;
  isLinear = false;

  provider: Provider;

  InfoFormGroup: FormGroup;
  ActualAddressFormGroup: FormGroup;
  LegalAddressFormGroup: FormGroup;
  PhotoFormGroup: FormGroup;
  ContactsFormGroup: FormGroup = new FormGroup({});

  isAgreed: boolean;
  isNotRobot: boolean;
  editMode: boolean;

  RobotFormControl = new FormControl(false);
  AgreementFormControl = new FormControl(false);
  @ViewChild('stepper') stepper: MatStepper;

  constructor(private store: Store, private route: ActivatedRoute) { }

  ngOnInit() {
    this.editMode = Boolean(this.route.snapshot.paramMap.get('param'));

    if (this.editMode) {
      this.provider = this.store.selectSnapshot<Provider>(RegistrationState.provider);
    }

    this.RobotFormControl.valueChanges.subscribe((val: boolean) => this.isNotRobot = val);
    this.AgreementFormControl.valueChanges.subscribe((val: boolean) => this.isAgreed = val);
  }

  ngAfterViewInit() {
    this.route.params.subscribe((params: Params) => this.stepper.selectedIndex = +createProviderSteps[params.param]);
  }

  /**
   * This method dispatch store action to create a Provider with Form Groups values
   */
  onSubmit() {
    const user: User = this.store.selectSnapshot<User>(RegistrationState.user);

    let legalAddress: Address;
    let actulaAdress: Address;
    let provider: Provider;

    if (this.editMode) {
      legalAddress = new Address(this.ActualAddressFormGroup.value, this.provider.legalAddress);
      actulaAdress = new Address(this.LegalAddressFormGroup.value, this.provider.actualAddress);
      provider = new Provider(this.InfoFormGroup.value, legalAddress, actulaAdress, this.PhotoFormGroup.value, user, this.provider);
      this.store.dispatch(new UpdateProvider(provider));
    } else {
      legalAddress = new Address(this.ActualAddressFormGroup.value);
      actulaAdress = new Address(this.LegalAddressFormGroup.value);
      provider = new Provider(this.InfoFormGroup.value, legalAddress, actulaAdress, this.PhotoFormGroup.value, user);
      this.store.dispatch(new CreateProvider(provider));
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

  onReceiveLegalAddressFormGrou(form: FormGroup): void {
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

  private subscribeOnDirtyForm(form: FormGroup): void {
    form.valueChanges
      .pipe(
        takeWhile(() => this.isPristine))
      .subscribe(() => {
        this.isPristine = false;
        this.store.dispatch(new MarkFormDirty(true))
      });
  }
}
