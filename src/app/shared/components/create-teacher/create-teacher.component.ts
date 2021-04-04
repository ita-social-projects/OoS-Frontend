import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-teacher',
  templateUrl: './create-teacher.component.html',
  styleUrls: ['./create-teacher.component.scss']
})
export class CreateTeacherComponent implements OnInit {

  teacherFormArray = new FormArray([]);

  constructor(private fb: FormBuilder) {
   }

  ngOnInit(): void {
    this.teacherFormArray.push(this.newForm());
  }

  addTeacher(): void {
    this.teacherFormArray.push(this.newForm());
  }
  onSubmit(): void {
    console.log(this.teacherFormArray.value);
  }

  newForm(): FormGroup {
    const teacherFormGroup = this.fb.group({
      lastName: new FormControl(''),
      firstName: new FormControl(''), 
      secondName: new FormControl(''),
      birthDate: new FormControl(''),
      description: new FormControl(''),
    });

    return teacherFormGroup;
  }
  deleteForm(index):void{
    this.teacherFormArray.removeAt(index)

    console.log(this.teacherFormArray);
  }

}
