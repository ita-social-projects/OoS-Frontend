import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';
import { emit } from 'process';

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.scss']
})
export class TeacherFormComponent implements OnInit {

  @Input() index: number;
  @Input() TeacherFormGroup: FormGroup;
  descriptionMaxLength = 300;
  @Input() teacherAmount: number;
  @Output() deleteForm = new EventEmitter();


  constructor(private formBuilder: FormBuilder) {
    this.TeacherFormGroup = this.formBuilder.group({
      description: new FormControl('', [Validators.maxLength(this.descriptionMaxLength), Validators.required])
    })
   
  }

  ngOnInit(): void {
  }

  onDeleteTeacher(): void {
    this.deleteForm.emit(this.index);
  }
}
