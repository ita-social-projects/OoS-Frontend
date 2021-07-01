import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Select, Store } from '@ngxs/store';
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

  priceRadioBtn: FormControl = new FormControl(false);
  priceCtrl: FormControl = new FormControl({ value: this.constants.MIN_PRICE, disabled: true });

  provider: Provider;
  useProviderInfoCtrl: FormControl = new FormControl(false);

  AboutFormGroup: FormGroup;
  @Input() workshop: Workshop;
  @Output() PassAboutFormGroup = new EventEmitter();

  constructor(private formBuilder: FormBuilder, private store: Store) {
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
    });
    this.onPriceCtrlInit();
    this.useProviderInfo();
    this.addWorkHour();
  }

  ngOnInit(): void {
    this.PassAboutFormGroup.emit(this.AboutFormGroup);
    this.provider = this.store.selectSnapshot<Provider>(RegistrationState.provider);
    this.workshop && this.activateEditMode();
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to teh formgroup
   */
  onPriceCtrlInit(): void {
    this.priceCtrl.valueChanges.subscribe((price: number) =>
      price ? this.AboutFormGroup.get('price').setValue(price) : this.AboutFormGroup.get('price').setValue(0)
    );

    this.priceRadioBtn.valueChanges.subscribe((isPrice: boolean) =>
      isPrice ? this.priceCtrl.enable() : this.priceCtrl.disable()
    );
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
    this.useProviderInfoCtrl.valueChanges.subscribe((useProviderInfo: boolean) => {
      if (useProviderInfo) {
        this.AboutFormGroup.get('email').setValue(this.provider.email);
        this.AboutFormGroup.get('title').setValue(this.provider.fullTitle);
        this.AboutFormGroup.get('phone').setValue(this.provider.phoneNumber);
        this.AboutFormGroup.get('website').setValue(this.provider.website);
        this.AboutFormGroup.get('facebook').setValue(this.provider.facebook);
        this.AboutFormGroup.get('instagram').setValue(this.provider.instagram);
      } else {
        this.AboutFormGroup.get('email').reset();
        this.AboutFormGroup.get('phone').reset();
        this.AboutFormGroup.get('website').reset();
        this.AboutFormGroup.get('facebook').reset();
        this.AboutFormGroup.get('instagram').reset();
      }
    })
  }

  /**
  * This method fills inputs with information of edited workshop
  */
  activateEditMode(): void {
    this.AboutFormGroup.patchValue(this.workshop, { emitEvent: false });
    if (this.workshop.price) {
      this.priceRadioBtn.setValue(true);
      this.priceCtrl.setValue(this.workshop.price);
    }
  }
}
