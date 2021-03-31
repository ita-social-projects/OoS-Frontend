import { Component, Input, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { Category } from '../../models/category.model';
import { SetCategory } from '../../store/filter.actions';
import { GetCategoriesIcons } from '../../store/meta-data.actions';
import { MetaDataState } from '../../store/meta-data.state';


@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss']
})
export class CategoryCardComponent implements OnInit {

  @Input() categoryCard: Category;

  @Select(MetaDataState.categoriesIcons) icons$: Observable<any>;

  icons: {};

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(new GetCategoriesIcons());
    this.icons$.subscribe(data => this.icons = data);
  }

  selectCategory(id: number){
    this.store.dispatch(new SetCategory(id));
  }
}
