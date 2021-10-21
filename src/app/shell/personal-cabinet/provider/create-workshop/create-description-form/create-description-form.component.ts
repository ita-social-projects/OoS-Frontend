import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Subject } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ENTER } from '@angular/cdk/keycodes';
import { debounceTime, distinctUntilChanged, startWith, takeUntil } from 'rxjs/operators';
import { MetaDataState } from '../../../../../shared/store/meta-data.state';
import { Workshop } from 'src/app/shared/models/workshop.model';
import { Constants } from 'src/app/shared/constants/constants';
@Component({
  selector: 'app-create-description-form',
  templateUrl: './create-description-form.component.html',
  styleUrls: ['./create-description-form.component.scss']
})
export class CreateDescriptionFormComponent implements OnInit {

  readonly constants: typeof Constants = Constants;

  isDirectionIdMarked: boolean = false;

  @Input() workshop: Workshop;

  @Output() passDescriptionFormGroup = new EventEmitter();

  CategoriesFormGroup: FormGroup;
  DescriptionFormGroup: FormGroup;

  keyWordsCtrl: FormControl = new FormControl('', Validators.required);
  separatorKeysCodes: number[] = [ENTER];
  keyWords: string[] = [];
  keyWord: string;
  destroy$: Subject<boolean> = new Subject<boolean>();

  disabilityOptionRadioBtn: FormControl = new FormControl(false);

  constructor(private formBuilder: FormBuilder) {
    this.DescriptionFormGroup = this.formBuilder.group({
      image: new FormControl(''),
      description: new FormControl('', [Validators.maxLength(Constants.MAX_DESCRIPTION_LENGTH), Validators.required]),
      disabilityOptionsDesc: new FormControl({ value: '', disabled: true }),
      head: new FormControl('', Validators.required),
      keyWords: new FormControl('', Validators.required),
      categories: this.formBuilder.group({
          directionId: new FormControl('', Validators.required),
          departmentId: new FormControl('', Validators.required),
          classId: new FormControl('', Validators.required),
        })
    });
  }

  ngOnInit(): void {
    this.onDisabilityOptionCtrlInit();
    this.passDescriptionFormGroup.emit(this.DescriptionFormGroup);
    this.workshop && this.activateEditMode();
  }

  /**
   * This method remove already added key words from the list of key words
   * @param string word
   */
  onRemoveKeyWord(word: string): void {
    if (this.keyWords.indexOf(word) >= 0) {
      this.keyWords.splice(this.keyWords.indexOf(word), 1);
      if (this.keyWords.length) {
        this.DescriptionFormGroup.get('keyWords').setValue([...this.keyWords]);
      } else {
        this.DescriptionFormGroup.get('keyWords').reset();
      }
    }
  }

  onKeyWordsInput(isEditMode: boolean = true): void {
    let inputKeyWord = this.keyWord.trim().toLowerCase();
    if (this.keyWord.trim() !== '' && !this.keyWords.includes(inputKeyWord)) {

      if (this.keyWords.length < 5) {
        this.keyWords.push(inputKeyWord);
      } else {
        this.keyWords.pop();
        this.keyWords.unshift(inputKeyWord);
      }

      this.DescriptionFormGroup.get('keyWords').setValue([...this.keyWords], { emitEvent: isEditMode });
      this.keyWordsCtrl.setValue(null);
      this.keyWord = '';
    } else {
      this.keyWord = '';
    }
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
   * This method makes input enable if radiobutton value is true and sets the value to teh formgroup
   */
  onDisabilityOptionCtrlInit(): void {
    this.disabilityOptionRadioBtn.valueChanges
      .pipe(
        takeUntil(this.destroy$),
      ).subscribe((isDisabilityOptionsDesc: boolean) => {
        isDisabilityOptionsDesc ? this.DescriptionFormGroup.get('disabilityOptionsDesc').enable() : this.DescriptionFormGroup.get('disabilityOptionsDesc').disable();
      });

    this.DescriptionFormGroup.get('disabilityOptionsDesc').valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(100),
      ).subscribe((disabilityOptionsDesc: string) =>
        this.DescriptionFormGroup.get('disabilityOptionsDesc').setValue(disabilityOptionsDesc)
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

    this.disabilityOptionRadioBtn.setValue(this.workshop.withDisabilityOptions, { emitEvent: false });

    if (this.workshop.withDisabilityOptions) {
      this.DescriptionFormGroup.get('disabilityOptionsDesc').enable({ emitEvent: false });
    }
  }
}
