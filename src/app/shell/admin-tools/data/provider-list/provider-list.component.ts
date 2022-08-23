import { Provider, ProviderCards } from 'src/app/shared/models/provider.model';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProviderService } from 'src/app/shared/services/provider/provider.service';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { AdminState } from 'src/app/shared/store/admin.state';
import { GetFilteredProviders } from 'src/app/shared/store/admin.actions';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { Constants, PaginationConstants } from 'src/app/shared/constants/constants';
import { debounceTime, distinctUntilChanged, filter, takeUntil, startWith, map } from 'rxjs/operators';
import { OwnershipTypeUkr } from 'src/app/shared/enum/provider';
import { DeleteNavPath, PopNavPath, PushNavPath } from 'src/app/shared/store/navigation.actions';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { FormControl } from '@angular/forms';
import { PaginationElement } from 'src/app/shared/models/paginationElement.model';
import { OnPageChangeAdminTable, SetProvidersPerPage } from 'src/app/shared/store/paginator.actions';
import { PaginatorState } from 'src/app/shared/store/paginator.state';
import { ApplicationTitles } from 'src/app/shared/enum/enumUA/applications';
import { ApplicationIcons } from 'src/app/shared/enum/applications';

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
  @Select(PaginatorState.providersPerPage)
  providersPerPage$: Observable<number>;

  
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

  constructor(private _liveAnnouncer: LiveAnnouncer, private store: Store, public providerService: ProviderService) {}

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
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  onPageChange(page: PaginationElement): void {
    this.currentPage = page;
    this.store.dispatch([new OnPageChangeAdminTable(page), new GetFilteredProviders(this.searchString)]);
  }

  onItemsPerPageChange(itemsPerPage: number): void {
    this.store.dispatch([new SetProvidersPerPage(itemsPerPage), new GetFilteredProviders(this.searchString)]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }
}
