import { Provider } from 'src/app/shared/models/provider.model';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ProviderService } from 'src/app/shared/services/provider/provider.service';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AdminState } from 'src/app/shared/store/admin.state';
import { GetAllProviders } from 'src/app/shared/store/admin.actions';
import { ProviderAdminTitles } from 'src/app/shared/enum/enumUA/provider-admin';
import { MatSort, Sort } from '@angular/material/sort';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss'],
})
export class ProviderListComponent implements OnInit {
  @Select(AdminState.providers)
  providers$: Observable<Provider[]>;

  displayedColumns: string[] = [
    'fullTitle',
    'ownership',
    'edrpouIpn',
    'licence',
    'city',
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

  providers: Provider[] = [
    {
      userId: '1',
      id: '1',
      shortTitle: 'dnu',
      fullTitle: 'ДНУ ім.Гончара',
      ownership: 'Державна',
      edrpouIpn: '9897653',
      legalAddress: {
        city: 'Київ',
        street: 'вул.Рокосовського',
        buildingNumber: '1',
      },
      director: 'Антонів',
      email: 'qw@we',
      status: true,
      website: 'google.com',
      phoneNumber: '777777777777777',
      founder: '',
      actualAddress: {
        city: 'Київ',
        street: 'вул.Фокосовського',
        buildingNumber: '5',
      },
    },
    {
      userId: '3',
      id: '4',
      shortTitle: 'balni dance',
      fullTitle: 'Школа бальних танців',
      ownership: 'State',
      edrpouIpn: '3897653',
      legalAddress: {
        city: 'Київ',
        street: 'вул.Фокосовського',
        buildingNumber: '5',
      },
      director: 'Ярко',
      email: '',
      status: true,
      website: 'google.com',
      phoneNumber: '777777777777777',
      founder: '',
      actualAddress: {
        city: 'Київ',
        street: 'вул.Фокосовського',
        buildingNumber: '5',
      },
    },
    {
      userId: '2',
      id: '3',
      shortTitle: '4',
      fullTitle: 'Школа молодого фотографа',
      ownership: 'Приватна',
      edrpouIpn: '2897653',
      legalAddress: {
        city: 'Львів',
        street: 'вул.Вокосовського',
        buildingNumber: '7',
      },
      director: 'Лесів',
      email: '',
      status: true,
      website: 'google.com',
      phoneNumber: '777777777777',
      founder: '',
      actualAddress: {
        city: 'Київ',
        street: 'вул.Фокосовського',
        buildingNumber: '5',
      },
    },
  ];

  dataSource = new MatTableDataSource(this.providers);

  constructor(
    private store: Store,
    public providerService: ProviderService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}
  providerAdminTitles: ProviderAdminTitles;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.getAllProviders();
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
}
