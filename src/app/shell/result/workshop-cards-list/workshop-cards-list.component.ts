import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
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
import { SetFilterPagination } from 'shared/store/filter.actions';
import { FilterState } from 'shared/store/filter.state';
import { Util } from 'shared/utils/utils';
import { WINDOW } from 'ngx-window-token';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-workshop-cards-list',
  templateUrl: './workshop-cards-list.component.html',
  styleUrls: ['./workshop-cards-list.component.scss']
})
export class WorkshopCardsListComponent implements OnInit, OnDestroy {
  @Input() public workshops$: Observable<SearchResponse<WorkshopCard[]>>;
  @Input() public role: string;

  @Select(FilterState.isLoading)
  public isLoadingResultPage$: Observable<boolean>;

  public currentPage: PaginationElement = { ...PaginationConstants.firstPage };
  public paginationParameters: PaginationParameters = { size: PaginationConstants.WORKSHOPS_PER_PAGE, from: 0 };
  public readonly noResultWorkshops = NoResultsTitle.noResult;
  public readonly Role = Role;

  public parent: boolean;
  public workshops: SearchResponse<WorkshopCard[]>;
  public destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(
    public store: Store,
    private readonly route: ActivatedRoute,
    @Inject(WINDOW) private readonly window: Window
  ) {}

  public ngOnInit(): void {
    this.workshops$
      .pipe(
        takeUntil(this.destroy$),
        filter((workshops: SearchResponse<WorkshopCard[]>) => !!workshops)
      )
      .subscribe((workshops: SearchResponse<WorkshopCard[]>) => {
        this.workshops = workshops;
      });

    this.setInitialPage();
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = { ...page };
    this.getWorkshops();
    Util.scrollToTop(this.window);
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
    this.store.dispatch(new SetFilterPagination(this.paginationParameters));
  }

  private setInitialPage(): void {
    const filterFromQuery = Util.parseFilterStateQuery(this.route.snapshot.queryParams.filter || null);
    const from = filterFromQuery.from ?? 0;
    const size = filterFromQuery.size ?? PaginationConstants.WORKSHOPS_PER_PAGE;

    this.paginationParameters.from = from;
    this.currentPage.element = Math.floor(from / size) + 1;
  }
}
