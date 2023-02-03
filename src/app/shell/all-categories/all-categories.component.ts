import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SearchResponse } from '../../shared/models/search.model';
import { PaginationConstants } from '../../shared/constants/constants';
import { NavBarName } from '../../shared/enum/enumUA/navigation-bar';
import { Direction, DirectionParameters } from '../../shared/models/category.model';
import { PaginationElement } from '../../shared/models/paginationElement.model';
import { NavigationBarService } from '../../shared/services/navigation-bar/navigation-bar.service';
import { GetFilteredDirections } from '../../shared/store/admin.actions';
import { AdminState } from '../../shared/store/admin.state';
import { AddNavPath, DeleteNavPath } from '../../shared/store/navigation.actions';
import { Util } from '../../shared/utils/utils';

@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.component.html',
  styleUrls: ['./all-categories.component.scss']
})
export class AllCategoriesComponent implements OnInit, OnDestroy {
  @Select(AdminState.filteredDirections)
  filteredDirections$: Observable<SearchResponse<Direction[]>>;

  currentPage: PaginationElement = PaginationConstants.firstPage;
  totalAmount: number;
  destroy$: Subject<boolean> = new Subject<boolean>();
  directionsParameters: DirectionParameters = {
    searchString: '',
    size: PaginationConstants.DIRECTIONS_PER_PAGE
  };

  constructor(private store: Store, public navigationBarService: NavigationBarService) {}

  ngOnInit(): void {
    this.getDirections();
    this.filteredDirections$
      .pipe(takeUntil(this.destroy$))
      .subscribe((directions: SearchResponse<Direction[]>) => (this.totalAmount = directions.totalAmount));
    this.store.dispatch(
      new AddNavPath(this.navigationBarService.createOneNavPath({ name: NavBarName.TopDestination, isActive: false, disable: true }))
    );
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getDirections();
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.directionsParameters.size = itemsPerPage;
    this.getDirections();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new DeleteNavPath());
  }

  private getDirections(): void {
    Util.setFromPaginationParam(this.directionsParameters, this.currentPage, this.totalAmount);
    this.store.dispatch(new GetFilteredDirections(this.directionsParameters));
  }
}
