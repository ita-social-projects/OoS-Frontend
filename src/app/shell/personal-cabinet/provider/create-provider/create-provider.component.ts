import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Address } from 'src/app/shared/models/address.model';
import { Provider } from 'src/app/shared/models/provider.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
import { CreateProvider } from 'src/app/shared/store/user.actions';

@Component({
  selector: 'app-create-provider',
  templateUrl: './create-provider.component.html',
  styleUrls: ['./create-provider.component.scss']
})
export class CreateProviderComponent implements OnInit {

  @Select(RegistrationState.userId) userId$: Observable<string>;
  userId: string;

  InfoFormGroup: FormGroup;
  ActualAddressFormGroup: FormGroup;
  LegalAddressFormGroup: FormGroup;
  PhotoFormGroup: FormGroup;

  isAgreed: boolean;
  isNotRobot: boolean;

  RobotFormControl = new FormControl(false);
  AgreementFormControl = new FormControl(false);

  constructor(private store: Store) {
  }

  ngOnInit() {
    this.RobotFormControl.valueChanges.subscribe(val => (val) ? this.isNotRobot = true : this.isNotRobot = false);
    this.AgreementFormControl.valueChanges.subscribe(val => (val) ? this.isAgreed = true : this.isAgreed = false);
  }

  /**
   * This method dispatch store action to create a Provider with Form Groups values
   */
  onSubmit() {
    console.log(this.InfoFormGroup.get('type').value, typeof (this.InfoFormGroup.get('type').value))
    const legalAddress = new Address(this.ActualAddressFormGroup.value);
    const actulaAdress = new Address(this.LegalAddressFormGroup.value);
    this.userId$.subscribe(id => this.userId = id);

    const provider = new Provider(this.userId, this.InfoFormGroup.value, legalAddress, actulaAdress, this.PhotoFormGroup.value)
    this.store.dispatch(new CreateProvider(provider));
    console.log(provider)
  }
  /**
   * This method receives a from create-info child component and assigns to the Info FormGroup
   * @param FormGroup form
   */
  onReceiveInfoFormGroup(form: FormGroup): void {
    this.InfoFormGroup = form;
  }
  /**
   * These methods receive froms create-contacts child component and assigns to the Actula and Legal FormGroup
   * @param FormGroup form
   */
  onReceiveActualAddressFormGroup(form: FormGroup): void {
    this.ActualAddressFormGroup = form;
  }
  onReceiveLegalAddressFormGrou(form: FormGroup): void {
    this.LegalAddressFormGroup = form;
  }
  /**
   * This method receives a from create-photo child component and assigns to the Info FormGroup
   * @param FormGroup form
   */
  onReceivePhotoFormGroup(form: FormGroup): void {
    this.PhotoFormGroup = form;
  }

}
