import { Component, Input, OnInit } from '@angular/core';
import { Teacher } from '../../models/teacher.model';

@Component({
  selector: 'app-teacher-card',
  templateUrl: './teacher-card.component.html',
  styleUrls: ['./teacher-card.component.scss']
})
export class TeacherCardComponent implements OnInit {

  @Input() teacher: Teacher;

  constructor() {
  }

  ngOnInit(): void {
  }

}
