import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';
import { Constants } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.scss']
})
export class TeacherFormComponent implements OnInit {

  readonly constants: typeof Constants = Constants;
  today: Date = new Date();

  @Input() index: number;
  @Input() TeacherFormGroup: FormGroup;
  @Input() teacherAmount: number;
  @Output() deleteForm = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.TeacherFormGroup = this.formBuilder.group({
      description: new FormControl('', [Validators.maxLength(Constants.MAX_TEACHER_DESCRIPTION_LENGTH), Validators.required])
    });
  }

  ngOnInit(): void { }

  onDeleteTeacher(): void {
    this.deleteForm.emit(this.index);
  }
}
