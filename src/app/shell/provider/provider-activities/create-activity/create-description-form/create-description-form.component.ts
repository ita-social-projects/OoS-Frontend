import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, Subject } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil} from 'rxjs/operators';
import { KeyWordsService } from '../../../../../shared/services/key-words/key-words.service';
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

  separatorKeysCodes: number[] = [ENTER, COMMA];
  keyWords: string[]=[];
  allkeyWords: string[]= [];
  destroy$: Subject<boolean> = new Subject<boolean>();

  @Select(MetaDataState.filteredkeyWords)
  filteredkeyWords$: Observable<string[]>;

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
    this.passDescriptionFormGroup.emit(this.DescriptionFormGroup);
    this.keyWordsService.getKeyWords()
      .subscribe((data)=>{
        this.allkeyWords=data;
    });

    this.DescriptionFormGroup.get('keyWords').valueChanges
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
  }
  /**
   * This method adds input value to the list of added by user key words 
   * if there is no match with list of options
   * @param MatChipInputEvent value 
   */
  onAddKeyWord(event: MatChipInputEvent): void {
    if ((event.value || '').trim()) {
      this.keyWords.push(event.value.trim());
      event.input.value = '';
    }
  }
  /**
   * This method remove already added key words from the list of key words
   * @param string word 
   */
  onRemoveKeyWord(word: string): void {
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
    this.keyWords.push(event.option.viewValue);
    this.keyWordsInput.nativeElement.value = '';
  }
  /**
   * This method filters the list of all key words according to the value of input
   * @param string value
   * @returns string[] 
   */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    let filteredKeyWords = this.allkeyWords.filter(word => word.toLowerCase().startsWith(filterValue));
    return filteredKeyWords;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}
