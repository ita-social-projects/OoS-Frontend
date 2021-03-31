import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { orgCard } from 'src/app/shared/models/org-card.model';
import { GetCategories, GetPopWorkshops } from 'src/app/shared/store/filter.actions';
import { ChangePage } from 'src/app/shared/store/app.actions';
import { FilterState } from 'src/app/shared/store/filter.state';
import { Category } from 'src/app/shared/models/category.model';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

  @Select(FilterState.orgCards) orgCards$: Observable<orgCard[]>;
  @Select(FilterState.categoriesCards) categoriesCards$: Observable<Category[]>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch([new GetCategories(), new GetPopWorkshops(), new ChangePage(true)]);
  }

}
