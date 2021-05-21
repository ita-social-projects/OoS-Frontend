import { Component, Input, OnInit } from '@angular/core';
import { Teacher } from 'src/app/shared/models/teacher.model';
import { Workshop } from 'src/app/shared/models/workshop.model';

@Component({
  selector: 'app-workshop-teachers',
  templateUrl: './workshop-teachers.component.html',
  styleUrls: ['./workshop-teachers.component.scss']
})
export class WorkshopTeachersComponent implements OnInit {

  @Input() teachers: Teacher[];

  constructor() { }

  ngOnInit(): void {
  }

}
