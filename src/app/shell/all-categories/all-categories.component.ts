import { Component, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { SearchResponse } from '../../shared/models/search.model';
import { PaginationConstants } from '../../shared/constants/constants';
import { NavBarName } from '../../shared/enum/navigation-bar';
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
  directionsParameters: DirectionParameters = {
    searchString: ''
  };

  constructor(private store: Store, public navigationBarService: NavigationBarService) {}

  ngOnInit(): void {
    const directionItemsPerPage = PaginationConstants.DIRECTIONS_PER_PAGE;
    Util.setPaginationParams(this.directionsParameters, this.currentPage, directionItemsPerPage);

    this.store.dispatch([
      new AddNavPath(this.navigationBarService.createOneNavPath({ name: NavBarName.TopDestination, isActive: false, disable: true })),
      new GetFilteredDirections(this.directionsParameters)
    ]);
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    Util.setPaginationParams(this.directionsParameters, this.currentPage, this.directionsParameters.size);
    this.store.dispatch(new GetFilteredDirections(this.directionsParameters));
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    Util.setPaginationParams(this.directionsParameters, this.currentPage, itemsPerPage);
    this.store.dispatch(new GetFilteredDirections(this.directionsParameters));
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DeleteNavPath());
  }
}
