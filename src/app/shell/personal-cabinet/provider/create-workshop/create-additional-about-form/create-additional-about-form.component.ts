import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngxs/store';
import { TranslateService } from '@ngx-translate/core';
import { Subject, throttleTime } from 'rxjs';
import { distinctUntilChanged, filter, takeUntil } from 'rxjs/operators';
import { AgeComposition, EducationalShift, GroupType, PayRateType, SpecialNeedsType } from 'shared/enum/workshop';
import {
  AgeCompositionEnum,
  EducationalShiftEnum,
  GroupTypeEnum,
  PayRateTypeEnum,
  SpecialNeedsTypeEnum
} from 'shared/enum/enumUA/workshop';
import { Workshop } from 'shared/models/workshop.model';
import { Provider } from 'shared/models/provider.model';
import { ValidationConstants } from 'shared/constants/validation';
import { ShowMessageBar } from 'shared/store/app.actions';
import { MetaDataState } from 'shared/store/meta-data.state';
import { GetAllInstitutions } from 'shared/store/meta-data.actions';
import { Constants } from 'shared/constants/constants';
import { MUST_CONTAIN_LETTERS } from 'shared/constants/regex-constants';

@Component({
  selector: 'app-create-additional-about-form',
  templateUrl: './create-additional-about-form.component.html',
  styleUrls: ['./create-additional-about-form.component.scss']
})
export class CreateAdditionalAboutFormComponent implements OnInit, OnDestroy {
  @Input() public workshop: Workshop;
  @Input() public provider: Provider;
  @Output() public passAdditionalAboutGroup = new EventEmitter<FormGroup>();
  public showChampionsPathCheckbox = false;
  public AdditionalAboutGroup: FormGroup;
  public priceRadioBtn: FormControl = new FormControl(false);

