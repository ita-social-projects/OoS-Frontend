import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { PaginationConstants } from 'shared/constants/constants';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { Role } from 'shared/enum/role';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { PaginationParameters } from 'shared/models/query-parameters.model';
import { SearchResponse } from 'shared/models/search.model';
import { WorkshopCard } from 'shared/models/workshop.model';
import { GetFilteredWorkshops, SetFilterPagination } from 'shared/store/filter.actions';
import { FilterState } from 'shared/store/filter.state';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-workshop-cards-list',
  templateUrl: './workshop-cards-list.component.html',
  styleUrls: ['./workshop-cards-list.component.scss']
})
export class WorkshopCardsListComponent implements OnInit, OnDestroy {
  @Input() public workshops$: Observable<SearchResponse<WorkshopCard[]>>;
  @Input() public paginationParameters: PaginationParameters;
  @Input() public role: string;
  @Input() public currentPage: PaginationElement;

  @Select(FilterState.isLoading)
  public isLoadingResultPage$: Observable<boolean>;

  public readonly noResultWorkshops = NoResultsTitle.noResult;
  public readonly Role = Role;

  public parent: boolean;
  public workshops: SearchResponse<WorkshopCard[]>;
  public destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public store: Store) {}

  public ngOnInit(): void {
    this.workshops$
      .pipe(
        takeUntil(this.destroy$),
        filter((workshops: SearchResponse<WorkshopCard[]>) => !!workshops)
      )
      .subscribe((workshops: SearchResponse<WorkshopCard[]>) => (this.workshops = workshops));
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getWorkshops();
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.paginationParameters.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  private getWorkshops(): void {
    Util.setFromPaginationParam(this.paginationParameters, this.currentPage, this.workshops?.totalAmount);
    this.store.dispatch([new SetFilterPagination(this.paginationParameters), new GetFilteredWorkshops()]);
  }
}
