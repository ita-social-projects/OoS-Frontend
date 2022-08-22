import { Provider } from 'src/app/shared/models/provider.model';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ProviderService } from 'src/app/shared/services/provider/provider.service';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { AdminState } from 'src/app/shared/store/admin.state';
import { GetAllProviders, GetFilteredProviders } from 'src/app/shared/store/admin.actions';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { Constants } from 'src/app/shared/constants/constants';
import { filter, takeUntil } from 'rxjs/operators';
import { OwnershipTypeUkr } from 'src/app/shared/enum/provider';
import { DeleteNavPath, PopNavPath, PushNavPath } from 'src/app/shared/store/navigation.actions';
import { NavBarName } from 'src/app/shared/enum/navigation-bar';
import { FormControl } from '@angular/forms';
import { ChildCards } from 'src/app/shared/models/child.model';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss'],
})
export class ProviderListComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(MatSort) sort: MatSort;

  readonly constants: typeof Constants = Constants;
  readonly ownershipTypeUkr = OwnershipTypeUkr;

  @Select(AdminState.providers)
  providers$: Observable<ChildCards>;
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
  dataSource: MatTableDataSource<object>;

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
    .subscribe((providers: ChildCards) => {
      this.dataSource = new MatTableDataSource(providers?.entities);
      this.dataSource.sort = this.sort;
    });
  }

  ngAfterViewInit(): void {
  }

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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
    this.store.dispatch(new PopNavPath());
  }
}
