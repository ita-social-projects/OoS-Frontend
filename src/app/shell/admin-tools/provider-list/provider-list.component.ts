import { Provider } from 'src/app/shared/models/provider.model';
import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
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

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss'],
})
export class ProviderListComponent implements OnInit {
  readonly constants: typeof Constants = Constants;
  readonly ProviderListIcons = ProviderListIcons;
  provider: Provider;
  OwnershipTypeUkr: OwnershipTypeUkr;
  infoShow = new EventEmitter();

  @Select(AdminState.providers)
  providers$: Observable<Provider[]>;

  displayedColumns: string[];
  dataSource: MatTableDataSource<object> = new MatTableDataSource([{}]);

  providers: Provider[] = [
    {
      userId: '1',
      actualAddress: {
        buildingNumber: '12',
        city: 'Київ',
        district: 'ччччччч',
        latitude: 0,
        longitude: 0,
        region: 'чччччч',
        street: 'hhhhhh',
      },
      description: 'dance everywhere',
      director: 'смитьб',
      directorDateOfBirth: '1977-01-04T00:00:00',
      edrpouIpn: '37898000',
      email: 'o7@gmail.com',
      facebook: '',
      founder: 'Іваненко',
      fullTitle: 'dance777',
      id: '08d9d5cd-06df-439c-86d6-5df44b635f19',
      instagram: '',
      institutionStatusId: null,
      legalAddress: {
        buildingNumber: '3',
        city: 'Київ',
        district: 'Київська',
        id: 81,
        latitude: 0,
        longitude: 0,
        region: 'Дарницький',
        street: 'сссlllllllll',
      },
      ownership: 'State',
      phoneNumber: '777777777',
      shortTitle: 'd7',
      status: false,
      type: 4,
      website: '',
    },
    {
      userId: '1',
      actualAddress: {
        buildingNumber: '56',
        city: 'Львів',
        district: 'Львівська',
        latitude: 0,
        longitude: 0,
        region: 'ччччччч',
        street: 'Шевченко',
      },
      description: 'dance everywhere',
      director: 'смитьб',
      directorDateOfBirth: '1977-01-04T00:00:00',
      edrpouIpn: '37898000',
      email: 'o7@gmail.com',
      facebook: '',
      founder: 'Лесько',
      fullTitle: 'dance777',
      id: '08d9d5cd-06df-439c-86d6-5df44b635f19',
      instagram: '',
      institutionStatusId: null,
      legalAddress: {
        buildingNumber: '3',
        city: 'Львів',
        district: 'Івано-Франківська',
        id: 81,
        latitude: 0,
        longitude: 0,
        region: 'Дарницький',
        street: 'ссс',
      },
      ownership: 'Common',
      phoneNumber: '777777777',
      shortTitle: 'd7',
      status: true,
      type: 4,
      website: '',
    },
    {
      userId: '1',
      actualAddress: {
        buildingNumber: '45',
        city: 'ччччччч',
        district: 'чччччччч',
        latitude: 0,
        longitude: 0,
        region: 'чччччччччч',
        street: 'hhhhhh',
      },
      description: 'dance everywhere',
      director: 'смитьбjjjjjjj',
      directorDateOfBirth: '1977-01-04T00:00:00',
      edrpouIpn: '77898000',
      email: 'o7@gmail.com',
      facebook: '',
      founder: 'смитььvvvvvvv',
      fullTitle: 'dance777',
      id: '08d9d5cd-06df-439c-86d6-5df44b635f19',
      instagram: '',
      institutionStatusId: null,
      legalAddress: {
        buildingNumber: '6',
        city: 'Івано-Франківськ',
        district: 'київська',
        id: 81,
        latitude: 0,
        longitude: 0,
        region: 'голосіївський',
        street: 'ссс',
      },
      ownership: 'Private',
      phoneNumber: '677777777',
      shortTitle: 'd7',
      status: false,
      type: 4,
      website: 'http://taniecstudio.pl/',
    },
  ];

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
    this.dataSource = new MatTableDataSource(this.providers);
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

  onInfoShow(element: Element, event): void {
    this.infoShow.emit({ element, child: this.provider });
    event.stopPropagation();
  }
}
