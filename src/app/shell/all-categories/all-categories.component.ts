import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { PaginationConstants } from 'src/app/shared/constants/constants';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { Direction, DirectionsFilter } from 'src/app/shared/models/category.model';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { NavigationBarService } from 'src/app/shared/services/navigation-bar/navigation-bar.service';
import { GetFilteredDirections } from 'src/app/shared/store/admin.actions';
import { AdminState } from 'src/app/shared/store/admin.state';
import { GetDirections } from 'src/app/shared/store/meta-data.actions';
import { MetaDataState } from 'src/app/shared/store/meta-data.state';
import { AddNavPath, DeleteNavPath } from 'src/app/shared/store/navigation.actions';
import { OnPageChangeDirections, SetDirectionsPerPage } from 'src/app/shared/store/paginator.actions';
import { PaginatorState } from 'src/app/shared/store/paginator.state';

@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.component.html',
  styleUrls: ['./all-categories.component.scss']
})
export class AllCategoriesComponent implements OnInit, OnDestroy {

  @Select(PaginatorState.directionsPerPage)
  directionsPerPage$: Observable<number>;
  @Select(AdminState.filteredDirections)
  filteredDirections$: Observable<DirectionsFilter>;

  currentPage: PaginationElement = PaginationConstants.firstPage;

  constructor(
    private store: Store,
    public navigationBarService: NavigationBarService,
  ) { }

  ngOnInit(): void {
    this.store.dispatch([
      new AddNavPath(this.navigationBarService.createOneNavPath(
        { name: NavBarName.TopDestination, isActive: false, disable: true }
      )),
      new GetFilteredDirections(),
    ]);
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch([new OnPageChangeDirections(page), new GetFilteredDirections()]);
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.store.dispatch([new SetDirectionsPerPage(itemsPerPage), new GetFilteredDirections()]);
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }

}
