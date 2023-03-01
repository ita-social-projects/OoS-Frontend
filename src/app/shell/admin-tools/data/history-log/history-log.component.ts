import { Observable, Subject } from 'rxjs';
import {
    debounceTime, distinctUntilChanged, filter, map, startWith, takeUntil
} from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';

import { PaginationConstants } from '../../../../shared/constants/constants';
import {
    ApplicationOptions, ProviderAdminOptions, ProviderOptions
} from '../../../../shared/constants/drop-down';
import { NavBarName } from '../../../../shared/enum/enumUA/navigation-bar';
import { NoResultsTitle } from '../../../../shared/enum/enumUA/no-results';
import { HistoryLogTabTitles } from '../../../../shared/enum/enumUA/tech-admin/history-log';
import { HistoryLogTypes } from '../../../../shared/enum/history.log';
import {
    ApplicationHistory, DropdownData, FilterData, ProviderAdminHistory, ProviderHistory
} from '../../../../shared/models/history-log.model';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { SearchResponse } from '../../../../shared/models/search.model';
import {
    GetApplicationHistory, GetProviderAdminHistory, GetProviderHistory
} from '../../../../shared/store/admin.actions';
import { AdminState } from '../../../../shared/store/admin.state';
import { PopNavPath, PushNavPath } from '../../../../shared/store/navigation.actions';
import { Util } from '../../../../shared/utils/utils';

@Component({
  selector: 'app-history-log',
  templateUrl: './history-log.component.html',
  styleUrls: ['./history-log.component.scss']
})
export class HistoryLogComponent implements OnInit, OnDestroy {
  readonly HistoryLogTabTitles = HistoryLogTabTitles;
  readonly HistoryLogTypes = HistoryLogTypes;
  readonly noHistory = NoResultsTitle.noHistory;

  @Select(AdminState.isLoading)
  isLoadingCabinet$: Observable<boolean>;
  @Select(AdminState.providerHistory)
  providersHistory$: Observable<SearchResponse<ProviderHistory[]>>;
  @Select(AdminState.providerAdminHistory)
  providerAdminHistory$: Observable<SearchResponse<ProviderAdminHistory[]>>;
  @Select(AdminState.applicationHistory)
  applicationHistory$: Observable<SearchResponse<ApplicationHistory[]>>;

  destroy$: Subject<boolean> = new Subject<boolean>();
  tabIndex = 0;
  searchString: string;
  currentPage: PaginationElement = PaginationConstants.firstPage;
  searchFormControl = new FormControl('');
  totalAmount: number;
  dropdownData: DropdownData[];
  filters: FilterData = {
    dateFrom: null,
    dateTo: null,
    options: null,
    size: PaginationConstants.TABLE_ITEMS_PER_PAGE
  };

  constructor(private router: Router, private route: ActivatedRoute, public store: Store) {}

  ngOnInit(): void {
    this.getTableData();
    this.addNavPath();

    this.searchFormControl.valueChanges
      .pipe(
        distinctUntilChanged(),
        startWith(''),
        debounceTime(2000),
        takeUntil(this.destroy$),
        map((value: string) => value.trim())
      )
      .subscribe((searchString: string) => {
        if (this.searchFormControl.dirty) {
          this.searchString = searchString;

          this.currentPage = PaginationConstants.firstPage;
          this.getTableData(searchString);
        }
      });

    this.providersHistory$
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe((providerHistories: SearchResponse<ProviderHistory[]>) => (this.totalAmount = providerHistories.totalAmount));
    this.providerAdminHistory$
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe(
        (providerAdminHistories: SearchResponse<ProviderAdminHistory[]>) => (this.totalAmount = providerAdminHistories.totalAmount)
      );
    this.applicationHistory$
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe((applicationHistories: SearchResponse<ApplicationHistory[]>) => {
        console.log(applicationHistories);
        this.totalAmount = applicationHistories.totalAmount;
      });
  }

  onTabChange(event: MatTabChangeEvent): void {
    this.currentPage = PaginationConstants.firstPage;
    this.tabIndex = event.index;
    this.getTableData();

    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { tab: HistoryLogTypes[this.tabIndex] }
    });
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.filters.size = itemsPerPage;
    this.getTableData();
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getTableData(this.searchString);
  }

  onFilter(event: FilterData): void {
    this.filters = { ...this.filters, ...event };
    this.currentPage = PaginationConstants.firstPage;
    this.getTableData(this.searchString);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }

  private dispatchProperValue(tabIndex: number, filters: FilterData, searchString?: string): void {
    switch (tabIndex) {
      case HistoryLogTypes.Providers:
        this.store.dispatch([new GetProviderHistory(filters, searchString)]);
        this.dropdownData = ProviderOptions;
        break;
      case HistoryLogTypes.ProviderAdmins:
        this.store.dispatch([new GetProviderAdminHistory(filters, searchString)]);
        this.dropdownData = ProviderAdminOptions;
        break;
      case HistoryLogTypes.Applications:
        this.store.dispatch([new GetApplicationHistory(filters, searchString)]);
        this.dropdownData = ApplicationOptions;
        break;
    }
  }

  private addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.HistoryLog,
        isActive: false,
        disable: true
      })
    );
  }

  private getTableData(searchString?: string): void {
    Util.setFromPaginationParam(this.filters, this.currentPage, this.totalAmount);
    this.dispatchProperValue(this.tabIndex, this.filters, searchString);
  }
}
