import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetTopWorkshops } from 'src/app/shared/store/filter.actions';
import { ChangePage } from 'src/app/shared/store/app.actions';
import { FilterState } from 'src/app/shared/store/filter.state';
import { RegistrationState } from '../../shared/store/registration.state';
import { Category } from 'src/app/shared/models/category.model';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { Workshop } from '../../shared/models/workshop.model';
import { GetCategories, GetCategoriesIcons } from 'src/app/shared/store/meta-data.actions';
@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],

})

export class MainComponent implements OnInit {

  @Select(FilterState.topWorkshops)
  topWorkshops$: Observable<Workshop[]>;
  @Select(RegistrationState.isAuthorized)
  isAuthorized$: Observable<boolean>;
  @Select(FilterState.categories)
  categories$: Observable<Category[]>;
  @Select(MetaDataState.categoriesIcons)
  categoriesIcons$: Observable<any>;

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch([
      new GetCategories(),
      new GetCategoriesIcons(),
      new GetTopWorkshops(),
      new ChangePage(true)
    ]);
  }
}
