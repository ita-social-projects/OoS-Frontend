import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import { Workshop } from 'src/app/shared/models/workshop.mode';



@Component({
  selector: 'app-create-activity',
  templateUrl: './create-activity.component.html',
  styleUrls: ['./create-activity.component.scss']
})
export class CreateActivityComponent implements OnInit {

  workshop;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    this.firstFormGroup = this.formBuilder.group({
      type: new FormControl(''),
      title: new FormControl(''), 
      phone: new FormControl(''),
      email: new FormControl(''),
      ageFrom: new FormControl(''),
      ageTo: new FormControl(''),
      classAmount: new FormControl('')
    });
    this.secondFormGroup = this.formBuilder.group({
      photos: new FormControl(''),
      description: new FormControl(''), 
      resources: new FormControl(''),
      direction: new FormControl(''),
      keyWords: new FormControl('')
    });
    this.thirdFormGroup = this.formBuilder.group({
      city: new FormControl(''),
      street: new FormControl(''), 
      building: new FormControl('')
    });
  }

  ngOnInit() {

  }

  onNextStep() {
    
  }

}
