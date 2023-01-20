import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, startWith, takeUntil, map } from 'rxjs/operators';
import {
  HistoryLogTabsUkr,
  HistoryLogTabsUkrReverse,
  TypeChange,
  Tabs,
} from '../../../../shared/enum/enumUA/tech-admin/history-log-tabs';
import { NoResultsTitle } from '../../../../shared/enum/no-results';
import {
  ApplicationHistory,
  DropdownData,
  FilterData,
  ProviderAdminHistory,
  ProviderHistory,
} from '../../../../shared/models/history-log.model';
import {
  GetApplicationHistory,
  GetProviderAdminHistory,
  GetProviderHistory,
} from '../../../../shared/store/admin.actions';
import { AdminState } from '../../../../shared/store/admin.state';
import { PaginationConstants } from '../../../../shared/constants/constants';
import { PaginatorState } from '../../../../shared/store/paginator.state';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { ProviderOptions, ProviderAdminOptions, ApplicationOptions } from '../../../../shared/constants/drop-down';
import { OnPageChangeHistoryLog, SetTableItemsPerPage } from '../../../../shared/store/paginator.actions';
import { SearchResponse } from '../../../../shared/models/search.model';
import { PopNavPath, PushNavPath } from '../../../../shared/store/navigation.actions';
import { NavBarName } from '../../../../shared/enum/navigation-bar';

@Component({
  selector: 'app-history-log',
  templateUrl: './history-log.component.html',
  styleUrls: ['./history-log.component.scss'],
})
export class HistoryLogComponent implements OnInit, OnDestroy {
  readonly historyLogTabsUkr = HistoryLogTabsUkr;
  readonly noHistory = NoResultsTitle.noHistory;
  readonly typeChange = TypeChange;

  @Select(AdminState.isLoading)
  isLoadingCabinet$: Observable<boolean>;

  @Select(AdminState.providerHistory)
  providersHistory$: Observable<SearchResponse<ProviderHistory[]>>;
  providersHistory: SearchResponse<ProviderHistory[]>;

  @Select(AdminState.providerAdminHistory)
  providerAdminHistory$: Observable<SearchResponse<ProviderAdminHistory[]>>;
  providerAdminHistory: SearchResponse<ProviderAdminHistory[]>;

  @Select(AdminState.applicationHistory)
  applicationHistory$: Observable<SearchResponse<ApplicationHistory[]>>;
  applicationHistory: SearchResponse<ApplicationHistory[]>;

  @Select(PaginatorState.tableItemsPerPage)
  tableItemsPerPage$: Observable<number>;
  tableItemsPerPage: number;

  destroy$: Subject<boolean> = new Subject<boolean>();
  tabIndex = 0;
  searchString: string;
  currentPage: PaginationElement = PaginationConstants.firstPage;
  searchFormControl = new FormControl('');
  dropdownData: DropdownData[];
  filters: FilterData;

  constructor(private router: Router, private route: ActivatedRoute, public store: Store) {}

  ngOnInit(): void {
    this.dispatchProperValue(this.tabIndex);
    this.addNavPath();

    this.providersHistory$
      .pipe(takeUntil(this.destroy$), filter(Boolean))
      .subscribe((providersHistory: SearchResponse<ProviderHistory[]>) => (this.providersHistory = providersHistory));

    this.providerAdminHistory$
      .pipe(takeUntil(this.destroy$), filter(Boolean))
      .subscribe(
        (providerAdminHistory: SearchResponse<ProviderAdminHistory[]>) =>
          (this.providerAdminHistory = providerAdminHistory)
      );

    this.applicationHistory$
      .pipe(takeUntil(this.destroy$), filter(Boolean))
      .subscribe(
        (applicationHistory: SearchResponse<ApplicationHistory[]>) => (this.applicationHistory = applicationHistory)
      );

    this.tableItemsPerPage$
      .pipe(takeUntil(this.destroy$))
      .subscribe((itemsPerPage: number) => (this.tableItemsPerPage = itemsPerPage));

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
          this.dispatchProperValue(this.tabIndex, this.filters, searchString);
        }
      });
  }

  onTabChange(event: MatTabChangeEvent): void {
    this.tabIndex = event.index;
    this.dispatchProperValue(event.index);

    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { tab: HistoryLogTabsUkrReverse[event.tab.textLabel] },
    });
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.tableItemsPerPage = itemsPerPage;
    this.store.dispatch([new SetTableItemsPerPage(itemsPerPage)]);
    this.dispatchProperValue(this.tabIndex);
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch([new OnPageChangeHistoryLog(page)]);
    this.dispatchProperValue(this.tabIndex, this.filters, this.searchString);
  }

  private dispatchProperValue(tabIndex: number, filters?: FilterData, searchString?: string): void {
    switch (tabIndex) {
      case Tabs.Provider:
        this.store.dispatch([new GetProviderHistory(filters, searchString)]);
        this.dropdownData = ProviderOptions;
        break;
      case Tabs.ProviderAdmin:
        this.store.dispatch([new GetProviderAdminHistory(filters, searchString)]);
        this.dropdownData = ProviderAdminOptions;
        break;
      case Tabs.Application:
        this.store.dispatch([new GetApplicationHistory(filters, searchString)]);
        this.dropdownData = ApplicationOptions;
        break;
    }
  }

  onFilter(event: FilterData): void {
    this.filters = event;
    this.dispatchProperValue(this.tabIndex, event, this.searchString);
  }

  private addNavPath(): void {
    this.store.dispatch(
      new PushNavPath({
        name: NavBarName.HistoryLog,
        isActive: false,
        disable: true,
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }
}
