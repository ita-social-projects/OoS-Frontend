import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-create-teacher',
  templateUrl: './create-teacher.component.html',
  styleUrls: ['./create-teacher.component.scss', './validation.component.scss']
})
export class CreateTeacherComponent implements OnInit {

  TeacherFormArray = new FormArray([]);
  @Output() passTeacherFormArray = new EventEmitter();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.onAddTeacher();
  }

  /**
  * This method add new FormGroup to teh FormArray
  */
  onAddTeacher(): void {
    this.TeacherFormArray.push(this.onCreateNewForm());
    this.passTeacherFormArray.emit(this.TeacherFormArray);
  }

  /**
  * This method create new FormGroup
  * @param FormArray array
  */
  onCreateNewForm(): FormGroup {
    const teacherFormGroup = this.fb.group({
      img: new FormControl(''),
      lastName: new FormControl(''),
      firstName: new FormControl(''),
      middleName: new FormControl(''),
      birthDay: new FormControl(''),
      description: new FormControl(''),
    });
    return teacherFormGroup;
  }

  /**
  * This method delete form from teh FormArray by index
  * @param index
  */
  onDeleteForm(index): void {
    this.TeacherFormArray.removeAt(index)
  }
}
