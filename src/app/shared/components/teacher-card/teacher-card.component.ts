import { Component, Input, OnInit } from '@angular/core';
import { Teacher } from '../../models/teacher.model';

@Component({
  selector: 'app-teacher-card',
  templateUrl: './teacher-card.component.html',
  styleUrls: ['./teacher-card.component.scss']
})
export class TeacherCardComponent implements OnInit {

  @Input() teacher: Teacher;

  teacherFullName: string;
  below = 'below';

  constructor() {
  }

  ngOnInit(): void {
    this.teacherFullName = `${this.teacher.lastName} ${this.teacher.firstName}`
  }

}
