import { HttpClient } from '@angular/common/http';
import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { Workshop } from 'src/app/shared/models/workshop.model';

import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocompleteSelectedEvent, MatAutocomplete} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {Observable, throwError} from 'rxjs';
import { map, startWith} from 'rxjs/operators';
import { ProviderActivitiesService } from 'src/app/shared/services/provider-activities/provider-activities.service';
import { Address } from 'src/app/shared/models/address.model';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { ActivatedRoute, Router } from '@angular/router';



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

  workshop:Workshop;
  url='/Workshop/Create';

  AboutFormGroup: FormGroup;
  DescriptionFormGroup: FormGroup;
  AddressFormGroup: FormGroup;
  TeacherFormArray: FormArray;

  @ViewChild('keyWordsInput') keyWordsInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;

  constructor(private formBuilder: FormBuilder, 
    private http: HttpClient, 
    private providerActivititesService:  ProviderActivitiesService,
    private route: ActivatedRoute,
    private router: Router ) {

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
  
  ngOnInit() {}

  onSubmit() {
    const about = this.AboutFormGroup.value;
    const description = this.DescriptionFormGroup.value;
    const info = this.AddressFormGroup.value;
    const address= new Address(info);
    const teachers=[];
    for(let i=0; i<this.TeacherFormArray.controls.length;i++){
       let teacher: Teacher = new Teacher(this.TeacherFormArray.controls[i].value);
       teachers.push(teacher)
    }
    
    this.workshop= new Workshop(about,description,address,teachers);

    this.http.post('Workshop/Create', this.workshop);
     
     this.router.navigate(['provider/cabinet', 'activities']);
    
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

   addressForm(form):void{
     this.AddressFormGroup=form;
   }
   teacherArray(array):void{
    this.TeacherFormArray=array;
   }


}
