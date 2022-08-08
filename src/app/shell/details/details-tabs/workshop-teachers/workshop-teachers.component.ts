import { Component, Input, OnInit } from '@angular/core';
import { NoResultsTitle } from 'src/app/shared/enum/no-results';
import { Teacher } from 'src/app/shared/models/teacher.model';

@Component({
  selector: 'app-workshop-teachers',
  templateUrl: './workshop-teachers.component.html',
  styleUrls: ['./workshop-teachers.component.scss']
})
export class WorkshopTeachersComponent {
  readonly noResultTeachers = NoResultsTitle.noTeachers;

  @Input() teachers: Teacher[];

  constructor() { }
}
