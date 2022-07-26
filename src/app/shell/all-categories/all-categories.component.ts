import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { Direction } from 'src/app/shared/models/category.model';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { GetDirections } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';

@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.component.html',
  styleUrls: ['./all-categories.component.scss']
})
export class AllCategoriesComponent implements OnInit, OnDestroy {

  @Select(MetaDataState.directions)
  directions$: Observable<Direction[]>;

  constructor(
    private store: Store,
    public navigationBarService: NavigationBarService,
  ) { }

  ngOnInit(): void {
    this.store.dispatch([
      new AddNavPath(this.navigationBarService.createOneNavPath(
        { name: NavBarName.TopDestination, isActive: false, disable: true }
      )),
      new GetDirections()
    ]);
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }

}
