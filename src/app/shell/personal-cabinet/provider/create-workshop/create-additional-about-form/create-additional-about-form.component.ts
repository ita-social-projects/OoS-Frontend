import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { AgeComposition, EducationalShift, PayRateType, SpecialNeedsType, GroupType } from 'shared/enum/workshop';
import {
  AgeCompositionEnum,
  EducationalShiftEnum,
  PayRateTypeEnum,
  SpecialNeedsTypeEnum,
  GroupTypeEnum
} from 'shared/enum/enumUA/workshop';
import { Workshop } from 'shared/models/workshop.model';
import { Provider } from 'shared/models/provider.model';
import { ValidationConstants } from 'shared/constants/validation';

@Component({
  selector: 'app-create-additional-about-form',
  templateUrl: './create-additional-about-form.component.html',
  styleUrls: ['./create-additional-about-form.component.scss']
})
export class CreateAdditionalAboutFormComponent implements OnInit, OnDestroy {
  @Input() public workshop: Workshop;
  @Input() public provider: Provider;
  @Output() public passAdditionalAboutGroup = new EventEmitter<FormGroup>();

  public AdditionalAboutGroup: FormGroup;
  public priceRadioBtn: FormControl = new FormControl(false);

  protected readonly SpecialNeedsType = SpecialNeedsType;
  protected readonly SpecialNeedsTypeEnum = SpecialNeedsTypeEnum;
  protected readonly EducationalShiftEnum = EducationalShiftEnum;
  protected readonly EducationalShift = EducationalShift;
  protected readonly AgeCompositionEnum = AgeCompositionEnum;
  protected readonly AgeComposition = AgeComposition;
  protected readonly GroupType = GroupType;
  protected readonly GroupTypeEnum = GroupTypeEnum;
  protected readonly validationConstants = ValidationConstants;
  protected readonly PayRateType = PayRateType;
  protected readonly PayRateTypeEnum = PayRateTypeEnum;

  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private readonly formBuilder: FormBuilder) {
    this.initializeForm();
  }

  public get priceControl(): FormControl {
    return this.AdditionalAboutGroup.get('price') as FormControl;
  }

  public get payRateControl(): FormControl {
    return this.AdditionalAboutGroup.get('payRate') as FormControl;
  }

  private get workshopPrice(): number {
    return this.workshop?.price ? this.workshop.price : null;
  }

  public ngOnInit(): void {
    if (this.workshop) {
      this.activateEditMode();
    }

    this.setupFormValidation();
    this.priceControlListener();
    this.priceValueListener();
    this.passAdditionalAboutGroup.emit(this.AdditionalAboutGroup);
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public activateEditMode(): void {
    this.AdditionalAboutGroup.patchValue(
      {
        shortStay: this.workshop.shortStay || false,
        isSelfFinanced: this.workshop.isSelfFinanced || false,
        isSpecial: this.workshop.isSpecial || false,
        isInclusive: this.workshop.isInclusive || false,
        specialNeedsType: this.workshop.specialNeedsType || this.SpecialNeedsType.None,
        educationalShift: this.workshop.educationalShift || EducationalShift.First,
        ageComposition: this.workshop.ageComposition || AgeComposition.SameAge,
        groupType: this.workshop.groupType || GroupType.None,
        payRate: this.workshop.payRate,
        price: this.workshop.price,
        areThereBenefits: this.workshop.areThereBenefits || false,
        preferentialTermsOfParticipation: this.workshop.preferentialTermsOfParticipation
      },
      { emitEvent: false }
    );

    if (this.workshop.price) {
      this.setPriceControlValue(this.workshop.price, 'enable', false);
      this.setPayRateControlValue(this.workshop.payRate, 'enable', false);
      this.priceRadioBtn.setValue(true);
    } else {
      this.setPriceControlValue(null, 'disable', false);
      this.setPayRateControlValue(PayRateType.None, 'disable', false);
    }
  }

  private initializeForm(): void {
    this.AdditionalAboutGroup = this.formBuilder.group({
      shortStay: new FormControl(false),
      isSelfFinanced: new FormControl(false),
      isSpecial: new FormControl(false),
      isInclusive: new FormControl(false),
      specialNeedsType: new FormControl(this.SpecialNeedsType.None),
      educationalShift: new FormControl(this.EducationalShift.First, Validators.required),
      ageComposition: new FormControl(this.AgeComposition.SameAge, Validators.required),
      groupType: new FormControl(this.GroupType.None, Validators.required),
      price: new FormControl({ value: null, disabled: true }, [
        Validators.required,
        Validators.min(ValidationConstants.MIN_PRICE),
        Validators.max(ValidationConstants.MAX_PRICE)
      ]),
      payRate: new FormControl({ value: PayRateType.None, disabled: true }, [Validators.required]),
      areThereBenefits: new FormControl(false),
      preferentialTermsOfParticipation: new FormControl('')
    });
  }

  private setPriceControlValue(price: number = null, action: string = 'disable', emitEvent: boolean = false): void {
    this.priceControl[action]({ emitEvent });
    this.priceControl.setValue(price, { emitEvent });

    if (action === 'disable') {
      this.priceControl.markAsUntouched();
      this.priceControl.setErrors(null);
    }
  }

  /**
   * This method sets 0 as value for payRate when the price is 0,
   * otherwise it sets either workshop value, or PayRateType.None for selecting new value
   */
  private setPayRateControlValue(payRate: PayRateType = PayRateType.None, action: string = 'disable', emitEvent: boolean = false): void {
    this.payRateControl[action]({ emitEvent });
    this.payRateControl.setValue(payRate, { emitEvent });

    if (action === 'disable') {
      this.payRateControl.markAsUntouched();
      this.payRateControl.setErrors(null);
    }
  }

  private setupFormValidation(): void {
    this.AdditionalAboutGroup.get('isSpecial')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((isSpecial: boolean) => {
        const specialNeedsTypeControl = this.AdditionalAboutGroup.get('specialNeedsType');
        if (isSpecial) {
          specialNeedsTypeControl.setValidators([Validators.required]);
        } else {
          specialNeedsTypeControl.clearValidators();
          specialNeedsTypeControl.setValue(this.SpecialNeedsType.None);
        }
        specialNeedsTypeControl.updateValueAndValidity();
        this.markFormAsDirtyOnUserInteraction();
      });

    this.AdditionalAboutGroup.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.markFormAsDirtyOnUserInteraction();
      this.passAdditionalAboutGroup.emit(this.AdditionalAboutGroup);
    });
  }

  private markFormAsDirtyOnUserInteraction(): void {
    if (!this.AdditionalAboutGroup.dirty) {
      this.AdditionalAboutGroup.markAsDirty({ onlySelf: true });
    }
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to the FormGroup
   */
  private priceControlListener(): void {
    this.priceRadioBtn.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((isPrice: boolean) => {
      this.markFormAsDirtyOnUserInteraction();
      if (isPrice) {
        this.setPriceControlValue(this.workshopPrice, 'enable');
        this.setPayRateControlValue(this.workshop?.payRate || null, 'enable');
      } else {
        this.setPriceControlValue();
        this.setPayRateControlValue();
      }
      this.priceControl.markAsUntouched();
      this.payRateControl.markAsUntouched();
    });
  }

  private priceValueListener(): void {
    this.priceControl.valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged()).subscribe((value) => {
      if (value) {
        this.payRateControl.markAsTouched();
      } else {
        this.payRateControl.markAsUntouched();
      }
    });
  }
}
