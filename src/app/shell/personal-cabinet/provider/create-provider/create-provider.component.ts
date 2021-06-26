import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { createProviderSteps } from 'src/app/shared/enum/provider';
import { Address } from 'src/app/shared/models/address.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { ChangePage } from 'src/app/shared/store/app.actions';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { CreateProvider } from 'src/app/shared/store/user.actions';

@Component({
  selector: 'app-create-provider',
  templateUrl: './create-provider.component.html',
  styleUrls: ['./create-provider.component.scss']
})
export class CreateProviderComponent implements OnInit, AfterViewInit {

  provider: Provider;

  InfoFormGroup: FormGroup;
  ActualAddressFormGroup: FormGroup;
  LegalAddressFormGroup: FormGroup;
  PhotoFormGroup: FormGroup;

  isAgreed: boolean;
  isNotRobot: boolean;
  editMode: boolean;

  RobotFormControl = new FormControl(false);
  AgreementFormControl = new FormControl(false);
  @ViewChild('stepper') stepper: MatStepper;

  constructor(private store: Store, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.store.dispatch(new ChangePage(false));
    this.editMode = Boolean(this.route.snapshot.paramMap.get('param'));
    if (this.editMode) {
      this.provider = this.store.selectSnapshot<Provider>(RegistrationState.provider);
    }

    this.RobotFormControl.valueChanges.subscribe(val => this.isNotRobot = val);
    this.AgreementFormControl.valueChanges.subscribe(val => this.isAgreed = val);
  }

  ngAfterViewInit() {
    this.route.params.subscribe((params) => {
      this.stepper.selectedIndex = +createProviderSteps[params.param];
    })
  }

  /**
   * This method dispatch store action to create a Provider with Form Groups values
   */
  onSubmit() {
    const legalAddress = new Address(this.ActualAddressFormGroup.value);
    const actulaAdress = new Address(this.LegalAddressFormGroup.value);

    if (this.editMode) {
      const provider = new Provider(this.InfoFormGroup.value, legalAddress, actulaAdress, this.PhotoFormGroup.value, this.provider.id)
    } else {
      const provider = new Provider(this.InfoFormGroup.value, legalAddress, actulaAdress, this.PhotoFormGroup.value);
      this.store.dispatch(new CreateProvider(provider));
    }

  }

  /**
   * This method receives a form from create-info child component and assigns to the Info FormGroup
   * @param FormGroup form
   */
  onReceiveInfoFormGroup(form: FormGroup): void {
    this.InfoFormGroup = form;
  }

  /**
   * These methods receive froms from create-contacts child component and assigns to the Actual and Legal FormGroup
   * @param FormGroup form
   */
  onReceiveActualAddressFormGroup(form: FormGroup): void {
    this.ActualAddressFormGroup = form;
  }

  onReceiveLegalAddressFormGrou(form: FormGroup): void {
    this.LegalAddressFormGroup = form;
  }

  /**
   * This method receives a from from create-photo child component and assigns to the Info FormGroup
   * @param FormGroup form
   */
  onReceivePhotoFormGroup(form: FormGroup): void {
    this.PhotoFormGroup = form;
  }
}
