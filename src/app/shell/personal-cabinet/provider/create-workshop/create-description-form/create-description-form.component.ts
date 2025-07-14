import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { merge, of, Subject, throttleTime } from 'rxjs';
import { filter, map, take, takeUntil } from 'rxjs/operators';
import { ENTER } from '@angular/cdk/keycodes';
import { CropperConfigurationConstants } from 'shared/constants/constants';
import { Tag } from 'shared/models/tag.model';
import { MUST_CONTAIN_LETTERS } from 'shared/constants/regex-constants';
import { ValidationConstants } from 'shared/constants/validation';
import { Provider } from 'shared/models/provider.model';
import { Workshop, WorkshopDescriptionItem } from 'shared/models/workshop.model';
import { Coverage, FormOfLearning } from 'shared/enum/workshop';
import { CoverageEnum, FormOfLearningEnum } from 'shared/enum/enumUA/workshop';
import { Util } from 'shared/utils/utils';
import { TagService } from 'shared/services/workshops/tag-workshop/tag-workshop.service';
import { maxArrayLength, minArrayLength } from 'shared/validators/array-length/array-length-validator';
import { Direction } from 'shared/models/category.model';
import { ShowMessageBar } from 'shared/store/app.actions';
import { Store } from '@ngxs/store';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { MetaDataState } from 'shared/store/meta-data.state';

