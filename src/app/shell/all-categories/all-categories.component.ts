import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SearchResponse } from '../../shared/models/searchResponse.model';
import { PaginationConstants } from '../../shared/constants/constants';
import { NavBarName } from '../../shared/enum/navigation-bar';
import { Direction } from '../../shared/models/category.model';
import { PaginationElement } from '../../shared/models/paginationElement.model';
import { NavigationBarService } from '../../shared/services/navigation-bar/navigation-bar.service';
import { GetFilteredDirections } from '../../shared/store/admin.actions';
import { AdminState } from '../../shared/store/admin.state';
import { AddNavPath, DeleteNavPath } from '../../shared/store/navigation.actions';
import { OnPageChangeDirections, SetDirectionsPerPage } from '../../shared/store/paginator.actions';
import { PaginatorState } from '../../shared/store/paginator.state';

@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.component.html',
  styleUrls: ['./all-categories.component.scss']
})
export class AllCategoriesComponent implements OnInit, OnDestroy {

  @Select(PaginatorState.directionsPerPage)
    directionsPerPage$: Observable<number>;
  @Select(AdminState.filteredDirections)
    filteredDirections$: Observable<SearchResponse<Direction[]>>;

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
