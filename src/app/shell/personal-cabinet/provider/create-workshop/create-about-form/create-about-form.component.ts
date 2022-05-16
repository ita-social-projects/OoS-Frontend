import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Constants } from 'src/app/shared/constants/constants';
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { ProviderWorkshopSameValues, WorkshopType, WorkshopTypeUkr } from 'src/app/shared/enum/provider';
import { Provider } from 'src/app/shared/models/provider.model';
import { DateTimeRanges } from 'src/app/shared/models/workingHours.model';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { RegistrationState } from 'src/app/shared/store/registration.state';


@Component({
  selector: 'app-create-about-form',
  templateUrl: './create-about-form.component.html',
  styleUrls: ['./create-about-form.component.scss'],
})
export class CreateAboutFormComponent implements OnInit, OnDestroy {
  readonly validationConstants = ValidationConstants;
  readonly workshopType = WorkshopType;
  readonly workshopTypeUkr = WorkshopTypeUkr;
  readonly phonePrefix= Constants.PHONE_PREFIX;

  @Input() workshop: Workshop;
  @Input() isRelease2: boolean;
  @Output() PassAboutFormGroup = new EventEmitter();

  provider: Provider;
  AboutFormGroup: FormGroup;
  workingHoursFormArray: FormArray = new FormArray([], [Validators.required]);
  destroy$: Subject<boolean> = new Subject<boolean>();

  priceRadioBtn: FormControl = new FormControl(false);
  useProviderInfoCtrl: FormControl = new FormControl(false);

  // competitiveSelectionRadioBtn: FormControl = new FormControl(false); TODO: add to teh second release

  constructor(private formBuilder: FormBuilder, private store: Store) {
    this.AboutFormGroup = this.formBuilder.group({
      coverImage: new FormControl(''),
      title: new FormControl('', Validators.required),
      phone: new FormControl('', [
        Validators.required, 
        Validators.minLength(Constants.PHONE_LENGTH),
        Validators.maxLength(Constants.PHONE_LENGTH),
      ]),
      email: new FormControl('', [
        Validators.required, 
        Validators.email
      ]),
      minAge: new FormControl('', [Validators.required]),
      maxAge: new FormControl('', [Validators.required]),
      image: new FormControl(''),
      website: new FormControl('',[
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_256) 
      ]),
      facebook: new FormControl('', [
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_256) 
      ]),
      instagram: new FormControl('', [
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_256) 
      ]),
      price: new FormControl({ value: 0, disabled: true }, [Validators.required]),
      workingHours: this.workingHoursFormArray,
      isPerMonth: new FormControl(false),
      // competitiveSelectionDescription: new FormControl('', Validators.required),TODO: add to the second release
    });
    this.onPriceCtrlInit();
    this.useProviderInfo();
  }

  ngOnInit(): void {
    this.PassAboutFormGroup.emit(this.AboutFormGroup);
    this.provider = this.store.selectSnapshot<Provider>(RegistrationState.provider);
    this.workshop ? this.activateEditMode() : this.addWorkingHours();
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to teh formgroup
   */
  private onPriceCtrlInit(): void {
    this.priceRadioBtn.valueChanges
      .pipe(
        takeUntil(this.destroy$),
      ).subscribe((isPrice: boolean) => {
        isPrice ? this.setPriceControlValue(ValidationConstants.MIN_PRICE, 'enable') : this.setPriceControlValue();
      });
  }

  private setPriceControlValue = (price: number = 0, action: string = 'disable') => {
    this.AboutFormGroup.get('price')[action]();
    this.AboutFormGroup.get('price').setValue(price);
  };

  /**
   * This method create new FormGroup add new FormGroup to the FormArray
   */
  addWorkingHours(range?: DateTimeRanges): void {
    this.workingHoursFormArray.push(this.newWorkingHoursForm(range));
  }

  /**
   * This method delete FormGroup from the FormArray by index
   * @param index: number
   */
  deleteWorkingHour(index: number): void {
    this.workingHoursFormArray.removeAt(index);
  }

  /**
   * This method fills in the info from provider to the workshop if check box is checked
   */
  private useProviderInfo(): void {
    const setValue = (value) => this.AboutFormGroup.get(value).setValue(this.provider[ProviderWorkshopSameValues[value]]);
    const resetValue = (value) => this.AboutFormGroup.get(value).reset();

    this.useProviderInfoCtrl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((useProviderInfo: boolean) => {
        for (let value in ProviderWorkshopSameValues ) {
          useProviderInfo ? setValue(value) : resetValue(value);
        }
      });
  }

  /**
   * This method fills inputs with information of edited workshop
   */
  private activateEditMode(): void {
    this.AboutFormGroup.patchValue(this.workshop, { emitEvent: false });
    this.workshop.price && this.priceRadioBtn.setValue(true);
    this.workshop.dateTimeRanges.forEach((range: DateTimeRanges) => this.addWorkingHours(range));
    if (this.workshop.coverImageId) {
      this.AboutFormGroup.addControl('coverImageId', this.formBuilder.control([this.workshop.coverImageId]));
    }
    if(this.workshop.price){
      this.setPriceControlValue(this.workshop.price, 'enable');
    }
  }

  /**
  * This method create new FormGroup
  * @param DateTimeRanges range
  */
  private newWorkingHoursForm(range?: DateTimeRanges): FormGroup {
    const workingHoursFormGroup = this.formBuilder.group({
      workdays: new FormControl('', Validators.required),
      startTime: new FormControl('', Validators.required),
      endTime: new FormControl('', Validators.required),
    });
    if (range) {
      workingHoursFormGroup.addControl('id', this.formBuilder.control(''));
      workingHoursFormGroup.setValue(range);
    }

    return workingHoursFormGroup;
  }

  /**
   * This method makes input enable if radiobutton value
   * is true and sets the value to teh formgroup TODO: add to teh second release
   */
  // private onCompetitiveSelectionCtrlInit(): void {
  //   this.competitiveSelectionRadioBtn.valueChanges
  //     .pipe(
  //       takeUntil(this.destroy$),
  //     ).subscribe((iscompetitiveSelectionDesc: boolean) => {
  //       iscompetitiveSelectionDesc ? this.AboutFormGroup.get('competitiveSelectionDescription').enable() : this.AboutFormGroup.get('competitiveSelectionDescription').disable();
  //     });

  //   this.AboutFormGroup.get('competitiveSelectionDescription').valueChanges
  //     .pipe(
  //       takeUntil(this.destroy$),
  //       debounceTime(100),
  //     ).subscribe((disabilityOptionsDesc: string) =>
  //       this.AboutFormGroup.get('competitiveSelectionDescription').setValue(disabilityOptionsDesc)
  //     );
  // }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
