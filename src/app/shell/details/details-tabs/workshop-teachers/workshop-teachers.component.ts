import { Component, Input } from '@angular/core';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { Teacher } from 'shared/models/teacher.model';

@Component({
  selector: 'app-workshop-teachers',
  templateUrl: './workshop-teachers.component.html',
  styleUrls: ['./workshop-teachers.component.scss']
})
export class WorkshopTeachersComponent {
  @Input() public teachers: Teacher[];

  public readonly noResultTeachers = NoResultsTitle.noTeachers;

  constructor() {}
}
