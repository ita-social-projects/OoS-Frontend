import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-teacher',
  templateUrl: './create-teacher.component.html',
  styleUrls: ['./create-teacher.component.scss']
})
export class CreateTeacherComponent implements OnInit {

  TeacherFormArray = new FormArray([]);
  @Output() passTeacherFormArray = new EventEmitter();

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.addTeacher();
  }

  addTeacher(): void {
    this.TeacherFormArray.push(this.newForm());
    this.passTeacherFormArray.emit(this.TeacherFormArray);
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
  
  deleteForm(index):void{
    this.TeacherFormArray.removeAt(index)
  }
}
