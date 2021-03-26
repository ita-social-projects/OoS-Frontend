import { Component, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { SetCategory } from 'src/app/shared/store/filter.actions';

@Component({
  selector: 'app-categories-filter',
  templateUrl: './categories-filter.component.html',
  styleUrls: ['./categories-filter.component.scss']
})
export class CategoriesFilterComponent implements OnInit {

  selectedCategory: string;

  constructor(private store: Store) {}

  ngOnInit(): void {
  }

  selectCategory(category: string){
    this.store.dispatch(new SetCategory(category));
  }

}
