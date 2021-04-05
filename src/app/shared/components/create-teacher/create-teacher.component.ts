import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Teacher } from '../../models/teacher.model';

@Component({
  selector: 'app-create-teacher',
  templateUrl: './create-teacher.component.html',
  styleUrls: ['./create-teacher.component.scss']
})
export class CreateTeacherComponent implements OnInit {

  teacherFormArray = new FormArray([]);
  @Output() TeachersArray = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.addTeacher();
  }

  addTeacher(): void {
    this.teacherFormArray.push(this.newForm());
  }

  newForm(): FormGroup {
    const teacherFormGroup = this.fb.group({
      lastName: new FormControl(''),
      firstName: new FormControl(''), 
      middleName: new FormControl(''),
      birthDay: new FormControl(''),
      description: new FormControl(''),
    });
    return teacherFormGroup;
  }

  onSubmit(): void {
    
  }
  
  deleteForm(index):void{
    this.teacherFormArray.removeAt(index)
  }
}
