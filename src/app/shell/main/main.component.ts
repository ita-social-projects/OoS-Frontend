import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { GetCategories, GetTopWorkshops } from 'src/app/shared/store/filter.actions';
import { ChangePage } from 'src/app/shared/store/app.actions';
import { FilterState } from 'src/app/shared/store/filter.state';
import { RegistrationState } from '../../shared/store/registration.state';
import { Category } from 'src/app/shared/models/category.model';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { GetCategoriesIcons } from 'src/app/shared/store/meta-data.actions';
import { Workshop } from '../../shared/models/workshop.model';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],

})
export class MainComponent implements OnInit {

  @Select(FilterState.topWorkshops)
  workshops$: Observable<Workshop[]>;
  @Select(RegistrationState.isAuthorized)
  isAuthorized$: Observable<boolean>;
  @Select(FilterState.categories)
  categories$: Observable<Category[]>;
  @Select(MetaDataState.categoriesIcons) icons$: Observable<any>;

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
