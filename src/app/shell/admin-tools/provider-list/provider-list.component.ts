import { Component, OnInit } from '@angular/core';
import { Provider } from 'src/app/shared/models/provider.model';

export interface Tile {
  text: string;
}

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss'],
})
export class ProviderListComponent implements OnInit {
  tiles: Tile[] = [
    { text: 'Назва закладу' },
    { text: 'Форма власності' },
    { text: 'Ліцензія №' },
    { text: 'Населений пункт' },
    { text: 'Адреса' },
    { text: 'Директор' },
    { text: 'Статус' },
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
      email:'',
      status: true,
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
