import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Constants } from 'src/app/shared/constants/constants';
import { WorkshopType, WorkshopTypeUkr } from 'src/app/shared/enum/provider';
import { Provider } from 'src/app/shared/models/provider.model';
import { SelectedWorkingHours } from 'src/app/shared/models/workingHours.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';
@Component({
  selector: 'app-create-about-form',
  templateUrl: './create-about-form.component.html',
  styleUrls: ['./create-about-form.component.scss'],

})
export class CreateAboutFormComponent implements OnInit {

  readonly workshopType = WorkshopType;
  readonly workshopTypeUkr = WorkshopTypeUkr;
  readonly constants: typeof Constants = Constants;
  workingHours: SelectedWorkingHours[] = [];

  priceRadioBtn = new FormControl(false);
  priceCtrl = new FormControl({ value: this.constants.MIN_PRICE, disabled: true });

  @Select(RegistrationState.provider)
  provider$: Observable<Provider>;
  provider: Provider;
  useProviderInfoCtrl = new FormControl(false);

  AboutFormGroup: FormGroup;
  @Input() workshop: Workshop;
  @Output() PassAboutFormGroup = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.AboutFormGroup = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required, Validators.maxLength(9), Validators.minLength(9)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      minAge: new FormControl('', [Validators.required]),
      maxAge: new FormControl('', [Validators.required]),
      image: new FormControl(''),
      website: new FormControl(''),
      facebook: new FormControl(''),
      instagram: new FormControl(''),
      daysPerWeek: new FormControl(''),
      price: new FormControl(0),
      workingHours: new FormControl(''),
      isPerMonth: new FormControl(false),
      providerTitle: new FormControl(''),
      providerId: new FormControl(''),
    });
    this.onPriceCtrlInit();
    this.useProviderInfo();
    this.addWorkHour();
  }

  ngOnInit(): void {
    this.PassAboutFormGroup.emit(this.AboutFormGroup);
    this.provider$.subscribe(provider => this.provider = provider);
    this.AboutFormGroup.get('providerTitle').setValue(this.provider?.fullTitle);
    this.AboutFormGroup.get('providerId').setValue(this.provider?.id);

    this.workshop && this.activateEditMode();
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to teh formgroup
   */
  onPriceCtrlInit(): void {
    this.priceCtrl.valueChanges.subscribe(val =>
      val ? this.AboutFormGroup.get('price').setValue(val) : this.AboutFormGroup.get('price').setValue(0))
    this.priceRadioBtn.valueChanges.subscribe(val => {
      val ? this.priceCtrl.enable() : this.priceCtrl.disable();
    });
  }

  /**
  * This method add new working hours form to the array of working hours
  */
  addWorkHour(): void {
    const workHour: SelectedWorkingHours = {
      day: [],
      timeFrom: '',
      timeTo: ''
    }
    this.workingHours.push(workHour);
    this.AboutFormGroup.get('workingHours').setValue(this.workingHours);
  }

  /**
  * This method delete selected working hours form to the array of working hours
  */
  deleteWorkHour(workHour: SelectedWorkingHours): void {
    this.workingHours.splice(this.workingHours.indexOf(workHour), 1);
    this.AboutFormGroup.get('workingHours').setValue(this.workingHours);
  }

  /**
  * This method fills in the info from provider to the workshop if check box is checked
  */
  useProviderInfo(): void {
    this.useProviderInfoCtrl.valueChanges.subscribe((val) => {
      if (val) {
        this.AboutFormGroup.get('email').setValue(this.provider.email);
        this.AboutFormGroup.get('title').setValue(this.provider.fullTitle);
        this.AboutFormGroup.get('phone').setValue(this.provider.phoneNumber);
        this.AboutFormGroup.get('website').setValue(this.provider.website);
        this.AboutFormGroup.get('facebook').setValue(this.provider.facebook);
        this.AboutFormGroup.get('instagram').setValue(this.provider.instagram);
      } else {
        this.AboutFormGroup.get('email').setValue('');
        this.AboutFormGroup.get('phone').setValue('');
        this.AboutFormGroup.get('website').setValue('');
        this.AboutFormGroup.get('facebook').setValue('');
        this.AboutFormGroup.get('instagram').setValue('');
      }
    })
  }

  /**
  * This method fills inputs with information of edited workshop
  */
  activateEditMode(): void {
    this.AboutFormGroup.patchValue(this.workshop);
    if (this.workshop.price) {
      this.priceRadioBtn.setValue(true);
      this.priceCtrl.setValue(this.workshop.price);
    }
  }
}