@Component({
  selector: 'app-create-description-form',
  templateUrl: './create-description-form.component.html',
  styleUrls: ['./create-description-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateDescriptionFormComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() public workshop: Workshop;
  @Input() public isImagesFeature: boolean;
  @Input() public provider: Provider;

  @Output() public passDescriptionFormGroup = new EventEmitter();

  @ViewChild('keyWordsInput') public keyWordsInputElement: ElementRef;

  public readonly validationConstants = ValidationConstants;
  public readonly FormOfLearning = FormOfLearning;
  public readonly FormOfLearningEnum = FormOfLearningEnum;
  public readonly Util = Util;
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

  // Variables for selects
  public readonly CoverageEnum = CoverageEnum;
  public readonly Coverage = Coverage;

  public DescriptionFormGroup: FormGroup;
  public EditFormGroup: FormGroup;
  public SectionItemsFormArray = new FormArray([]);
  public keyWordsCtrl: FormControl = new FormControl('');

  public isTagsFeatureEnabled: boolean = false;
  public keyWords: string[] = [];
  public tags: Tag[] = [];
  public separatorKeysCodes = [ENTER];

  public tagsControl: FormControl;

  protected readonly ValidationConstants = ValidationConstants;

  private readonly destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly tagService: TagService,
    private readonly store: Store,
    private readonly translateService: TranslateService,
    private readonly route: ActivatedRoute
  ) {
    this.DescriptionFormGroup = this.formBuilder.group({
      imageFiles: new FormControl('', [Validators.required, minArrayLength(1), maxArrayLength(10)]),
      imageIds: new FormControl(''),
      keyWords: new FormControl(null),
      workshopDescriptionItems: this.SectionItemsFormArray,
      competitiveSelection: new FormControl(false),
      competitiveSelectionDescription: new FormControl({ value: '', disabled: true }, [
        Validators.required,
        Validators.pattern(MUST_CONTAIN_LETTERS)
      ]),
      enrollmentProcedureDescription: new FormControl('', [
        Validators.minLength(ValidationConstants.INPUT_LENGTH_1),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_2000),
        Validators.pattern(MUST_CONTAIN_LETTERS)
      ]),
      coverage: new FormControl(this.Coverage.School)
    });
  }

  public compareItems(item1: Direction, item2: Direction): boolean {
    return item1.id === item2.id;
  }

  public ngOnInit(): void {
    this.initTags();

    if (this.workshop) {
      this.activateEditMode();
    } else {
      this.onAddForm();
    }

    this.passDescriptionFormGroup.emit(this.DescriptionFormGroup);
    this.keyWordsListener();

    this.onCompetitiveSelectionInit();
  }

  public ngAfterViewInit(): void {
    this.updateKeywordsInputState();
  }

  /**
   * This method remove already added keywords from the list of keywords
   * @param word
   */
  public onRemoveKeyWord(word: string): void {
    if (this.keyWords.includes(word)) {
      this.keyWords = this.keyWords.filter((kw) => kw !== word);
      this.updateKeywordsInputState();
      if (this.keyWords.length) {
        this.DescriptionFormGroup.get('keyWords').setValue(this.keyWords);
      } else {
        this.DescriptionFormGroup.get('keyWords').reset();
      }
    }
  }

  public onRemoveItem(tag: Tag): void {
    const currentTags = this.tagsControl.value || [];
    const updatedTags = currentTags.filter((t) => t.id !== tag.id);
    this.tagsControl.setValue(updatedTags);
    this.updateTagIds(updatedTags);
  }

  public onKeyWordsInput(isEditMode: boolean = true): void {
    this.DescriptionFormGroup.get('keyWords').markAsTouched();
    const inputKeyWord = this.keyWordsCtrl.value?.trim().toLowerCase();
    if (inputKeyWord && !this.keyWords.includes(inputKeyWord)) {
      if (this.keyWords.length < this.validationConstants.MAX_KEYWORDS_LENGTH) {
        this.keyWords = [...this.keyWords, inputKeyWord];
        this.updateKeywordsInputState();
        this.DescriptionFormGroup.get('keyWords').setValue(this.keyWords, { emitEvent: isEditMode });
        this.keyWordsCtrl.setValue('');
      }
    }
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
   * This method listens for changes in the 'keyWords' control and marks
   * the form as 'dirty' whenever there are changes in the key words.
   */
  public keyWordsListener(): void {
    this.DescriptionFormGroup.get('keyWords')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.markFormAsDirtyOnUserInteraction();
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
    this.markFormAsDirtyOnUserInteraction();
  }

  /**
   * This method fills inputs with information of edited workshop
   */
  public activateEditMode(): void {
    this.DescriptionFormGroup.patchValue(this.workshop, { emitEvent: false });

    this.workshop.keywords?.forEach((keyWord: string) => {
      this.keyWordsCtrl.setValue(keyWord);
      this.onKeyWordsInput(false);
    });

    if (this.workshop.workshopDescriptionItems?.length) {
      this.workshop.workshopDescriptionItems.forEach((item: WorkshopDescriptionItem) => {
        const itemFrom = this.newForm(item);
        this.SectionItemsFormArray.controls.push(itemFrom);
        // eslint-disable-next-line dot-notation, @typescript-eslint/dot-notation
        this.SectionItemsFormArray['_registerControl'](itemFrom);
      });
    } else {
      this.onAddForm();
    }

    if (this.workshop.competitiveSelection) {
      this.DescriptionFormGroup.get('competitiveSelectionDescription')?.enable();
    }

    if (this.route.snapshot.paramMap.get('entity') === 'workshop') {
      this.listenToChanges();
    }
  }

  private onCompetitiveSelectionInit(): void {
    this.DescriptionFormGroup.get('competitiveSelection')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: boolean) => {
        if (value) {
          this.DescriptionFormGroup.get('competitiveSelectionDescription').enable();
        } else {
          this.DescriptionFormGroup.get('competitiveSelectionDescription').markAsUntouched();
          this.DescriptionFormGroup.get('competitiveSelectionDescription').disable();
        }
      });
  }

  /**
   * This method creates new FormGroup
   */
  private newForm(item?: WorkshopDescriptionItem): FormGroup {
    this.EditFormGroup = this.formBuilder.group({
      sectionName: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.INPUT_LENGTH_100),
        Validators.pattern(MUST_CONTAIN_LETTERS)
      ]),
      description: new FormControl('', [
        Validators.required,
        Validators.minLength(ValidationConstants.INPUT_LENGTH_3),
        Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_2000),
        Validators.pattern(MUST_CONTAIN_LETTERS)
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

  private initTags(): void {
    this.store
      .select(MetaDataState.featuresList)
      .pipe(
        take(1),
        map((fl) => fl.enableWorkshopTags),
        filter(Boolean)
      )
      .subscribe(() => {
        this.isTagsFeatureEnabled = true;

        this.DescriptionFormGroup.addControl(
          'tagIds',
          new FormControl<number[]>(null, [
            Validators.required,
            minArrayLength(ValidationConstants.MIN_TAGS_LENGTH),
            maxArrayLength(ValidationConstants.MAX_TAGS_LENGTH)
          ])
        );

        this.tagsControl = new FormControl<Tag[]>(
          [],
          [Validators.required, minArrayLength(ValidationConstants.MIN_TAGS_LENGTH), maxArrayLength(ValidationConstants.MAX_TAGS_LENGTH)]
        );

        this.overrideTouchForForm(this.DescriptionFormGroup.get('tagIds') as FormControl);

        this.tagsControl.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((selectedTags: Tag[]) => {
          this.updateTagIds(selectedTags || []);
        });

        this.tagService
          .getTags()
          .pipe(take(1))
          .subscribe((tags) => {
            this.tags = tags;
            this.tagsControl.setValue(this.tags.filter((tag) => (this.workshop?.tagIds ?? []).includes(tag.id)));
          });
      });
  }

  /**
   * This method makes DescriptionFormGroup dirty
   */
  private markFormAsDirtyOnUserInteraction(): void {
    if (!this.DescriptionFormGroup.dirty) {
      this.DescriptionFormGroup.markAsDirty({ onlySelf: true });
    }
  }

  private updateTagIds(tags: Tag[]): void {
    const tagIds = tags.map((tag) => tag.id);
    this.DescriptionFormGroup.get('tagIds')?.setValue(tagIds);
    this.DescriptionFormGroup.get('tagIds')?.markAsDirty();
  }

  private updateKeywordsInputState(): void {
    if (this.keyWords.length >= this.validationConstants.MAX_KEYWORDS_LENGTH) {
      this.keyWordsCtrl.disable({ emitEvent: false });
    } else {
      this.keyWordsCtrl.enable({ emitEvent: false });
    }
  }

  // the code below allows subscribing to a touch event for control
  // TODO: rewrite after migration to Angular 18, so that can be done without overriding the method
  private overrideTouchForForm(formControl: FormControl): void {
    const originalMethod = formControl.markAsTouched;
    formControl.markAsTouched = (): void => {
      originalMethod.apply(formControl);
      this.tagsControl.markAsTouched(); // to mark as touched another control which represents this in template
      (formControl.statusChanges as EventEmitter<any>).emit();
    };
  }

  private listenToChanges(): void {
    merge(
      ...['imageFiles', 'workshopDescriptionItems', 'competitiveSelectionDescription', 'keyWords', 'enrollmentProcedureDescription'].map(
        (controlName) =>
          this.DescriptionFormGroup.get(controlName)?.valueChanges.pipe(
            throttleTime(5000, undefined, {
              leading: true,
              trailing: false
            })
          ) ?? of()
      )
    )
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.store.dispatch(
          new ShowMessageBar({
            message: this.translateService.instant('SERVICE_MESSAGES.SNACK_BAR_TEXT.CHANGE_REQUIRES_MODERATION'),
            type: 'warningYellow'
          })
        );
      });
  }
}
