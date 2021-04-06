import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent } from '@angular/material/chips';
import { map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-create-description-form',
  templateUrl: './create-description-form.component.html',
  styleUrls: ['./create-description-form.component.scss']
})
export class CreateDescriptionFormComponent implements OnInit {
  
  DescriptionFormGroup: FormGroup;
  @Output() descriptionFormGroup = new EventEmitter();

  separatorKeysCodes: number[] = [ENTER, COMMA];
  filteredKeyWords: Observable<string[]>;
  keyWords: string[]=['Спорт'];
  allkeyWords: string[] = ['Спорт', 'Танці', 'Музика', 'Мистецтво', 'Наука'];

  @ViewChild('keyWordsInput') keyWordsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private formBuilder: FormBuilder) {
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
    this.descriptionFormGroup.emit(this.DescriptionFormGroup);

    this.filteredKeyWords = this.DescriptionFormGroup.get('keyWords').valueChanges.pipe(
      startWith(''),
      map((keyWord: string | null) => keyWord ? this._filter(keyWord) : this.allkeyWords.slice()));
  }

  addKeyWord(event: MatChipInputEvent): void {
    if ((event.value || '').trim()) {
      this.keyWords.push(event.value.trim());
    }
    if (event.input) {
      event.input.value = '';
    }
  }

  removeKeyWord(word: string): void {
    if (this.keyWords.indexOf(word) >= 0) {
      this.keyWords.splice(this.keyWords.indexOf(word), 1);
    }
  }

  selectedKeyWord(event: MatAutocompleteSelectedEvent): void {
    this.keyWords.push(event.option.viewValue);
    this.keyWordsInput.nativeElement.value = '';
  }

  private _filter(value: string): string[] {
    return this.allkeyWords.filter(word => word.toLowerCase().indexOf(value.toLowerCase()) === 0);
  }

}
