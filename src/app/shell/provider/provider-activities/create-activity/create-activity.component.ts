import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { Workshop } from 'src/app/shared/models/workshop.model';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable, throwError} from 'rxjs';
import {catchError, map, startWith} from 'rxjs/operators';
import { ProviderActivitiesService } from 'src/app/shared/services/provider-activities/provider-activities.service';



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
  allWorkshops;
  url='/Workshop/Create';

  WorkshopFormArray: FormArray;
  AboutFormGroup: FormGroup;
  DescriptionFormGroup: FormGroup;
  ContactsFormGroup: FormGroup;

  @ViewChild('keyWordsInput') keyWordsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private formBuilder: FormBuilder, private http: HttpClient, private providerActivititesService:  ProviderActivitiesService) {

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
      head: new FormControl(''),
      keyWords: new FormControl(''),
    });
  }
  
  ngOnInit() {

  }

  onSubmit() {
    const about = this.AboutFormGroup.value;
    const description = this.DescriptionFormGroup.value;
    description.keyWords = this.keyWords;

    this.workshop= new Workshop(about, description);

    console.log(this.workshop)

    
    this.providerActivititesService.createWorkshop(this.workshop);
  }
  
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.keyWords.push(value.trim());
    }

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

  upload(event):void{
    console.log(event.target.files)
   }

}
