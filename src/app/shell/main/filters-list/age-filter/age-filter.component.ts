import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-age-filter',
  templateUrl: './age-filter.component.html',
  styleUrls: ['./age-filter.component.scss']
})
export class AgeFilterComponent implements OnInit {

  showModalFilter = false;

  constructor() { }

  ngOnInit(): void {
  }
  toggleModalFilter(): void{
    this.showModalFilter = !this.showModalFilter;
  }
}
