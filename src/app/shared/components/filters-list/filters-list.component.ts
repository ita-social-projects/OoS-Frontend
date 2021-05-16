import { Component, OnInit } from '@angular/core';
import { MatCheckbox } from '@angular/material/checkbox';
@Component({
  selector: 'app-filters-list',
  templateUrl: './filters-list.component.html',
  styleUrls: ['./filters-list.component.scss']
})
export class FiltersListComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }

  onOpenRecruitment(event: MatCheckbox): void {

  }

  onClosedRecruitment(event: MatCheckbox): void {

  }
}
