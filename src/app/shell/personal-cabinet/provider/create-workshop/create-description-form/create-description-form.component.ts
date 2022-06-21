import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil, takeWhile } from 'rxjs/operators';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { ValidationConstants } from 'src/app/shared/constants/validation';
import { WorkshopSectionItem } from 'src/app/shared/models/workshop.model';
@Component({
  selector: 'app-create-description-form',
  templateUrl: './create-description-form.component.html',
  styleUrls: ['./create-description-form.component.scss'],
})
export class CreateDescriptionFormComponent implements OnInit, OnDestroy {
  readonly validationConstants = ValidationConstants;

  @Input() workshop: Workshop;
  @Input() isRelease2: boolean;

  @Output() passDescriptionFormGroup = new EventEmitter();

  @ViewChild('keyWordsInput') keyWordsInputElement: ElementRef;

  CategoriesFormGroup: FormGroup;
  DescriptionFormGroup: FormGroup;
  SectionItemsFormArray = new FormArray([]);

  keyWordsCtrl: FormControl = new FormControl('', Validators.required);
  keyWords: string[] = [];
  keyWord: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  disabilityOptionRadioBtn: FormControl = new FormControl(false);
  disabledKeyWordsInput: boolean = false;

  constructor(private formBuilder: FormBuilder) {
    this.DescriptionFormGroup = this.formBuilder.group({
      imageFiles: new FormControl(''),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_500),
      ]),
      disabilityOptionsDesc: new FormControl({ value: '', disabled: true }, [
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_256),
      ]),
      keyWords: new FormControl(''),
      categories: this.formBuilder.group({
        directionId: new FormControl('', Validators.required),
        departmentId: new FormControl('', Validators.required),
        classId: new FormControl('', Validators.required),
      }),
      workshopDescriptionItems: this.SectionItemsFormArray,
    });
  }

  ngOnInit(): void {
    this.onDisabilityOptionCtrlInit();
    this.workshop && this.activateEditMode();
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

    this.DescriptionFormGroup.get('disabilityOptionsDesc')
      .valueChanges.pipe(takeUntil(this.destroy$), debounceTime(100))
      .subscribe((disabilityOptionsDesc: string) =>
        this.DescriptionFormGroup.get('disabilityOptionsDesc').setValue(
          disabilityOptionsDesc
        )
      );
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

    this.disabilityOptionRadioBtn.setValue(
      this.workshop.withDisabilityOptions,
      { emitEvent: false }
    );

    if (this.workshop.withDisabilityOptions) {
      this.DescriptionFormGroup.get('disabilityOptionsDesc').enable({
        emitEvent: false,
      });
    }

    if (this.workshop.imageIds) {
      this.DescriptionFormGroup.addControl(
        'imageIds',
        this.formBuilder.control(this.workshop.imageIds)
      );
    }
    if (this.workshop.workshopSectionItems?.length) {
      this.workshop.workshopSectionItems.forEach((item: WorkshopSectionItem) => this.SectionItemsFormArray.push(this.newForm(item)))
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
  private newForm(item?: WorkshopSectionItem): FormGroup {
    const EditFormGroup = this.formBuilder.group({
      sectionName: new FormControl('', [Validators.required]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_2000),
      ]),
    });

    if (item) {
      EditFormGroup.addControl(
        'workshopId',
        this.formBuilder.control(item.workshopId)
      );
      EditFormGroup.patchValue(item, { emitEvent: false });
    }

    return EditFormGroup;
  }

  /**
   * This method creates new FormGroup adds new FormGroup to the FormArray
   */
  onAddForm(): void {
    (this.DescriptionFormGroup.get('workshopDescriptionItems') as FormArray).push(
      this.newForm()
    );
  }

  /**
   * This method delete FormGroup from the FormArray by index
   * @param index
   */
  onDeleteForm(index: number): void {
    this.SectionItemsFormArray.removeAt(index);
  }

}
