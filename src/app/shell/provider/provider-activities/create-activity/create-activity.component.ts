import { HttpClient } from '@angular/common/http';
import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { Workshop } from 'src/app/shared/models/workshop.model';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';



@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.scss']
})
export class CreateActivityComponent implements OnInit {

  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  keyWordsCtrl = new FormControl();
  filteredKeyWords: Observable<string[]>;
  keyWords: string[] = ['Театр'];
  allkeyWords: string[] = ['Спорт', 'Танці', 'Музика', 'Мистецтво', 'Наука'];

  workshop;
  url='/Workshop/Create';

  WorkshopFormArray: FormArray;
  AboutFormGroup: FormGroup;
  DescriptionFormGroup: FormGroup;
  ContactsFormGroup: FormGroup;

  @ViewChild('keyWordsInput') keyWordsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {

    this.filteredKeyWords = this.keyWordsCtrl.valueChanges.pipe(
      startWith(null),
      map((keyWord: string | null) => keyWord ? this._filter(keyWord) : this.allkeyWords.slice()));

    
    this.AboutFormGroup = this.formBuilder.group({
      type: new FormControl(''),
      title: new FormControl(''), 
      phone: new FormControl(''),
      email: new FormControl(''),
      ageFrom: new FormControl(''),
      ageTo: new FormControl(''),
      classAmount: new FormControl('')
    });
    this.DescriptionFormGroup = this.formBuilder.group({
      photos: new FormControl(''),
      description: new FormControl(''), 
      resources: new FormControl(''),
      direction: new FormControl(''),
      keyWords: new FormControl(''),
    });
    this.ContactsFormGroup = this.formBuilder.group({
      city: new FormControl(''),
      street: new FormControl(''), 
      building: new FormControl('')
    });
  }
  
  ngOnInit() {

  }

  onSubmit() {
    const about = this.AboutFormGroup.value;
    const description = this.DescriptionFormGroup.value;
    description.keyWords = this.keyWords;
    const contacts = this.ContactsFormGroup.value;

    this.workshop= new Workshop(about, description, contacts);

    console.log(this.workshop)

    this.http.post(this.url, this.workshop);
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.keyWords.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(word: string): void {
    const index = this.keyWords.indexOf(word);

    if (index >= 0) {
      this.keyWords.splice(index, 1);
    }
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.keyWords.push(event.option.viewValue);
    this.keyWordsInput.nativeElement.value = '';
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allkeyWords.filter(fruit => fruit.toLowerCase().indexOf(filterValue) === 0);
  }

}
