import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { WorkshopCard } from '../../../shared/models/workshop.model';
import { NoResultsTitle } from '../../../shared/enum/no-results';
import { Role } from '../../../shared/enum/role';
import { PaginationElement } from '../../../shared/models/paginationElement.model';
import { GetFilteredWorkshops, SetFilterPagination } from '../../../shared/store/filter.actions';
import { FilterState } from '../../../shared/store/filter.state';
import { SearchResponse } from '../../../shared/models/search.model';
import { PaginationParameters } from '../../../shared/models/queryParameters.model';
import { Util } from '../../../shared/utils/utils';

@Component({
  selector: 'app-workshop-cards-list',
  templateUrl: './workshop-cards-list.component.html',
  styleUrls: ['./workshop-cards-list.component.scss']
})
export class WorkshopCardsListComponent implements OnInit, OnDestroy {
  readonly noResultWorkshops = NoResultsTitle.noResult;
  readonly Role = Role;

  @Input() workshops$: Observable<SearchResponse<WorkshopCard[]>>;
  @Input() paginationParameters: PaginationParameters;
  @Input() role: string;
  @Input() currentPage: PaginationElement;

  @Select(FilterState.isLoading)
  isLoadingResultPage$: Observable<boolean>;

  isVisible = false;
  parent: boolean;
  workshops: SearchResponse<WorkshopCard[]>;
  destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public store: Store) {}

  ngOnInit(): void {
    this.workshops$
      .pipe(
        takeUntil(this.destroy$),
        filter((workshops: SearchResponse<WorkshopCard[]>) => !!workshops)
      )
      .subscribe((workshops: SearchResponse<WorkshopCard[]>) => (this.workshops = workshops));
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    Util.setPaginationParams(this.paginationParameters, this.currentPage, this.paginationParameters.size);
    this.store.dispatch([new SetFilterPagination(this.paginationParameters), new GetFilteredWorkshops()]);
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    Util.setPaginationParams(this.paginationParameters, this.currentPage, itemsPerPage);
    this.store.dispatch([new SetFilterPagination(this.paginationParameters), new GetFilteredWorkshops()]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
