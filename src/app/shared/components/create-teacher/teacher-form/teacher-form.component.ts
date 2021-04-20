import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-teacher-form',
  templateUrl: './teacher-form.component.html',
  styleUrls: ['./teacher-form.component.scss']
})
export class TeacherFormComponent implements OnInit {

  constructor() { }

  @Input() TeacherFormGroup: FormGroup;
  @Input() index: number;
  @Input() teacherAmount: number;
  @Output() deleteForm = new EventEmitter();

  ngOnInit(): void {
  }

  onDeleteTeacher(): void {
    this.deleteForm.emit(this.index);
  }
}
