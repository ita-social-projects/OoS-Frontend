import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';
import { ValidationConstants } from 'src/app/shared/constants/validation';

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.scss']
})
export class TeacherFormComponent implements OnInit {

  readonly validationConstants: typeof ValidationConstants = ValidationConstants;
  today: Date = new Date();

  @Input() index: number;
  @Input() TeacherFormGroup: FormGroup;
  @Input() teacherAmount: number;
  @Input() isRelease2: boolean;

  @Output() deleteForm = new EventEmitter();

  constructor(private formBuilder: FormBuilder) {
    this.TeacherFormGroup = this.formBuilder.group({
      description: new FormControl('', [Validators.maxLength(ValidationConstants.MAX_DESCRIPTION_LENGTH_300), Validators.required])
    });
  }

  ngOnInit(): void { }

  onDeleteTeacher(): void {
    this.deleteForm.emit(this.index);
  }
}
