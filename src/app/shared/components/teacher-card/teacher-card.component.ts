import { Component, Input, OnInit } from '@angular/core';
import { Constants } from '../../constants/constants';
import { Teacher } from '../../models/teacher.model';

@Component({
  selector: 'app-teacher-card',
  templateUrl: './teacher-card.component.html',
  styleUrls: ['./teacher-card.component.scss']
})
export class TeacherCardComponent implements OnInit {
  readonly tooltipPosition = Constants.MAT_TOOL_TIP_POSITION_BELOW;

  @Input() teacher: Teacher;

  teacherFullName: string;

  constructor() {
  }

  ngOnInit(): void {
    this.teacherFullName = `${this.teacher.lastName} ${this.teacher.firstName}`
  }

}
