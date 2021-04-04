import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Teacher } from '../../models/teacher.model';

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
    let teacher:Teacher;
    const teachers=[];
    for(let i=0; i<this.teacherFormArray.controls.length;i++){
      teacher = new Teacher(this.teacherFormArray.controls[i].value);
      console.log(teacher)
      teachers.push(teacher)
    }
    console.log(teachers);
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
  }

}
