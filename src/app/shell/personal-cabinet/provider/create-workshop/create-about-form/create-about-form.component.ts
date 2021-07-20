import { TOUCH_BUFFER_MS } from '@angular/cdk/a11y';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
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

  @Input() workshop: Workshop;
  @Output() PassAboutFormGroup = new EventEmitter();

  provider: Provider;
  AboutFormGroup: FormGroup;
  workingHours: SelectedWorkingHours[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();

  priceRadioBtn: FormControl = new FormControl(false);
  useProviderInfoCtrl: FormControl = new FormControl(false);
  competitiveSelectionRadioBtn: FormControl = new FormControl(false);

  constructor(private formBuilder: FormBuilder, private store: Store) {
    this.AboutFormGroup = this.formBuilder.group({
      title: new FormControl('', Validators.required),
      type: new FormControl('', Validators.required),
      phone: new FormControl('', [Validators.required, Validators.minLength(Constants.PHONE_LENGTH)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      minAge: new FormControl('', [Validators.required]),
      maxAge: new FormControl('', [Validators.required]),
      image: new FormControl(''),
      website: new FormControl(''),
      facebook: new FormControl(''),
      instagram: new FormControl(''),
      daysPerWeek: new FormControl('', [Validators.required]),
      price: new FormControl({ value: this.constants.MIN_PRICE, disabled: true }, [Validators.required]),
      workingHours: new FormControl(''),
      isPerMonth: new FormControl(false),
      competitiveSelectionDescription: new FormControl(''),
    });
    this.onPriceCtrlInit();
    this.useProviderInfo();
    this.addWorkHour();
  }

  ngOnInit(): void {
    this.onCompetitiveSelectionCtrlInit();
    this.PassAboutFormGroup.emit(this.AboutFormGroup);
    this.provider = this.store.selectSnapshot<Provider>(RegistrationState.provider);
    this.workshop && this.activateEditMode();
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to teh formgroup
   */
  private onPriceCtrlInit(): void {
    this.priceRadioBtn.valueChanges
      .pipe(
        takeUntil(this.destroy$),
      ).subscribe((isPrice: boolean) => {
        if (isPrice) {
          this.AboutFormGroup.get('price').enable()
        } else {
          this.AboutFormGroup.get('price').setValue(this.constants.MIN_PRICE);
          this.AboutFormGroup.get('price').disable();
        }
      });

    this.AboutFormGroup.get('price').valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(100),
      ).subscribe((price: number) => this.AboutFormGroup.get('price').setValue(price)
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
  private useProviderInfo(): void {
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
  private activateEditMode(): void {
    this.AboutFormGroup.patchValue(this.workshop, { emitEvent: false });
    this.workshop.price && this.priceRadioBtn.setValue(true);
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to teh formgroup
   */
  private onCompetitiveSelectionCtrlInit(): void {
    this.competitiveSelectionRadioBtn.valueChanges
      .pipe(
        takeUntil(this.destroy$),
      ).subscribe((iscompetitiveSelectionDesc: boolean) => {
        iscompetitiveSelectionDesc ? this.AboutFormGroup.get('competitiveSelectionDescription').enable() : this.AboutFormGroup.get('competitiveSelectionDescription').disable();
      });

    this.AboutFormGroup.get('competitiveSelectionDescription').valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(100),
      ).subscribe((disabilityOptionsDesc: string) =>
        this.AboutFormGroup.get('competitiveSelectionDescription').setValue(disabilityOptionsDesc)
      );
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
