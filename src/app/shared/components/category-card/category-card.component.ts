import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Category } from '../../models/category.model';
import { SetCategory } from '../../store/filter.actions';


@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss']
})
export class CategoryCardComponent implements OnInit {

  @Input() categoryCard: Category;
  @Input() icons: {};

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  selectCategory(id: number){
    this.store.dispatch(new SetCategory(id));
  }
}
