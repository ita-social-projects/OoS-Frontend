import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, takeUntil, map, take } from 'rxjs/operators';
import { HistoryLogTabTitles, TypeChange } from '../../../../shared/enum/enumUA/tech-admin/history-log';
import { NoResultsTitle } from '../../../../shared/enum/enumUA/no-results';
import {
  ApplicationHistory,
  DropdownData,
  FilterData,
  ProviderAdminHistory,
  ProviderHistory
} from '../../../../shared/models/history-log.model';
import { GetApplicationHistory, GetProviderAdminHistory, GetProviderHistory } from '../../../../shared/store/admin.actions';
import { AdminState } from '../../../../shared/store/admin.state';
import { PaginationConstants } from '../../../../shared/constants/constants';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { ProviderOptions, ProviderAdminOptions, ApplicationOptions } from '../../../../shared/constants/drop-down';
import { SearchResponse } from '../../../../shared/models/search.model';
import { PopNavPath, PushNavPath } from '../../../../shared/store/navigation.actions';
import { NavBarName } from '../../../../shared/enum/navigation-bar';
import { HistoryLogTypes } from '../../../../shared/enum/history.log';
import { Util } from '../../../../shared/utils/utils';

@Component({
  selector: 'app-history-log',
  templateUrl: './history-log.component.html',
  styleUrls: ['./history-log.component.scss']
})
export class HistoryLogComponent implements OnInit, OnDestroy {
  readonly HistoryLogTabTitles = HistoryLogTabTitles;
  readonly HistoryLogTypes = HistoryLogTypes;
  readonly typeChange = TypeChange;
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
  }

  onTabChange(event: MatTabChangeEvent): void {
    this.currentPage = PaginationConstants.firstPage;
    this.tabIndex = event.index;
    this.getTableData();

    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { tab: HistoryLogTabsUkrReverse[event.tab.textLabel] }
      queryParams: { tab: HistoryLogTypes[this.tabIndex] },
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
        this.providersHistory$
          .pipe(take(1))
          .subscribe((providerHistories: SearchResponse<ProviderHistory[]>) => (this.totalAmount = providerHistories.totalAmount));
        break;
      case HistoryLogTypes.ProviderAdmins:
        this.store.dispatch([new GetProviderAdminHistory(filters, searchString)]);
        this.dropdownData = ProviderAdminOptions;
        this.providerAdminHistory$
          .pipe(take(1))
          .subscribe(
            (providerAdminHistories: SearchResponse<ProviderAdminHistory[]>) => (this.totalAmount = providerAdminHistories.totalAmount)
          );
        break;
      case HistoryLogTypes.Applications:
        this.store.dispatch([new GetApplicationHistory(filters, searchString)]);
        this.dropdownData = ApplicationOptions;
        this.applicationHistory$
          .pipe(take(1))
          .subscribe((applicationHistories: SearchResponse<ApplicationHistory[]>) => (this.totalAmount = applicationHistories.totalAmount));
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
