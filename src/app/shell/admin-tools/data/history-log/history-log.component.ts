import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject, merge } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, startWith, takeUntil } from 'rxjs/operators';

import { PaginationConstants } from 'shared/constants/constants';
import { ApplicationOptions, ParentsBlockingByAdminOptions, EmployeeOptions, ProviderOptions } from 'shared/constants/drop-down';
import { NavBarName } from 'shared/enum/enumUA/navigation-bar';
import { NoResultsTitle } from 'shared/enum/enumUA/no-results';
import { HistoryLogTabTitles } from 'shared/enum/enumUA/tech-admin/history-log';
import { FilterOptions, HistoryLogTypes } from 'shared/enum/history.log';
import { Role } from 'shared/enum/role';
import {
  ApplicationHistory,
  DateFilters,
  DropdownData,
  FilterData,
  ParentsBlockingByAdminHistory,
  EmployeeHistory,
  ProviderHistory
} from 'shared/models/history-log.model';
import { PaginationElement } from 'shared/models/pagination-element.model';
import { SearchResponse } from 'shared/models/search.model';
import {
  GetApplicationHistory,
  GetParentsBlockingByAdminHistory,
  GetEmployeeHistory,
  GetProviderHistory
} from 'shared/store/admin.actions';
import { AdminState } from 'shared/store/admin.state';
import { PopNavPath, PushNavPath } from 'shared/store/navigation.actions';
import { RegistrationState } from 'shared/store/registration.state';
import { Util } from 'shared/utils/utils';

@Component({
  selector: 'app-history-log',
  templateUrl: './history-log.component.html',
  styleUrls: ['./history-log.component.scss']
})
export class HistoryLogComponent implements OnInit, OnDestroy {
  @Select(AdminState.isLoading)
  public isLoadingCabinet$: Observable<boolean>;
  @Select(AdminState.providerHistory)
  public providersHistory$: Observable<SearchResponse<ProviderHistory[]>>;
  @Select(AdminState.employeeHistory)
  public employeeHistory$: Observable<SearchResponse<EmployeeHistory[]>>;
  @Select(AdminState.applicationHistory)
  public applicationHistory$: Observable<SearchResponse<ApplicationHistory[]>>;
  @Select(AdminState.parentsBlockingByAdminHistory)
  public parentsBlockingByAdminHistory$: Observable<SearchResponse<ParentsBlockingByAdminHistory[]>>;

  public readonly HistoryLogTabTitles = HistoryLogTabTitles;
  public readonly HistoryLogTypes = HistoryLogTypes;
  public readonly noHistory = NoResultsTitle.noHistory;
  public readonly Role = Role;

  public tabIndex = 0;
  public currentPage: PaginationElement = PaginationConstants.firstPage;
  public searchFormControl = new FormControl('');
  public dropdownData: DropdownData[];
  public filters: FilterData = {
    dateFrom: null,
    dateTo: null,
    size: PaginationConstants.TABLE_ITEMS_PER_PAGE
  };
  public role: string;
  public tabName: HistoryLogTypes;

  private destroy$: Subject<boolean> = new Subject<boolean>();
  private searchString: string;
  private totalAmount: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    public store: Store,
    private cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
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

    this.role = this.store.selectSnapshot<string>(RegistrationState.role);
    this.initSubscribeOnEachHistory();
  }

  public onTabChange(event: MatTabChangeEvent): void {
    this.removeExtraPropertiesFromFilters();
    this.currentPage = PaginationConstants.firstPage;
    this.tabIndex = event.index;
    this.getTableData();

    this.router.navigate(['./'], {
      relativeTo: this.route,
      queryParams: { tab: HistoryLogTypes[this.tabIndex] }
    });
  }

  public onItemsPerPageChange(itemsPerPage: number): void {
    this.filters.size = itemsPerPage;
    this.onPageChange(PaginationConstants.firstPage);
  }

  public onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.getTableData(this.searchString);
  }

  public onFilter(event: FilterData): void {
    this.filters = { ...this.filters, ...event };
    this.currentPage = PaginationConstants.firstPage;
    this.getTableData(this.searchString);
  }

  public onDateFilter(event: DateFilters): void {
    this.filters.dateFrom = event.dateFrom;
    this.filters.dateTo = event.dateTo;
  }

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }

  private dispatchProperValue(tabIndex: number, filters: FilterData, searchString?: string): void {
    switch (tabIndex) {
      case HistoryLogTypes.Providers:
        this.store.dispatch([new GetProviderHistory(filters, searchString)]);
        this.dropdownData = ProviderOptions;
        this.tabName = HistoryLogTypes.Providers;
        break;
      case HistoryLogTypes.Employees:
        this.store.dispatch([new GetEmployeeHistory(filters, searchString)]);
        this.dropdownData = EmployeeOptions;
        this.tabName = HistoryLogTypes.Employees;
        break;
      case HistoryLogTypes.Applications:
        this.store.dispatch([new GetApplicationHistory(filters, searchString)]);
        this.dropdownData = ApplicationOptions;
        this.tabName = HistoryLogTypes.Applications;
        break;
      case HistoryLogTypes.Users:
        this.store.dispatch([new GetParentsBlockingByAdminHistory(filters, searchString)]);
        this.dropdownData = ParentsBlockingByAdminOptions;
        this.tabName = HistoryLogTypes.Users;
        break;
    }
    this.cdr.detectChanges();
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

  private initSubscribeOnEachHistory(): void {
    merge(this.providersHistory$, this.employeeHistory$, this.applicationHistory$, this.parentsBlockingByAdminHistory$)
      .pipe(filter(Boolean), takeUntil(this.destroy$))
      .subscribe(
        (history: SearchResponse<ProviderHistory[] | EmployeeHistory[] | ApplicationHistory[] | ParentsBlockingByAdminHistory[]>) =>
          (this.totalAmount = history.totalAmount)
      );
  }

  private removeExtraPropertiesFromFilters(): void {
    for (const filterParam of Object.keys(this.filters)) {
      switch (filterParam) {
        case FilterOptions.AdminType:
          delete this.filters.AdminType;
          break;
        case FilterOptions.OperationType:
          delete this.filters.OperationType;
          break;
        case FilterOptions.PropertyName:
          delete this.filters.PropertyName;
          break;
        case FilterOptions.ShowParents:
          delete this.filters.ShowParents;
          break;
      }
    }
  }
}
