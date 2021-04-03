import { HttpClient } from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { Workshop } from 'src/app/shared/models/workshop.model';



@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.scss']
})
export class CreateActivityComponent implements OnInit {

  workshop;
  url='/Workshop/Create';

  WorkshopFormArray: FormArray;
  AboutFormGroup: FormGroup;
  DescriptionFormGroup: FormGroup;
  ContactsFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private http: HttpClient) {
    
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
      keyWords: new FormControl('')
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
    const contacts = this.ContactsFormGroup.value;

    this.workshop= new Workshop(about, description, contacts);

    this.http.post(this.url, this.workshop);
  }

}
