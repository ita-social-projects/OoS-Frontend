import { Component, OnInit } from '@angular/core';
import { AdminProviderList } from 'src/app/shared/enum/enumUA/provider-admin';
import { Provider } from 'src/app/shared/models/provider.model';

@Component({
  selector: 'app-provider-list',
  templateUrl: './provider-list.component.html',
  styleUrls: ['./provider-list.component.scss'],
})
export class ProviderListComponent implements OnInit {
  adminProviderList: AdminProviderList;

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

  titles = [
    'title',
    'ownership',
    'licence',
    'city',
    'address',
    'director',
    'status',
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
}
