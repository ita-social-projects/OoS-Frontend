import { Component, Input, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { FilterState } from '../../store/filter.state';
import { Observable } from 'rxjs';
import { TeacherCard } from '../../models/teachers-card.model';

@Component({
  selector: 'app-teacher-card',
  templateUrl: './teacher-card.component.html',
  styleUrls: ['./teacher-card.component.scss']
})
export class TeacherCardComponent implements OnInit {

  @Select(FilterState.teacherCards) $teachersCards: Observable<TeacherCard[]>;
  @Input() cards;

  constructor() {
  }

  ngOnInit(): void {
  }

}
