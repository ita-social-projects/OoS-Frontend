import { Provider } from 'src/app/shared/models/provider.model';
import { Component, OnInit } from '@angular/core';
import { ProviderService } from 'src/app/shared/services/provider/provider.service';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AdminState } from 'src/app/shared/store/admin.state';
import { GetAllProviders } from 'src/app/shared/store/admin.actions';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss'],
})
export class ProviderListComponent implements OnInit {
  displayedColumns = [
    'title',
    'ownership',
    'edrpouIpn',
    'licence',
    'city',
    'address',
    'director',
    'status',
    'star',
  ];

  constructor(private store: Store, public providerService: ProviderService) {}

  @Select(AdminState.providers)
  providers$: Observable<Provider[]>;

  ngOnInit() {
    this.getAllProviders();
  }

  getAllProviders() {
    this.store.dispatch(new GetAllProviders());
  }

  providers: Provider[] = [
    {
      userId: '1',
      id: '1',
      shortTitle: '1',
      fullTitle: 'ДНУ ім.Гончара',
      ownership: 'Державна',
      edrpouIpn: '9897653',
      legalAddress: {
        city: 'Київ',
        street: 'вул.Рокосовського',
        buildingNumber: '1',
      },
      director: 'Антонів',
      email: '',
      status: true,
    },
    {
      userId: '3',
      id: '4',
      shortTitle: '1',
      fullTitle: 'Школа бальних танців',
      ownership: 'Державна',
      edrpouIpn: '3897653',
      legalAddress: {
        city: 'Київ',
        street: 'вул.Фокосовського',
        buildingNumber: '5',
      },
      director: 'Ярко',
      email: '',
      status: true,
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
    },
  ];
}
