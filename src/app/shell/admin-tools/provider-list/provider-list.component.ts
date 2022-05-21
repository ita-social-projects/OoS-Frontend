import { Provider } from 'src/app/shared/models/provider.model';
import { AfterViewInit, Component, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ProviderService } from 'src/app/shared/services/provider/provider.service';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AdminState } from 'src/app/shared/store/admin.state';
import { GetAllProviders } from 'src/app/shared/store/admin.actions';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';
import { Constants } from 'src/app/shared/constants/constants';
import { ProviderListIcons } from 'src/app/shared/enum/provider-admin';
import { filter } from 'rxjs/operators';
import { OwnershipTypeUkr } from 'src/app/shared/enum/provider';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss'],
})
export class ProviderListComponent implements OnInit, AfterViewInit {
  readonly constants: typeof Constants = Constants;
  readonly ProviderListIcons = ProviderListIcons;
  readonly ownershipTypeUkr = OwnershipTypeUkr;

  @Select(AdminState.providers)
  providers$: Observable<Provider[]>;

  provider: Provider;
  open: boolean;

  displayedColumns: string[] = [
    'fullTitle',
    'ownership',
    'edrpouIpn',
    'licence',
    'legalAddress',
    'address',
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
  dataSource;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private store: Store,
    public providerService: ProviderService
  ) {}
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.getAllProviders();
  }

  ngAfterViewInit() {
    this.providers$
      .pipe(filter((providers) => !!providers))
      .subscribe((providers) => {
        this.dataSource = new MatTableDataSource(providers);
        this.dataSource.sort = this.sort;
      });
  }

  getAllProviders() {
    this.store.dispatch(new GetAllProviders());
  }

  getProviderById(id, provider) {
    this.providerService.getProviderById(id);
    this.provider = provider;
    this.open = true;
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
