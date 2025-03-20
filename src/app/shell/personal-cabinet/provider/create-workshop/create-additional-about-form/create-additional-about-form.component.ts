import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AgeComposition, EducationalShift, SpecialNeedsType, WorkshopType } from 'shared/enum/workshop';
import { AgeCompositionEnum, EducationalShiftEnum, SpecialNeedsTypeEnum, WorkshopTypeEnum } from 'shared/enum/enumUA/workshop';
import { Workshop } from 'shared/models/workshop.model';
import { Provider } from 'shared/models/provider.model';

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

  protected readonly SpecialNeedsType = SpecialNeedsType;
  protected readonly SpecialNeedsTypeEnum = SpecialNeedsTypeEnum;
  protected readonly EducationalShiftEnum = EducationalShiftEnum;
  protected readonly EducationalShift = EducationalShift;
  protected readonly AgeCompositionEnum = AgeCompositionEnum;
  protected readonly AgeComposition = AgeComposition;
  protected readonly WorkshopType = WorkshopType;
  protected readonly WorkshopTypeEnum = WorkshopTypeEnum;

  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private readonly formBuilder: FormBuilder) {
    this.initializeForm();
  }

  public ngOnInit(): void {
    if (this.workshop) {
      this.activateEditMode();
    }

    this.setupFormValidation();
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
        educationalShift: this.workshop.educationalShift,
        ageComposition: this.workshop.ageComposition,
        workshopType: this.workshop.workshopType
      },
      { emitEvent: false }
    );
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
      workshopType: new FormControl(this.WorkshopType.None, Validators.required)
    });
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
}
