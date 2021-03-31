import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-categories-filter',
  templateUrl: './categories-filter.component.html',
  styleUrls: ['./categories-filter.component.scss']
})
export class CategoriesFilterComponent implements OnInit {

  selectedCategory: string;

  constructor() {}

  ngOnInit(): void {
  }

}
