import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, Subject } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { KeyWordsService } from '../../../../../shared/services/key-words/key-words.service';
import { MetaDataState } from '../../../../../shared/store/meta-data.state';
import { KeyWordsList } from '../../../../../shared/store/meta-data.actions';
import { KeyWord } from '../../../../../shared/models/keyWord,model';
@Component({
  selector: 'app-create-description-form',
  templateUrl: './create-description-form.component.html',
  styleUrls: ['./create-description-form.component.scss']
})
export class CreateDescriptionFormComponent implements OnInit {

  DescriptionFormGroup: FormGroup;
  CategoriesFormGroup: FormGroup;

  @Output() passDescriptionFormGroup = new EventEmitter();

  keyWordsCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER];
  keyWords: KeyWord[] = [];
  allkeyWords: KeyWord[] = [];
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Select(MetaDataState.filteredkeyWords)
  filteredkeyWords$: Observable<KeyWordsService[]>;

  @ViewChild('keyWordsInput') keyWordsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private formBuilder: FormBuilder, private store: Store,
    private keyWordsService: KeyWordsService) {
    this.DescriptionFormGroup = this.formBuilder.group({
      image: new FormControl(''),
      description: new FormControl('', [Validators.maxLength(500), Validators.required]),
      withDisabilityOptions: new FormControl(false),
      disabilityOptionsDesc: new FormControl(''),
      head: new FormControl('', Validators.required),
      keyWords: new FormControl(''),
      category: new FormControl(''),
      subcategory: new FormControl(''),
      subsubcategory: new FormControl(''),
    });
    this.DescriptionFormGroup.get('disabilityOptionsDesc').valueChanges.subscribe((val) => {
      if (val) {
        this.DescriptionFormGroup.get('withDisabilityOptions').setValue(true);
      } else {
        this.DescriptionFormGroup.get('withDisabilityOptions').setValue(false);
      }
    })
  }

  ngOnInit(): void {
    this.keyWordsService.getKeyWords()
      .subscribe((data) => {
        this.allkeyWords = data;
      });

    this.keyWordsCtrl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        startWith(''),
      ).subscribe(value => {
        if (value) {
          this.store.dispatch(new KeyWordsList(this._filter(value.trim())));
        } else {
          this.store.dispatch(new KeyWordsList([]));
        };
      });

    this.passDescriptionFormGroup.emit(this.DescriptionFormGroup);
  }

  /**
   * This method remove already added key words from the list of key words
   * @param string word
   */
  onRemoveKeyWord(word: KeyWord): void {
    if (this.keyWords.indexOf(word) >= 0) {
      this.keyWords.splice(this.keyWords.indexOf(word), 1);
      this.allkeyWords.push(word);
    }
  }

  /**
   * This method adds an option from the list of filtered words
   * to the list of added by user key words
   * @param MatAutocompleteSelectedEvent value
   */
  onSelectKeyWord(event: MatAutocompleteSelectedEvent): void {
    if (this.onValidation(event.option.value.keyWord, this.keyWords)) {
      this.keyWords.push(event.option.value);
      this.DescriptionFormGroup.get('keyWords').setValue(this.keyWords);
    }
    this.keyWordsInput.nativeElement.value = '';
    this.keyWordsCtrl.setValue(null);
    this.allkeyWords.splice(this.allkeyWords.indexOf(event.option.value), 1);
  }

  /**
   * This method filters the list of all key words according to the value of input
   * @param string value
   * @returns string[]
   */
  private _filter(value: string): KeyWord[] {
    let filteredKeyWords = this.allkeyWords
      .filter((word: KeyWord) => word.keyWord
        .toLowerCase()
        .startsWith(value.toLowerCase())
      )
      .map((word: KeyWord) => word);
    return filteredKeyWords;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  /**
   * This method checks if the keyWord is already added to the selected key word list
   * @param string value
   * @returns boolean
   */
  onValidation(newWord: string, array: KeyWord[]): boolean {
    return (array.filter((word: KeyWord) => word.keyWord.toLowerCase() === newWord.toLowerCase()).length === 0);
  }

  onReceiveCategoriesFormGroup(categoriesForm: FormGroup): void {
    this.CategoriesFormGroup = categoriesForm;

    this.CategoriesFormGroup.get('category').valueChanges.subscribe(val =>
      (val) && this.DescriptionFormGroup.get('category').setValue(val)
    )
    this.CategoriesFormGroup.get('subcategory').valueChanges.subscribe(val =>
      (val) && this.DescriptionFormGroup.get('subcategory').setValue(val)
    )
    this.CategoriesFormGroup.get('subsubcategory').valueChanges.subscribe(val =>
      (val) && this.DescriptionFormGroup.get('subsubcategory').setValue(val)
    )
  }
}
