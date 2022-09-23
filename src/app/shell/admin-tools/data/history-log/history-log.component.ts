import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  startWith,
  takeUntil,
  map,
} from 'rxjs/operators';
import { PaginationConstants } from 'src/app/shared/constants/constants';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import {
  OnPageChangeHistoryLog,
  SetHistoryItemsPerPage,
} from 'src/app/shared/store/paginator.actions';
import { PaginatorState } from 'src/app/shared/store/paginator.state';
import { HistoryLogTabsUkr, HistoryLogTabsUkrReverse, TypeChange, Tabs } from '../../../../shared/enum/enumUA/tech-admin/history-log-tabs';
import { NoResultsTitle } from '../../../../shared/enum/no-results';
import { ApplicationsHistory, DropdownData, FilterData, ProviderAdminsHistory, ProvidersHistory } from '../../../../shared/models/history-log.model';
import { GetApplicationHistory, GetProviderAdminHistory, GetProviderHistory } from '../../../../shared/store/admin.actions';
import { AdminState } from '../../../../shared/store/admin.state';
import { ApplicationOptions, ProviderAdminOptions, ProviderOptions } from 'src/app/shared/constants/drop-down';

@Component({
  selector: 'app-history-log',
  templateUrl: './history-log.component.html',
  styleUrls: ['./history-log.component.scss'],
})
export class HistoryLogComponent implements OnInit, OnDestroy {
  readonly historyLogTabsUkr = HistoryLogTabsUkr;
  readonly noHistory = NoResultsTitle.noHistory;

  @Select(AdminState.isLoading)
  isLoadingCabinet$: Observable<boolean>;

  @Select(AdminState.providerHistory)
  providersHistory$: Observable<ProvidersHistory>;

  @Select(AdminState.providerAdminHistory)
  providerAdminHistory$: Observable<ProviderAdminsHistory>;

  @Select(AdminState.applicationHistory)
  applicationHistory$: Observable<ApplicationsHistory>;

  @Select(PaginatorState.historyItemsPerPage)
  historyItemsPerPage$: Observable<number>;
  historyItemsPerPage: number;

  destroy$: Subject<boolean> = new Subject<boolean>();
  provider: ProvidersHistory;
  providerAdmin: ProviderAdminsHistory;
  application: ApplicationsHistory;
  tableData: any = [];
  tabIndex = 0;
  searchString: string;
  currentPage: PaginationElement = PaginationConstants.firstPage;
  searchFormControl = new FormControl('');
  dropdownData: DropdownData[];
  filters: FilterData;
  readonly typeChange = TypeChange;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public store: Store
  ) {}

  ngOnInit(): void {
    this.dispatchProperValue(this.tabIndex);

    this.providersHistory$
      .pipe(
        takeUntil(this.destroy$),
        filter((provider: ProvidersHistory) => !!provider)
      )
      .subscribe((provider: ProvidersHistory) => {
        this.tableData = provider.entities;
        this.provider = this.tableData;
      });

    this.providerAdminHistory$
      .pipe(
        takeUntil(this.destroy$),
        filter((providerAdmin: ProviderAdminsHistory) => !!providerAdmin)
      )
      .subscribe((providerAdmin: ProviderAdminsHistory) => {
        this.tableData = providerAdmin.entities;
        this.providerAdmin = this.tableData;
      });

    this.applicationHistory$
      .pipe(
        takeUntil(this.destroy$),
        filter((application: ApplicationsHistory) => !!application)
      )
      .subscribe((application: ApplicationsHistory) => {
        this.tableData = application.entities;
        this.application = this.tableData;
      });

    this.historyItemsPerPage$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (historyItemsPerPage: number) =>
          (this.historyItemsPerPage = historyItemsPerPage)
      );

    this.searchFormControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        startWith(''),
        debounceTime(2000),
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
    this.historyItemsPerPage = itemsPerPage;
    this.store.dispatch([new SetHistoryItemsPerPage(itemsPerPage)]);
    this.dispatchProperValue(this.tabIndex);
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch([new OnPageChangeHistoryLog(page)]);
    this.dispatchProperValue(this.tabIndex, this.filters, this.searchString);
  }

  dispatchProperValue(tabIndex: number, filters?: FilterData, searchString?: string): void {
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
