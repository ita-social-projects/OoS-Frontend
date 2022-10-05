import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { debounceTime, distinctUntilChanged, filter, takeUntil, startWith, map, skip } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { Constants, PaginationConstants } from '../../../../shared/constants/constants';
import { ApplicationTitles } from '../../../../shared/enum/enumUA/applications';
import { ApplicationIcons } from '../../../../shared/enum/applications';
import { AdminState } from '../../../../shared/store/admin.state';
import { Provider, ProviderCards } from '../../../../shared/models/provider.model';
import { PaginatorState } from '../../../../shared/store/paginator.state';
import { PaginationElement } from '../../../../shared/models/paginationElement.model';
import { ProviderService } from '../../../../shared/services/provider/provider.service';
import { GetFilteredProviders } from '../../../../shared/store/admin.actions';
import { PopNavPath, PushNavPath } from '../../../../shared/store/navigation.actions';
import { NavBarName } from '../../../../shared/enum/navigation-bar';
import { OnPageChangeAdminTable, SetItemsPerPage } from '../../../../shared/store/paginator.actions';
import { OwnershipTypeUkr } from '../../../../shared/enum/enumUA/provider';
@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss'],
})
export class ProviderListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;

  readonly constants: typeof Constants = Constants;
  readonly ownershipTypeUkr = OwnershipTypeUkr;
  readonly providerTitleUkr = ApplicationTitles;
  readonly providerAdminIcons = ApplicationIcons;

  @Select(AdminState.providers)
  providers$: Observable<ProviderCards>;
  @Select(PaginatorState.itemsPerPage)
  itemsPerPage$: Observable<number>;

  provider: Provider;
  destroy$: Subject<boolean> = new Subject<boolean>();
  isInfoDisplayed: boolean;
  displayedColumns: string[] = [
    'fullTitle',
    'ownership',
    'edrpouIpn',
    'licence',
    'city',
    'street',
    'director',
    'email',
    'website',
    'shortTitle',
    'phoneNumber',
    'founder',
    'actualAddress',
    'status',
    'star',
  ];
  filterFormControl: FormControl = new FormControl('');
  dataSource = new MatTableDataSource([{}]);
  currentPage: PaginationElement = PaginationConstants.firstPage;
  totalEntities: number;
  searchString: string;

  constructor(private liveAnnouncer: LiveAnnouncer, private store: Store, public providerService: ProviderService) {}

  ngOnInit(): void {
    this.store.dispatch([
      new GetFilteredProviders(),
      new PushNavPath(
        {
          name: NavBarName.Providers,
          isActive: false,
          disable: true,
        },
      ),
    ]);
    this.providers$
    .pipe(
      takeUntil(this.destroy$),
      filter(providers => !!providers)
    )
    .subscribe((providers: ProviderCards) => {
      this.dataSource = new MatTableDataSource(providers?.entities);
      this.dataSource.sort = this.sort;
    });

    this.filterFormControl.valueChanges
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        startWith(''),
        skip(1),
        debounceTime(1000),
        map((value: string) => value.trim())
      )
      .subscribe((searchString: string) => {
        this.searchString = searchString;
        this.store.dispatch(new GetFilteredProviders(searchString));
      });
  }

  ngAfterViewInit(): void { }

  onViewProviderInfo(provider: Provider): void {
    this.provider = provider;
    this.isInfoDisplayed = true;
  }

  announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch([new OnPageChangeAdminTable(page), new GetFilteredProviders(this.searchString)]);
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.store.dispatch([new SetItemsPerPage(itemsPerPage), new GetFilteredProviders(this.searchString)]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }
}
