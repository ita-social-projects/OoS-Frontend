import { Institution } from './../../../../../shared/models/institution.model';
import { NAME_REGEX } from 'src/app/shared/constants/regex-constants';
import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { CropperConfigurationConstants } from 'src/app/shared/constants/constants';
import { WorkshopSectionItem } from 'src/app/shared/models/workshop.model';
import { Provider } from 'src/app/shared/models/provider.model';
@Component({
  selector: 'app-create-description-form',
  templateUrl: './create-description-form.component.html',
  styleUrls: ['./create-description-form.component.scss'],
})
export class CreateDescriptionFormComponent implements OnInit, OnDestroy {
  readonly validationConstants = ValidationConstants;
  readonly cropperConfig = {
    cropperMinWidth: CropperConfigurationConstants.cropperMinWidth,
    cropperMaxWidth: CropperConfigurationConstants.cropperMaxWidth,
    cropperMinHeight: CropperConfigurationConstants.cropperMinHeight,
    cropperMaxHeight: CropperConfigurationConstants.cropperMaxHeight,
    cropperAspectRatio: CropperConfigurationConstants.galleryImagesCropperAspectRatio,
    croppedHeight: CropperConfigurationConstants.croppedGalleryImage.height,
    croppedFormat: CropperConfigurationConstants.croppedFormat,
    croppedQuality: CropperConfigurationConstants.croppedQuality,
  }

  @Input() workshop: Workshop;
  @Input() isRelease3: boolean;
  @Input() provider: Provider;

  @Output() passDescriptionFormGroup = new EventEmitter();

  @ViewChild('keyWordsInput') keyWordsInputElement: ElementRef;

  DescriptionFormGroup: UntypedFormGroup;
  SectionItemsFormArray = new UntypedFormArray([]);

  keyWordsCtrl: UntypedFormControl = new UntypedFormControl('', Validators.required);
  keyWords: string[] = [];
  keyWord: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  disabilityOptionRadioBtn: UntypedFormControl = new UntypedFormControl(false);
  disabledKeyWordsInput: boolean = false;

  constructor(private formBuilder: UntypedFormBuilder) {
    this.DescriptionFormGroup = this.formBuilder.group({
      imageFiles: new UntypedFormControl(''),
      imageIds: new UntypedFormControl(''),
      disabilityOptionsDesc: new UntypedFormControl({ value: '', disabled: true }, [
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_256),
      ]),
      keyWords: new UntypedFormControl(''),
      institutionHierarchyId: new UntypedFormControl('', Validators.required),
      institutionId: new UntypedFormControl('', Validators.required),
      workshopDescriptionItems: this.SectionItemsFormArray,
    });
  }

  ngOnInit(): void {
    this.onDisabilityOptionCtrlInit();
    this.workshop ? this.activateEditMode() : this.onAddForm();
    this.passDescriptionFormGroup.emit(this.DescriptionFormGroup);
  }

  /**
   * This method remove already added key words from the list of key words
   * @param string word
   */
  onRemoveKeyWord(word: string): void {
    if (this.keyWords.indexOf(word) >= 0) {
      this.disabledKeyWordsInput = false;
      this.keyWords.splice(this.keyWords.indexOf(word), 1);
      if (this.keyWords.length) {
        this.DescriptionFormGroup.get('keyWords').setValue([...this.keyWords]);
      } else {
        this.DescriptionFormGroup.get('keyWords').reset();
      }
    }
  }

  onKeyWordsInput(isEditMode: boolean = true): void {
    this.DescriptionFormGroup.get('keyWords').markAsTouched();
    if (this.keyWord) {
      const inputKeyWord = this.keyWord.trim().toLowerCase();
      if (!!this.keyWord.trim() && !this.keyWords.includes(inputKeyWord)) {
        if (this.keyWords.length < 5) {
          this.keyWords.push(inputKeyWord);
          this.DescriptionFormGroup.get('keyWords').setValue(
            [...this.keyWords],
            { emitEvent: isEditMode }
          );
          this.keyWordsCtrl.setValue(null);
          this.keyWord = '';
        }
        this.disabledKeyWordsInput = this.keyWords.length >= 5;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to teh formgroup
   */
  onDisabilityOptionCtrlInit(): void {
    const setAction = (action: string) =>
      this.DescriptionFormGroup.get('disabilityOptionsDesc')[action]();

    this.disabilityOptionRadioBtn.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDisabilityOptionsDesc: boolean) => {
        isDisabilityOptionsDesc ? setAction('enable') : setAction('disable');
      });
  }

  /**
   * This method fills inputs with information of edited workshop
   */
  private activateEditMode(): void {
    this.DescriptionFormGroup.patchValue(this.workshop, { emitEvent: false });

    this.workshop.keywords.forEach((keyWord: string) => {
      this.keyWord = keyWord;
      this.onKeyWordsInput(false);
    });

    if (this.workshop.withDisabilityOptions) {
      this.disabilityOptionRadioBtn.setValue(this.workshop.withDisabilityOptions, { emitEvent: false });
      this.DescriptionFormGroup.get('disabilityOptionsDesc').enable({ emitEvent: false });
    }

    if (this.workshop.workshopDescriptionItems?.length) {
      this.workshop.workshopDescriptionItems.forEach((item: WorkshopSectionItem) => this.SectionItemsFormArray.push(this.newForm(item)))
    } else {
      this.onAddForm();
    }
  }

  /**
   * This method puts keyWordsInput field in focus
   */
  setFocus(): void {
    this.keyWordsInputElement.nativeElement.focus();
  }

  /**
   * This method creates new FormGroup
   */
  private newForm(item?: WorkshopSectionItem): UntypedFormGroup {
    const EditFormGroup = this.formBuilder.group({
      sectionName: new UntypedFormControl('', [
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_256),
        Validators.required
      ]),
      description: new UntypedFormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_2000),
      ]),
    });

    if (this.workshop) {
      EditFormGroup.addControl('workshopId', this.formBuilder.control(this.workshop.id))
    }

    if (item) {
      EditFormGroup.patchValue(item, { emitEvent: false });
    }

    return EditFormGroup;
  }

  /**
   * This method creates new FormGroup adds new FormGroup to the FormArray
   */
  onAddForm(): void {
    if(this.DescriptionFormGroup.get('workshopDescriptionItems')) {
      (this.DescriptionFormGroup.get('workshopDescriptionItems') as UntypedFormArray).push(
        this.newForm()
      );
    }
  }

  /**
   * This method delete FormGroup from the FormArray by index
   * @param index
   */
  onDeleteForm(index: number): void {
    this.SectionItemsFormArray.removeAt(index);
  }
}
