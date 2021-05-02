import { Component, OnInit } from '@angular/core';
import { CategorySelect } from '../../models/category-select.model';


@Component({
  selector: 'app-filters-list',
  templateUrl: './filters-list.component.html',
  styleUrls: ['./filters-list.component.scss']
})
export class FiltersListComponent implements OnInit {
  ageValues: string[] = ["0-5", "6-10", "11-14", "15-16"];
  selectedAgeRange: string[] = [];

  constructor() { }

  ngOnInit(): void { }

  onAgeRangeCheck(ageRange, event): void {
    (event) ? this.selectedAgeRange.push(ageRange) : this.selectedAgeRange.splice(this.selectedAgeRange.indexOf(ageRange), 1);
  }
}
