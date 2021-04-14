import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, Subject } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil} from 'rxjs/operators';
import { keyWord, KeyWordsService } from '../../../../../shared/services/key-words/key-words.service';
import { MetaDataState } from '../../../../../shared/store/meta-data.state';
import { KeyWordsList } from '../../../../../shared/store/meta-data.actions';

@Component({
  selector: 'app-create-description-form',
  templateUrl: './create-description-form.component.html',
  styleUrls: ['./create-description-form.component.scss', './../../../validation.component.scss']
})
export class CreateDescriptionFormComponent implements OnInit {
  
  DescriptionFormGroup: FormGroup;
  @Output() passDescriptionFormGroup = new EventEmitter();

  keyWordsCtrl = new FormControl();
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keyWords: keyWord[]=[];
  allkeyWords: keyWord[]= [];
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Select(MetaDataState.filteredkeyWords)
  filteredkeyWords$: Observable<keyWord[]>;

  @ViewChild('keyWordsInput') keyWordsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private formBuilder: FormBuilder, private store: Store,
    private keyWordsService: KeyWordsService) {
    this.DescriptionFormGroup = this.formBuilder.group({
      photos: new FormControl(''),
      description: new FormControl(''), 
      resources: new FormControl(''),
      direction: new FormControl(''),
      head: new FormControl(''),
      keyWords: new FormControl(''),
    });
   }

  ngOnInit(): void {
      this.keyWordsService.getKeyWords()
      .subscribe((data)=>{
        this.allkeyWords=data;
    });

    this.keyWordsCtrl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(300),
        distinctUntilChanged(),
        startWith(''),   
      ).subscribe(value => {
        if (value) {
          this.store.dispatch(new KeyWordsList(this._filter(value)));
        }else{
          this.store.dispatch(new KeyWordsList([]));
        };
      });

      this.passDescriptionFormGroup.emit(this.DescriptionFormGroup);
  }
  /**
   * This method adds input value to the list of added by user key words 
   * if there is no match with list of options. 
   * The new word adds to the list of all key words and to the list of selected key Words
   * @param MatChipInputEvent value 
   */
  onAddKeyWord(event: MatChipInputEvent): void {
    if ((event.value || '').trim()) {
      let newKeyWord: keyWord ={
        id: null,
        keyWord: event.value.trim()
      }
      this.allkeyWords.push(newKeyWord); 
      this.keyWords.push(newKeyWord); 
      event.input.value = '';
    }

    if (event.input) {
      event.input.value = '';
    }

    this.keyWordsCtrl.setValue(null);
  }
  /**
   * This method remove already added key words from the list of key words
   * @param string word 
   */
  onRemoveKeyWord(word: keyWord): void {
    if (this.keyWords.indexOf(word) >= 0) {
      this.keyWords.splice(this.keyWords.indexOf(word), 1);
    }
  }
  /**
   * This method adds an option from the list of filtered words 
   * to the list of added by user key words
   * @param MatAutocompleteSelectedEvent value 
   */
  onSelectKeyWord(event: MatAutocompleteSelectedEvent): void {
    this.keyWords.push(event.option.value);
    this.DescriptionFormGroup.get('keyWords').setValue(this.keyWords);
    this.keyWordsCtrl.setValue(null);
  }
  /**
   * This method filters the list of all key words according to the value of input
   * @param string value
   * @returns string[] 
   */
   private _filter(value: string): keyWord[] {
      let filteredKeyWords =  this.allkeyWords
      .filter(word => word.keyWord
        .toLowerCase()
        .startsWith(value.toLowerCase())
      )
      .map(word=> word);
     return filteredKeyWords;
  }
  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
