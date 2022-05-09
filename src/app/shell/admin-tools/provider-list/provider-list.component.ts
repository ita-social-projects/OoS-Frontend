import { Component, EventEmitter, OnInit } from '@angular/core';
import { AdminProviderList } from 'src/app/shared/enum/enumUA/provider-admin';
import { Provider } from 'src/app/shared/models/provider.model';
import { InfoBoxService } from 'src/app/shared/services/info-box/info-box.service';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss'],
})
export class ProviderListComponent implements OnInit {
  adminProviderList: AdminProviderList;
  infoShow = new EventEmitter();

  tiles = [
    'Назва закладу',
    'Форма власності',
    'Ліцензія №',
    'Населений пункт',
    'Адреса',
    'Директор',
    'Статус',
    '',
  ];

  providers: Provider[] = [
    {
      userId: '1',
      id: '1',
      shortTitle: '1',
      fullTitle: 'ДНУ ім.Гончара',
      ownership: 'Державна',
      edrpouIpn: '3897653',
      legalAddress: {
        city: 'Київ',
        street: 'вул.Рокосовського',
        buildingNumber: '1',
      },
      director: 'Антонів',
      email: '',
      status: true,
    },
  ];

  constructor() {}

  ngOnInit(): void {}

  onInfoShow(): void {    
  }
}
