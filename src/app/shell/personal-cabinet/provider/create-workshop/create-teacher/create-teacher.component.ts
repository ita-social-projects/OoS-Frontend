import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Teacher } from 'src/app/shared/models/teacher.model';

@Component({
  selector: 'app-create-teacher',
  templateUrl: './create-teacher.component.html',
  styleUrls: ['./create-teacher.component.scss']
})
export class CreateTeacherComponent implements OnInit {

  TeacherFormArray: FormArray = new FormArray([]);
  @Input() teachers: Teacher[];
  @Output() passTeacherFormArray = new EventEmitter();

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    if (this.teachers?.length) {
      this.teachers.forEach((teahcer: Teacher) => this.onAddTeacher(teahcer));
    } else {
      this.onAddTeacher();
    }
  }

  /**
  * This method add new FormGroup to teh FormArray
  */
  onAddTeacher(teacher?: Teacher): void {
    this.TeacherFormArray.push(this.createNewForm(teacher));
    this.passTeacherFormArray.emit(this.TeacherFormArray);
  }

  /**
  * This method create new FormGroup
  * @param FormArray array
  */
  private createNewForm(teacher?: Teacher): FormGroup {
    const teacherFormGroup = this.fb.group({
      img: new FormControl(''),
      lastName: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      middleName: new FormControl('', Validators.required),
      dateOfBirth: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
    });

    teacher && teacherFormGroup.patchValue(teacher, { emitEvent: false });
    return teacherFormGroup;
  }

  /**
  * This method delete form from teh FormArray by index
  * @param index
  */
  onDeleteForm(index: number): void {
    this.TeacherFormArray.removeAt(index);
  }
}
