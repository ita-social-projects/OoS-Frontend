import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.scss']
})
export class TeacherFormComponent implements OnInit {

  @Input() index: number;
  @Input() TeacherFormGroup: FormGroup;
  @Input() teacherAmount: number;

  @Output() deleteForm = new EventEmitter();

  constructor() { }

  ngOnInit(): void { }

  onDeleteTeacher(): void {
    this.deleteForm.emit(this.index);
  }
}
