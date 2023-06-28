import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import {
  Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { CropperConfigurationConstants } from '../../../../../shared/constants/constants';
import { ValidationConstants } from '../../../../../shared/constants/validation';
import { Provider } from '../../../../../shared/models/provider.model';
import { Workshop, WorkshopSectionItem } from '../../../../../shared/models/workshop.model';

@Component({
  selector: 'app-create-description-form',
  templateUrl: './create-description-form.component.html',
  styleUrls: ['./create-description-form.component.scss']
})
export class CreateDescriptionFormComponent implements OnInit, OnDestroy {
  public readonly validationConstants = ValidationConstants;
  public readonly cropperConfig = {
    cropperMinWidth: CropperConfigurationConstants.cropperMinWidth,
    cropperMaxWidth: CropperConfigurationConstants.cropperMaxWidth,
    cropperMinHeight: CropperConfigurationConstants.cropperMinHeight,
    cropperMaxHeight: CropperConfigurationConstants.cropperMaxHeight,
    cropperAspectRatio: CropperConfigurationConstants.galleryImagesCropperAspectRatio,
    croppedHeight: CropperConfigurationConstants.croppedGalleryImage.height,
    croppedFormat: CropperConfigurationConstants.croppedFormat,
    croppedQuality: CropperConfigurationConstants.croppedQuality
  };

  @Input() public workshop: Workshop;
  @Input() public isImagesFeature: boolean;
  @Input() public provider: Provider;

  @Output() public passDescriptionFormGroup = new EventEmitter();

  @ViewChild('keyWordsInput') public keyWordsInputElement: ElementRef;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  public DescriptionFormGroup: FormGroup;
  public EditFormGroup: FormGroup;
  public SectionItemsFormArray = new FormArray([]);
  public keyWordsCtrl: FormControl = new FormControl('', Validators.required);

  public keyWords: string[] = [];
  public keyWord: string;

  public disabilityOptionRadioBtn: FormControl = new FormControl(false);
  public disabledKeyWordsInput = false;

  constructor(private formBuilder: FormBuilder) {
    this.DescriptionFormGroup = this.formBuilder.group({
      imageFiles: new FormControl(''),
      imageIds: new FormControl(''),
      disabilityOptionsDesc: new FormControl({ value: '', disabled: true }, [
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_256)
      ]),
      keyWords: new FormControl(''),
      institutionHierarchyId: new FormControl('', Validators.required),
      institutionId: new FormControl('', Validators.required),
      workshopDescriptionItems: this.SectionItemsFormArray
    });
  }

  public ngOnInit(): void {
    this.onDisabilityOptionCtrlInit();
    this.workshop ? this.activateEditMode() : this.onAddForm();
    this.passDescriptionFormGroup.emit(this.DescriptionFormGroup);
  }

  /**
   * This method remove already added key words from the list of key words
   * @param string word
   */
  public onRemoveKeyWord(word: string): void {
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

  public onKeyWordsInput(isEditMode: boolean = true): void {
    this.DescriptionFormGroup.get('keyWords').markAsTouched();
    if (this.keyWord) {
      const inputKeyWord = this.keyWord.trim().toLowerCase();
      if (!!this.keyWord.trim() && !this.keyWords.includes(inputKeyWord)) {
        if (this.keyWords.length < 5) {
          this.keyWords.push(inputKeyWord);
          this.DescriptionFormGroup.get('keyWords').setValue([...this.keyWords], { emitEvent: isEditMode });
          this.keyWordsCtrl.setValue(null);
          this.keyWord = '';
        }
        this.disabledKeyWordsInput = this.keyWords.length >= 5;
      }
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to teh formgroup
   */
  public onDisabilityOptionCtrlInit(): void {
    const setAction = (action: string) => this.DescriptionFormGroup.get('disabilityOptionsDesc')[action]();

    this.disabilityOptionRadioBtn.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((isDisabilityOptionsDesc: boolean) => {
      isDisabilityOptionsDesc ? setAction('enable') : setAction('disable');
    });
  }

  /**
   * This method puts keyWordsInput field in focus
   */
  public setFocus(): void {
    this.keyWordsInputElement.nativeElement.focus();
  }

  /**
   * This method creates new FormGroup adds new FormGroup to the FormArray
   */
  public onAddForm(): void {
    if (this.DescriptionFormGroup.get('workshopDescriptionItems')) {
      (this.DescriptionFormGroup.get('workshopDescriptionItems') as FormArray).push(this.newForm());
    }
  }

  /**
   * This method delete FormGroup from the FormArray by index
   * @param index
   */
  public onDeleteForm(index: number): void {
    this.SectionItemsFormArray.removeAt(index);
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
      this.workshop.workshopDescriptionItems.forEach((item: WorkshopSectionItem) => {
        const itemFrom = this.newForm(item);
        this.SectionItemsFormArray.controls.push(itemFrom);
        this.SectionItemsFormArray['_registerControl'](itemFrom);
      });
    } else {
      this.onAddForm();
    }
  }

  /**
   * This method creates new FormGroup
   */
  private newForm(item?: WorkshopSectionItem): FormGroup {
    this.EditFormGroup = this.formBuilder.group({
      sectionName: new FormControl('', [
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_256),
        Validators.required
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_2000)
      ])
    });

    if (this.workshop) {
      this.EditFormGroup.addControl('workshopId', this.formBuilder.control(this.workshop.id));
    }

    if (item) {
      this.EditFormGroup.patchValue(item, { emitEvent: false });
    }

    return this.EditFormGroup;
  }
}