  public isMinSportSelected = false;

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

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly store: Store,
    private readonly translateService: TranslateService,
    private readonly route: ActivatedRoute
  ) {
    this.initializeForm();
  }

  public get priceControl(): FormControl {
    return this.AdditionalAboutGroup.get('price') as FormControl;
  }

  public get payRateControl(): FormControl {
    return this.AdditionalAboutGroup.get('payRate') as FormControl;
  }

  public get areThereBenefitsControl(): FormControl {
    return this.AdditionalAboutGroup.get('areThereBenefits') as FormControl;
  }

  public get preferentialTermsOfParticipationControl(): FormControl {
    return this.AdditionalAboutGroup.get('preferentialTermsOfParticipation') as FormControl;
  }

  private get workshopPrice(): number {
    return this.workshop?.price ? (this.workshop.price as number) : null;
  }

  public onInstitutionSubordinationChange(isMinSport: boolean): void {
    this.isMinSportSelected = isMinSport;
    this.showChampionsPathCheckbox = isMinSport;
    this.handleMinSportChange(isMinSport);
  }

  public ngOnInit(): void {
    if (this.workshop) {
      this.activateEditMode();
    }

    this.priceControlListener();
    this.priceValueListener();
    this.listenToBenefitsChanges();
    this.passAdditionalAboutGroup.emit(this.AdditionalAboutGroup);
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  public activateEditMode(): void {
    this.AdditionalAboutGroup.patchValue(
      {
        isSelfFinanced: this.workshop.isSelfFinanced || false,
        isInclusive: this.workshop.isInclusive || false,
        specialNeedsType: this.workshop.specialNeedsType || this.SpecialNeedsType.None,
        educationalShift: this.workshop.educationalShift || EducationalShift.First,
        ageComposition: this.workshop.ageComposition || AgeComposition.SameAge,
        payRate: this.workshop.payRate,
        price: this.workshop.price,
        areThereBenefits: this.workshop.areThereBenefits || false,
        preferentialTermsOfParticipation: this.workshop.preferentialTermsOfParticipation,
        institutionHierarchyId: this.workshop.institutionHierarchyId || '',
        institutionId: this.workshop.institutionId || '',
        isChampionPath: this.workshop.isChampionPath || false,
        workshopType: this.workshop.workshopType || GroupType.Workshop
      },
      { emitEvent: false }
    );
    this.checkIfMinSport();
    this.handlePriceChange();
    if (!this.route.snapshot.paramMap.has('entity')) {
      this.listenToChanges();
    }
  }

  private initializeForm(): void {
    this.AdditionalAboutGroup = this.formBuilder.group({
      isSelfFinanced: new FormControl(false),
      isInclusive: new FormControl(false),
      specialNeedsType: new FormControl(this.SpecialNeedsType.None),
      educationalShift: new FormControl(this.EducationalShift.First, Validators.required),
      ageComposition: new FormControl(this.AgeComposition.SameAge, Validators.required),
      workshopType: new FormControl(this.GroupType.Workshop, Validators.required),
      price: new FormControl({ value: null, disabled: true }, [
        Validators.required,
        Validators.min(ValidationConstants.MIN_PRICE),
        Validators.max(ValidationConstants.MAX_PRICE)
      ]),
      payRate: new FormControl({ value: PayRateType.None, disabled: true }, [Validators.required]),
      areThereBenefits: new FormControl(false),
      preferentialTermsOfParticipation: new FormControl('', [
        Validators.minLength(ValidationConstants.MIN_DESCRIPTION_LENGTH_3),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500),
        Validators.pattern(MUST_CONTAIN_LETTERS)
      ]),
      institutionHierarchyId: new FormControl('', Validators.required),
      institutionId: new FormControl('', Validators.required),
      isChampionPath: new FormControl(false)
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

  private markFormAsDirtyOnUserInteraction(): void {
    if (!this.AdditionalAboutGroup.dirty) {
      this.AdditionalAboutGroup.markAsDirty({ onlySelf: true });
    }
  }

  private handleMinSportChange(isMinSport: boolean): void {
    const workshopTypeControl = this.AdditionalAboutGroup.get('workshopType');
    const championsPathControl = this.AdditionalAboutGroup.get('isChampionPath');

    if (isMinSport) {
      workshopTypeControl.setValue(GroupType.Section, { emitEvent: false });
      workshopTypeControl.disable({ emitEvent: false });
    } else {
      workshopTypeControl.enable({ emitEvent: false });

      if (!this.workshop) {
        workshopTypeControl.setValue(GroupType.Workshop, { emitEvent: false });
      }
      championsPathControl.setValue(false, { emitEvent: false });
    }
  }

  private handlePriceChange(): void {
    if (this.workshop.price) {
      this.setPriceControlValue(this.workshop.price as number, 'enable', false);
      this.setPayRateControlValue(this.workshop.payRate, 'enable', false);
      this.priceRadioBtn.setValue(true);
    } else {
      this.setPriceControlValue(null, 'disable', false);
      this.setPayRateControlValue(PayRateType.None, 'disable', false);
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
        this.areThereBenefitsControl.setValue(false);
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

  private listenToChanges(): void {
    this.AdditionalAboutGroup.get('preferentialTermsOfParticipation')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        throttleTime(5000, undefined, {
          leading: true,
          trailing: false
        })
      )
      .subscribe(() => {
        this.store.dispatch(
          new ShowMessageBar({
            message: this.translateService.instant('SERVICE_MESSAGES.SNACK_BAR_TEXT.CHANGE_REQUIRES_MODERATION'),
            type: 'warningYellow'
          })
        );
      });
  }

  private listenToBenefitsChanges(): void {
    this.areThereBenefitsControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((value: boolean) => {
      if (value) {
        this.preferentialTermsOfParticipationControl.addValidators(Validators.required);
      } else {
        this.preferentialTermsOfParticipationControl.removeValidators(Validators.required);
        this.preferentialTermsOfParticipationControl.setValue('');
      }
      this.preferentialTermsOfParticipationControl.updateValueAndValidity();
      this.preferentialTermsOfParticipationControl.markAsUntouched();
    });
  }

  private checkIfMinSport(): void {
    const institutionId = this.AdditionalAboutGroup.get('institutionId')?.value;

    if (!institutionId) {
      return;
    }

    this.store.dispatch(new GetAllInstitutions(false));

    this.store
      .select(MetaDataState.institutions)
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe((institutions) => {
        const matchedInstitution = institutions.find((institution) => institution.id === institutionId);
        const isMinSport = matchedInstitution?.title?.trim().toLowerCase() === Constants.MIN_SPORT;
        this.onInstitutionSubordinationChange(isMinSport);
      });
  }
}
