import { Provider } from 'src/app/shared/models/provider.model';
import { Component, OnInit, ViewChild } from '@angular/core';
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
import { OwnershipTypeUkr } from 'src/app/shared/enum/provider';
// import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss'],
})
export class ProviderListComponent implements OnInit {
  readonly constants: typeof Constants = Constants;
  readonly ProviderListIcons = ProviderListIcons;
  OwnershipTypeUkr: OwnershipTypeUkr;
  provider: Provider;

  @Select(AdminState.providers)
  providers$: Observable<Provider[]>;

  displayedColumns: string[];
  dataSource: MatTableDataSource<object> = new MatTableDataSource([{} || null]);

  constructor(
    private store: Store,
    public providerService: ProviderService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.getAllProviders();

    this.displayedColumns = [
      'fullTitle',
      'ownership',
      'edrpouIpn',
      'licence',
      // 'city',
      'address',
      'director',
      'email',
      'website',
      'shortTitle',
      'phoneNumber',
      'founder',
      // 'actualAddress',
      'status',
      'star',
    ];

    // this.dataSource = new MatTableDataSource(this.providers$);
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  getAllProviders() {
    this.store.dispatch(new GetAllProviders());
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  ownershipType(ownership: string) {
    switch (ownership) {
      case 'State':
        return 'Державна';
      case 'Common':
        return 'Громадська організація';
      default:
        return 'Приватна';
    }
  }
}
