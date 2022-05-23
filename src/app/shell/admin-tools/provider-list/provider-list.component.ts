import { Provider } from 'src/app/shared/models/provider.model';
import {
  AfterViewInit,
  Component,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
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
import {
  createProviderSteps,
  OwnershipTypeUkr,
} from 'src/app/shared/enum/provider';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss'],
})
export class ProviderListComponent implements OnInit, AfterViewInit {
  readonly constants: typeof Constants = Constants;
  readonly ProviderListIcons = ProviderListIcons;
  readonly ownershipTypeUkr = OwnershipTypeUkr;
  readonly createProviderSteps = createProviderSteps;

  @ViewChild(MatSort) sort: MatSort;
  @Output() institutionStatuses;
  @Select(AdminState.providers)
  providers$: Observable<Provider[]>;
  editLink: string = createProviderSteps[1];
  provider: Provider;
  open: boolean;

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
  dataSource;

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private store: Store,
    public providerService: ProviderService
  ) {}

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

  getProviderById(id, provider) {
    this.providerService.getProviderById(id);
    this.provider = provider;
    this.open = true;
  }

  announceSortChange(sortState: Sort): void {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  onCloseInfo() {
    this.open = !this.open;
    console.log('closed');
  }

  private getAllProviders(): void {
    this.store.dispatch(new GetAllProviders());
  }
}
