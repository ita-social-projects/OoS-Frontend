import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { Actions, Select, Store, ofAction } from '@ngxs/store';
import { Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { PaginationConstants } from 'shared/constants/constants';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { Role } from 'shared/enum/role';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { PaginationParameters } from 'shared/models/query-parameters.model';
import { SearchResponse } from 'shared/models/search.model';
import { WorkshopCard } from 'shared/models/workshop.model';
import { PushNavPath } from 'shared/store/navigation.actions';
import { DeleteFavoriteWorkshop, GetFavoriteWorkshopsByUserId } from 'shared/store/parent.actions';
import { ParentState } from 'shared/store/parent.state';
import { Util } from 'shared/utils/utils';
import { ParentComponent } from '../parent.component';

@Component({
  selector: 'app-favorite-workshops',
  templateUrl: './favorite-workshops.component.html',
  styleUrls: ['./favorite-workshops.component.scss']
})
export class FavoriteWorkshopsComponent extends ParentComponent implements OnInit, OnDestroy {
  @Select(ParentState.favoriteWorkshopsCard)
  public favoriteWorkshopsCard$: Observable<SearchResponse<WorkshopCard[]>>;

  public readonly Role = Role;
  public readonly noFavoriteWorkshops = NoResultsTitle.noFavoriteWorkshops;

  public paginationParameters: PaginationParameters = {
    size: PaginationConstants.WORKSHOPS_PER_PAGE,
    from: 0
  };
  public currentPage: PaginationElement = PaginationConstants.firstPage;

  private totalAmount: number;

  constructor(
    protected store: Store,
    protected matDialog: MatDialog,
    private actions$: Actions
  ) {
    super(store, matDialog);
  }

  public initParentData(): void {
    this.store.dispatch(new GetFavoriteWorkshopsByUserId(this.paginationParameters));

    this.favoriteWorkshopsCard$
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe((favoriteWorkshopsCard: SearchResponse<WorkshopCard[]>) => (this.totalAmount = favoriteWorkshopsCard.totalAmount));

    this.actions$
      .pipe(ofAction(DeleteFavoriteWorkshop))
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.store.dispatch(new GetFavoriteWorkshopsByUserId(this.paginationParameters)));
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getWorkshops();
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.paginationParameters.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  protected addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.Favorite,
        isActive: false,
        disable: true
      })
    );
  }

  private getWorkshops(): void {
    Util.setFromPaginationParam(this.paginationParameters, this.currentPage, this.totalAmount);
    this.store.dispatch(new GetFavoriteWorkshopsByUserId(this.paginationParameters));
  }
}
